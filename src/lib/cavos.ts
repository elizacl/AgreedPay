import {
  Cavos,
  CavosStellar,
  StellarRelayer,
  LocalDeviceUnwrapKey,
  type StellarRelayKind,
} from "@cavos/kit";
import { STELLAR_CONFIG } from "./soroban";

// ============================================================================
// 1. CONFIGURACIÓN DEL RELAYER Y ENTORNO CAVOS
// ============================================================================

const getEnvVar = (key: string, fallback = ""): string => {
  try {
    // @ts-ignore
    if (typeof import.meta !== "undefined" && import.meta.env) {
      // @ts-ignore
      const val = import.meta.env[key] || import.meta.env[`VITE_${key}`] || import.meta.env[`PUBLIC_${key}`];
      if (val) return val;
    }
  } catch (_) {}

  return fallback;
};

export const CAVOS_CONFIG = {
  appId: getEnvVar("CAVOS_APP_ID", "agreedpay-rwa-v1"),
  backendUrl: getEnvVar("CAVOS_BACKEND_URL", "https://cavos.xyz"),
  environment: (getEnvVar("CAVOS_ENV", "development") as "development" | "production"),
  network: "testnet" as const, // Mapeado a stellar-testnet en el relayer
  appSalt: "agreedpay-rwa-v1",
  usdcAssetCode: "USDC",
  // Issuer de USDC en Stellar Testnet para trustlines patrocinadas
  usdcIssuer: getEnvVar(
    "USDC_ISSUER_ADDRESS",
    "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5"
  ),
};

export interface CavosConnectOptions {
  userId?: string;
  email?: string;
  appId?: string;
  backendUrl?: string;
  environment?: "development" | "production";
  appSalt?: string;
  stellarRelayer?: StellarRelayer;
}

export interface GaslessContractCallOptions {
  contractId: string;
  method: string;
  args?: any[];
  sponsored?: boolean; // Default true: Gasless Escrow patrocinado por Cavos Relayer
  wallet?: CavosStellar;
}

export interface GaslessInvocationResult {
  txHash: string;
  signerAddress: string;
  sponsored: boolean;
}

// ============================================================================
// 2. GESTOR DE INSTANCIA DE BILLETERA CAVOS
// ============================================================================

let activeCavosWallet: CavosStellar | null = null;
let activeRelayer: StellarRelayer | null = null;

/**
 * Obtiene o inicializa el relayer de Cavos para patrocinio de gas y reservas.
 */
export const getCavosRelayer = (
  appId = CAVOS_CONFIG.appId,
  backendUrl = CAVOS_CONFIG.backendUrl,
  environment = CAVOS_CONFIG.environment
): StellarRelayer => {
  if (!activeRelayer) {
    activeRelayer = new StellarRelayer({
      baseUrl: backendUrl,
      appId,
      environment,
      network: "stellar-testnet",
    });
  }
  return activeRelayer;
};

/**
 * Conecta la billetera embebida Cavos configurando automáticamente el relayer
 * para patrocinar comisiones (Gasless) y reservas de cuenta/trustlines.
 */
export const connectCavosWallet = async (
  userId = "agreedpay-client-user",
  email?: string,
  options?: CavosConnectOptions
): Promise<CavosStellar> => {
  const appId = options?.appId || CAVOS_CONFIG.appId;
  const backendUrl = options?.backendUrl || CAVOS_CONFIG.backendUrl;
  const environment = options?.environment || CAVOS_CONFIG.environment;
  const appSalt = options?.appSalt || CAVOS_CONFIG.appSalt;

  const relayer = options?.stellarRelayer || getCavosRelayer(appId, backendUrl, environment);

  // Soporte seguro de deviceKey para entornos web (IndexedDB/WebCrypto) y testing/SSR (LocalDeviceUnwrapKey)
  let runtimeDeviceOpts: Record<string, any> = {};
  const isWebBrowser =
    typeof window !== "undefined" &&
    typeof indexedDB !== "undefined" &&
    typeof globalThis.crypto?.subtle !== "undefined";

  if (!isWebBrowser) {
    runtimeDeviceOpts.stellarDeviceKey = LocalDeviceUnwrapKey.generate();
  }

  try {
    const { InMemoryWalletRegistry } = await import("@cavos/kit");
    const wallet = await CavosStellar.connect({
      network: "stellar-testnet",
      identity: { userId, email },
      appSalt,
      appId,
      backendUrl,
      environment,
      relayer,
      deviceKey: runtimeDeviceOpts.stellarDeviceKey,
      // @ts-ignore
      registry: new InMemoryWalletRegistry(),
    });

    activeCavosWallet = wallet;
    return wallet;
  } catch (err: any) {
    console.warn("Aviso conectando CavosStellar directamente, intentando Cavos.connect:", err);
    const session = await Cavos.connect({
      chains: ["stellar"],
      defaultChain: "stellar",
      network: "testnet",
      identity: { userId, email },
      appSalt,
      stellarRelayer: relayer,
      ...runtimeDeviceOpts,
    });

    const wallet = session.wallet("stellar") as CavosStellar;
    activeCavosWallet = wallet;
    return wallet;
  }
};

/**
 * Retorna la instancia activa de la billetera Cavos en memoria.
 */
export const getActiveCavosWallet = (): CavosStellar | null => {
  return activeCavosWallet;
};

/**
 * Desconecta la sesión activa de Cavos.
 */
export const disconnectCavosWallet = (): void => {
  activeCavosWallet = null;
};

// ============================================================================
// 3. WRAPPER DE FIRMA TRANSPARENTE (require_auth) Y GASLESS ESCROW
// ============================================================================

/**
 * Ejecuta una invocación a un contrato Soroban utilizando `wallet.invokeContract`:
 * - Satisface transparentemente los requisitos de `require_auth()` del contrato inteligente
 *   firmando automáticamente los `SorobanAuthorizationEntry` que corresponden a la dirección del usuario.
 * - Habilita el patrocinio total de comisiones de red y recursos (CPU/RAM/Ledger) a través
 *   del Cavos Relayer mediante Fee-Bump (`sponsored: true`), eliminando la necesidad de tener XLM previo.
 */
export const executeGaslessContractCall = async ({
  contractId,
  method,
  args = [],
  sponsored = true,
  wallet,
}: GaslessContractCallOptions): Promise<GaslessInvocationResult> => {
  const targetWallet = wallet || activeCavosWallet;
  if (!targetWallet) {
    throw new Error(
      "No hay una billetera Cavos conectada. Llama a connectCavosWallet() antes de ejecutar la transacción."
    );
  }

  // Si la cuenta está en estado 'undeployed', la primera transacción debe desplegarla.
  // Con Cavos y el relayer configurado, el despliegue es 100% patrocinado (0 XLM).
  if (!targetWallet.isDeployed) {
    try {
      // Invocamos execute(0n) a sí misma para desplegar la cuenta on-chain mediante el relayer
      await targetWallet.execute(0n, targetWallet.address, { sponsored: true });
    } catch (deployErr) {
      console.warn("Aviso al desplegar cuenta Cavos previa a invokeContract:", deployErr);
    }
  }

  try {
    // wallet.invokeContract:
    // 1. Simula el contrato en Soroban RPC
    // 2. Firma las autorizaciones require_auth() del contrato inteligente (signSorobanAuth)
    // 3. Si sponsored: true, solicita el fee-bump al Cavos Relayer (Gasless)
    const txHash = await targetWallet.invokeContract({
      contractId,
      method,
      args,
      opts: { sponsored },
    });

    return {
      txHash,
      signerAddress: targetWallet.address,
      sponsored,
    };
  } catch (error: any) {
    throw new Error(
      `Error en executeGaslessContractCall (${method} en ${contractId}): ${
        error?.message || error
      }`
    );
  }
};

/**
 * Firma transparentemente un XDR previamente generado o ensamblado externamente
 * utilizando `wallet.signXdr`:
 * - Firma las autorizaciones de Soroban requeridas por `require_auth()`.
 * - Firma la envoltura de la transacción con la clave de control de la cuenta.
 * - Retorna el XDR firmado listo para ser enviado a la red o al relayer.
 */
export const signGaslessXdr = async (
  unsignedXdr: string,
  wallet?: CavosStellar
): Promise<string> => {
  const targetWallet = wallet || activeCavosWallet;
  if (!targetWallet) {
    throw new Error(
      "No hay una billetera Cavos activa para firmar el XDR. Conéctala primero con connectCavosWallet()."
    );
  }

  try {
    // wallet.signXdr re-firma internamente los SorobanAuthorizationEntry y la transacción
    return await targetWallet.signXdr(unsignedXdr);
  } catch (error: any) {
    throw new Error(`Error en signGaslessXdr con Cavos: ${error?.message || error}`);
  }
};

/**
 * Crea la trustline de USDC en la cuenta Stellar sin que el usuario deba poseer XLM.
 * El relayer de Cavos patrocina la reserva de subentrada (0.5 XLM) requerida por el ledger
 * mediante `beginSponsoringFutureReserves` / `endSponsoringFutureReserves`.
 */
export const ensureGaslessUsdcTrustline = async (
  options?: {
    assetCode?: string;
    issuer?: string;
    wallet?: CavosStellar;
  }
): Promise<string> => {
  const targetWallet = options?.wallet || activeCavosWallet;
  if (!targetWallet) {
    throw new Error("Billetera Cavos no conectada.");
  }

  const asset = {
    code: options?.assetCode || CAVOS_CONFIG.usdcAssetCode,
    issuer: options?.issuer || CAVOS_CONFIG.usdcIssuer,
  };

  try {
    // Patrocinio automático de la reserva de la trustline por el relayer
    return await targetWallet.addTrustline(asset, { sponsored: true });
  } catch (error: any) {
    throw new Error(`Error creando trustline patrocinada para USDC: ${error?.message || error}`);
  }
};

/**
 * Envía directamente un XDR firmado al relayer de Cavos para su patrocinio y envío a la red.
 */
export const sponsorAndSubmitWithRelayer = async (
  signedXdr: string,
  kind: StellarRelayKind = "soroban",
  relayer?: StellarRelayer
): Promise<string> => {
  const targetRelayer = relayer || activeRelayer || getCavosRelayer();
  return await targetRelayer.submit(kind, signedXdr);
};
