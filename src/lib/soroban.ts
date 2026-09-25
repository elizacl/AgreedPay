import {
  rpc,
  Contract,
  TransactionBuilder,
  Account,
  Networks,
  BASE_FEE,
  nativeToScVal,
  scValToNative,
  xdr,
  Transaction,
  Address,
} from "@stellar/stellar-sdk";
import * as freighter from "@stellar/freighter-api";
import { StellarWalletsKit, Networks as KitNetworks } from "@creit-tech/stellar-wallets-kit";
import { FreighterModule } from "@creit-tech/stellar-wallets-kit/modules/freighter";

// ============================================================================
// 1. CONFIGURACIÓN DE RED Y ENTORNO
// ============================================================================

/**
 * Obtiene variables de entorno de forma compatible con Vite (import.meta.env)
 * y Node.js / Next.js (process.env).
 */
const getEnvVar = (key: string, fallback = ""): string => {
  try {
    // @ts-ignore
    if (typeof import.meta !== "undefined" && import.meta.env) {
      // @ts-ignore
      const val = import.meta.env[key] || import.meta.env[`VITE_${key}`] || import.meta.env[`PUBLIC_${key}`];
      if (val) return val;
    }
  } catch (_) {}

  try {
    if (typeof process !== "undefined" && process.env) {
      const val = process.env[key] || process.env[`VITE_${key}`] || process.env[`PUBLIC_${key}`];
      if (val) return val;
    }
  } catch (_) {}

  return fallback;
};

export const STELLAR_CONFIG = {
  rpcUrl: getEnvVar("STELLAR_RPC_URL", "https://soroban-testnet.stellar.org"),
  networkPassphrase: getEnvVar("STELLAR_NETWORK_PASSPHRASE", Networks.TESTNET),
  escrowContractId: getEnvVar("ESCROW_CONTRACT_ID", "CD6QQHMFJKOJYXNFIHSRWQTATG5AW22L6FHPFM76Y4Q2EUBFAOO563QR"),
  usdcSacContractId: getEnvVar("USDC_SAC_CONTRACT_ID", "CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA"),
  defaultProgressThreshold: 80, // 80% default según especificación RWA
  defaultTimeoutDuration: 1209600, // 14 días en segundos
  txTimeoutSeconds: 180, // Mitigación para tx_too_late
};

// ============================================================================
// 2. CLIENTE SOROBAN RPC
// ============================================================================

export const server = new rpc.Server(STELLAR_CONFIG.rpcUrl);

export const getRpcServer = (): rpc.Server => server;

// ============================================================================
// 3. TIPOS Y ENUMS DEL CONTRATO
// ============================================================================

export enum MilestoneStatus {
  Pending = "Pending",
  Submitted = "Submitted",
  Approved = "Approved",
  Disputed = "Disputed",
  RevisionRequired = "RevisionRequired", // Prórroga de 5 días otorgada por IA
  TimedOut = "TimedOut",
}

export interface Milestone {
  id: number;
  description_hash: string;
  amount: bigint;
  status: MilestoneStatus;
  submission_timestamp: number;
}

export interface ProjectConfig {
  client: string;
  freelancer: string;
  token: string;
  total_amount: bigint;
  dispute_resolver: string;
  timeout_duration: number;
  progress_threshold: number;
}

export type SupportedWalletType = "freighter" | "stellar-wallets-kit" | "cavos";

export interface ConnectedAccount {
  address: string;
  walletType: SupportedWalletType;
}

export interface SendTransactionOptions {
  walletType?: SupportedWalletType;
  signerAddress?: string;
  signFn?: (xdr: string) => Promise<string>;
}

// ============================================================================
// 4. INTEGRACIÓN DUAL DE BILLETERAS: FREIGHTER API Y STELLAR WALLETS KIT
// ============================================================================

let isWalletsKitInitialized = false;

/**
 * Inicializa @creit-tech/stellar-wallets-kit con soporte para Freighter.
 */
export const initStellarWalletsKit = (): void => {
  if (isWalletsKitInitialized) return;

  try {
    StellarWalletsKit.init({
      network: KitNetworks.TESTNET,
      modules: [new FreighterModule()],
    });
    isWalletsKitInitialized = true;
  } catch (error) {
    console.error("Error inicializando StellarWalletsKit:", error);
  }
};

/**
 * --- Métodos directos de @stellar/freighter-api ---
 */

export const isFreighterInstalled = async (): Promise<boolean> => {
  try {
    if (typeof window === "undefined") return false;
    const res = await freighter.isConnected();
    return typeof res === "boolean" ? res : Boolean(res?.isConnected);
  } catch {
    return false;
  }
};

export const connectFreighter = async (): Promise<string> => {
  const installed = await isFreighterInstalled();
  if (!installed) {
    throw new Error(
      "La extensión Freighter no está instalada o habilitada en tu navegador."
    );
  }

  const access = await freighter.requestAccess();
  const address = typeof access === "string" ? access : access?.address;

  if (!address) {
    throw new Error("No se pudo obtener la dirección de Freighter.");
  }

  return address;
};

export const signWithFreighter = async (transactionXdr: string): Promise<string> => {
  const response = await freighter.signTransaction(transactionXdr, {
    networkPassphrase: STELLAR_CONFIG.networkPassphrase,
  });

  if (typeof response === "string") {
    return response;
  }

  if (response?.error) {
    throw new Error(`Error firmando con Freighter: ${JSON.stringify(response.error)}`);
  }

  if (response?.signedTxXdr) {
    return response.signedTxXdr;
  }

  throw new Error("Respuesta inválida al firmar con Freighter.");
};

/**
 * --- Métodos con @creit-tech/stellar-wallets-kit ---
 */

export const connectWithWalletsKit = async (): Promise<string> => {
  initStellarWalletsKit();
  const { address } = await StellarWalletsKit.authModal();
  if (!address) {
    throw new Error("No se seleccionó ninguna cuenta en Stellar Wallets Kit.");
  }
  return address;
};

export const signWithWalletsKit = async (
  transactionXdr: string,
  signerAddress?: string
): Promise<string> => {
  initStellarWalletsKit();
  const result = await StellarWalletsKit.signTransaction(transactionXdr, {
    networkPassphrase: STELLAR_CONFIG.networkPassphrase,
    address: signerAddress,
  });

  if (result?.signedTxXdr) {
    return result.signedTxXdr;
  }

  throw new Error("Error al firmar transacción con Stellar Wallets Kit.");
};

export const disconnectWalletsKit = async (): Promise<void> => {
  initStellarWalletsKit();
  await StellarWalletsKit.disconnect();
};

/**
 * Conector unificado dual: permite conectar mediante Freighter directo o Wallets Kit modal.
 */
export const connectWallet = async (
  walletType: SupportedWalletType = "freighter"
): Promise<ConnectedAccount> => {
  if (walletType === "freighter") {
    const address = await connectFreighter();
    return { address, walletType: "freighter" };
  }

  if (walletType === "stellar-wallets-kit") {
    const address = await connectWithWalletsKit();
    return { address, walletType: "stellar-wallets-kit" };
  }

  if (walletType === "cavos") {
    const { connectCavosWallet } = await import("./cavos");
    const wallet = await connectCavosWallet();
    return { address: wallet.address, walletType: "cavos" };
  }

  throw new Error(`Tipo de billetera no soportado directamente: ${walletType}`);
};

/**
 * Firma unificada: despacha la firma a Freighter, Wallets Kit o Cavos según la billetera activa.
 */
export const signTransactionWithWallet = async (
  xdrString: string,
  walletType: SupportedWalletType = "freighter",
  signerAddress?: string
): Promise<string> => {
  if (walletType === "freighter") {
    return signWithFreighter(xdrString);
  }

  if (walletType === "stellar-wallets-kit") {
    return signWithWalletsKit(xdrString, signerAddress);
  }

  if (walletType === "cavos") {
    const { signGaslessXdr } = await import("./cavos");
    return signGaslessXdr(xdrString);
  }

  throw new Error(`Firmante no configurado para el tipo: ${walletType}`);
};

// ============================================================================
// 5. HELPERS DE RPC Y ORQUESTACIÓN OBLIGATORIA DE TRANSACCIONES
// ============================================================================

/**
 * Consulta la cuenta en Soroban RPC para obtener el sequence number actualizado.
 * Mitiga el error `tx_bad_seq`.
 */
export const getAccount = async (publicKey: string): Promise<Account> => {
  try {
    return await server.getAccount(publicKey);
  } catch (error: any) {
    throw new Error(
      `Error al consultar la cuenta ${publicKey} en Soroban RPC: ${error?.message || error}. Asegúrate de que esté fondeada en Testnet.`
    );
  }
};

/**
 * Simula la transacción en Soroban RPC para validar CPU, memoria y footprint de lectura/escritura.
 */
export const simulateTransaction = async (
  tx: Transaction
): Promise<rpc.Api.SimulateTransactionResponse> => {
  const simResult = await server.simulateTransaction(tx);
  if (rpc.Api.isSimulationError(simResult)) {
    throw new Error(`Fallo en simulación Soroban RPC: ${simResult.error}`);
  }
  return simResult;
};

/**
 * Ensambla la transacción con las tarifas y footprint obtenidos durante la simulación.
 */
export const assembleTransaction = (
  tx: Transaction,
  simResult: rpc.Api.SimulateTransactionResponse
): Transaction => {
  return rpc.assembleTransaction(tx, simResult).build();
};

/**
 * Envía la transacción firmada a la red Stellar.
 */
export const sendTransaction = async (
  signedTx: Transaction | string
): Promise<rpc.Api.SendTransactionResponse> => {
  const tx =
    typeof signedTx === "string"
      ? (TransactionBuilder.fromXDR(
          signedTx,
          STELLAR_CONFIG.networkPassphrase
        ) as Transaction)
      : signedTx;

  const response = await server.sendTransaction(tx);
  if (response.status === "ERROR") {
    const errorDetail = JSON.stringify(response.errorResult || response);
    throw new Error(`Error en Soroban RPC al enviar transacción: ${errorDetail}`);
  }
  return response;
};

/**
 * Hace polling de `getTransaction()` con reintentos hasta que alcance el estado SUCCESS.
 */
export const pollTransaction = async (
  txHash: string,
  maxWaitMs = 60000,
  intervalMs = 2000
): Promise<rpc.Api.GetSuccessfulTransactionResponse> => {
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitMs) {
    const status = await server.getTransaction(txHash);

    if (status.status === rpc.Api.GetTransactionStatus.SUCCESS) {
      return status;
    }

    if (status.status === rpc.Api.GetTransactionStatus.FAILED) {
      throw new Error(
        `Transacción ${txHash} falló en ledger: ${JSON.stringify(status.resultXdr)}`
      );
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error(`Tiempo de espera agotado (timeout) para la transacción: ${txHash}`);
};

/**
 * Flujo completo de orquestación de Soroban:
 * 1. Sequence fresh (getAccount) -> previene tx_bad_seq
 * 2. Construir transacción con timeout 180s -> previene tx_too_late
 * 3. simulateTransaction()
 * 4. assembleTransaction()
 * 5. Firma con billetera seleccionada (Freighter / Wallets Kit / signFn)
 * 6. sendTransaction()
 * 7. Polling getTransaction() hasta SUCCESS
 */
export const invokeContract = async ({
  contractId,
  method,
  args = [],
  signerAddress,
  walletType = "freighter",
  signFn,
}: {
  contractId: string;
  method: string;
  args?: xdr.ScVal[];
  signerAddress: string;
  walletType?: SupportedWalletType;
  signFn?: (xdr: string) => Promise<string>;
}): Promise<{
  txHash: string;
  ledger: number;
  returnValue: any;
}> => {
  // Si walletType === "cavos" y no hay signFn personalizada, ejecutar mediante Gasless Escrow con Cavos Relayer
  if (walletType === "cavos" && !signFn) {
    const { executeGaslessContractCall } = await import("./cavos");
    const gaslessRes = await executeGaslessContractCall({
      contractId,
      method,
      args,
      sponsored: true,
    });
    return {
      txHash: gaslessRes.txHash,
      ledger: 0,
      returnValue: null,
    };
  }

  // 1. Obtener sequence fresca
  const account = await getAccount(signerAddress);

  // 2. Construir transacción con contrato
  const contract = new Contract(contractId);
  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: STELLAR_CONFIG.networkPassphrase,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(STELLAR_CONFIG.txTimeoutSeconds)
    .build();

  // 3. Simular
  const simResult = await simulateTransaction(tx);

  // 4. Ensamblar con fees de simulación
  const assembledTx = assembleTransaction(tx, simResult);
  const assembledXdr = assembledTx.toXDR();

  // 5. Firmar
  let signedXdr: string;
  if (signFn) {
    signedXdr = await signFn(assembledXdr);
  } else {
    signedXdr = await signTransactionWithWallet(assembledXdr, walletType, signerAddress);
  }

  // 6. Enviar a la red
  const sendResult = await sendTransaction(signedXdr);

  // 7. Polling hasta confirmación
  const pollResult = await pollTransaction(sendResult.hash);

  // Decodificar valor de retorno si existe
  let returnValue: any = null;
  if (pollResult.returnValue) {
    try {
      returnValue = scValToNative(pollResult.returnValue);
    } catch (_) {
      returnValue = pollResult.returnValue;
    }
  }

  return {
    txHash: sendResult.hash,
    ledger: pollResult.latestLedger,
    returnValue,
  };
};

// ============================================================================
// 6. CONSULTAS DE LECTURA MEDIANTE GETLEDGERENTRIES Y BALANCES SAC USDC (SIN HORIZON)
// ============================================================================

export interface UsdcBalanceResult {
  stroops: bigint;
  formatted: string;
  decimals: 7;
  symbol: "USDC";
}

export interface EscrowContractState {
  config: ProjectConfig | null;
  milestoneCount: number;
  milestones: Milestone[];
  contractId: string;
}

/**
 * Normaliza el estado de un hito retornado por Soroban a su enum tipado.
 */
export const normalizeMilestoneStatus = (raw: any): MilestoneStatus => {
  if (!raw) return MilestoneStatus.Pending;
  const str = Array.isArray(raw)
    ? raw[0]
    : typeof raw === "object" && raw.tag
    ? raw.tag
    : String(raw);

  switch (String(str).toLowerCase()) {
    case "pending":
      return MilestoneStatus.Pending;
    case "submitted":
      return MilestoneStatus.Submitted;
    case "approved":
      return MilestoneStatus.Approved;
    case "disputed":
      return MilestoneStatus.Disputed;
    case "revisionrequired":
    case "revision_required":
      return MilestoneStatus.RevisionRequired;
    case "timedout":
    case "timed_out":
      return MilestoneStatus.TimedOut;
    default:
      return MilestoneStatus.Pending;
  }
};

/**
 * Consulta directa de ledger entries vía Soroban RPC.
 */
export const getLedgerEntries = async (
  keys: xdr.LedgerKey[]
): Promise<rpc.Api.GetLedgerEntriesResponse> => {
  return await server.getLedgerEntries(...keys);
};

const getContractDataVal = (entry: any): any => {
  if (!entry?.val) return null;
  const cd =
    typeof entry.val.contractData === "function"
      ? entry.val.contractData()
      : entry.val.contractData;
  return typeof cd?.val === "function" ? cd.val() : cd?.val;
};

const getInstanceStorage = (entry: any): any[] => {
  const cdVal = getContractDataVal(entry);
  if (!cdVal) return [];
  const inst = typeof cdVal.instance === "function" ? cdVal.instance() : cdVal.instance;
  return inst?.storage || [];
};

/**
 * Consulta el saldo en SAC USDC mediante getLedgerEntries en Soroban RPC (sin Horizon API).
 * Clave de almacenamiento en contrato SAC: DataKey::Balance(Address)
 */
export const getUsdcBalanceFromLedger = async (
  accountAddress: string,
  sacContractId: string = STELLAR_CONFIG.usdcSacContractId
): Promise<bigint> => {
  if (!sacContractId) return BigInt(0);

  try {
    const tokenAddr = new Address(sacContractId);
    const userAddr = new Address(accountAddress);

    const balanceKey = xdr.LedgerKey.contractData(
      new xdr.LedgerKeyContractData({
        contract: tokenAddr.toScAddress(),
        key: xdr.ScVal.scvVec([
          nativeToScVal("Balance", { type: "symbol" }),
          userAddr.toScVal(),
        ]),
        durability: xdr.ContractDataDurability.persistent,
      })
    );

    const response = await server.getLedgerEntries(balanceKey);

    if (response.entries && response.entries.length > 0) {
      const contractDataVal = getContractDataVal(response.entries[0]);
      if (contractDataVal) {
        const native = scValToNative(contractDataVal);

        if (typeof native === "bigint") return native;
        if (typeof native === "number") return BigInt(native);
        if (native && typeof native === "object" && native.amount !== undefined) {
          return BigInt(native.amount.toString());
        }
      }
    }
    return BigInt(0);
  } catch (error) {
    console.warn("Lectura de balance vía LedgerKey no encontrada, aplicando fallback a simulación:", error);
    return getUsdcBalanceSimulated(accountAddress, sacContractId);
  }
};

/**
 * Consulta el saldo en SAC USDC mediante simulación de balance(Address) en Soroban RPC.
 * Garantiza cumplimiento: sin Horizon API.
 */
export const getUsdcBalanceSimulated = async (
  accountAddress: string,
  sacContractId: string = STELLAR_CONFIG.usdcSacContractId
): Promise<bigint> => {
  if (!sacContractId) return BigInt(0);

  try {
    const dummyAccount = new Account(accountAddress, "0");
    const contract = new Contract(sacContractId);
    const tx = new TransactionBuilder(dummyAccount, {
      fee: BASE_FEE,
      networkPassphrase: STELLAR_CONFIG.networkPassphrase,
    })
      .addOperation(contract.call("balance", new Address(accountAddress).toScVal()))
      .setTimeout(30)
      .build();

    const simResult = await server.simulateTransaction(tx);

    if (rpc.Api.isSimulationSuccess(simResult) && simResult.result?.retval) {
      const balanceVal = scValToNative(simResult.result.retval);
      return BigInt(balanceVal.toString());
    }

    return BigInt(0);
  } catch (error) {
    console.error("Error consultando balance SAC USDC vía simulación Soroban RPC:", error);
    return BigInt(0);
  }
};

/**
 * Consulta completa de balance del token SAC USDC retornando el valor exacto en stroops (BigInt)
 * y formateado como decimal humano (ej: "150.50"), con precisión de 7 decimales.
 */
export const getUsdcBalance = async (
  accountAddress: string,
  sacContractId: string = STELLAR_CONFIG.usdcSacContractId
): Promise<UsdcBalanceResult> => {
  const stroops = await getUsdcBalanceFromLedger(accountAddress, sacContractId);
  return {
    stroops,
    formatted: formatUsdc(stroops),
    decimals: 7,
    symbol: "USDC",
  };
};

/**
 * Consulta la configuración del proyecto (ProjectConfig) del contrato de custodia
 * leyendo el almacenamiento de instancia mediante getLedgerEntries.
 */
export const getContractConfig = async (
  contractId: string = STELLAR_CONFIG.escrowContractId
): Promise<ProjectConfig | null> => {
  if (!contractId) return null;

  try {
    const instanceKey = xdr.LedgerKey.contractData(
      new xdr.LedgerKeyContractData({
        contract: new Address(contractId).toScAddress(),
        key: xdr.ScVal.scvLedgerKeyContractInstance(),
        durability: xdr.ContractDataDurability.persistent,
      })
    );

    const response = await server.getLedgerEntries(instanceKey);

    if (!response.entries || response.entries.length === 0) {
      return null;
    }

    const storage = getInstanceStorage(response.entries[0]);

    for (const item of storage) {
      const keyName = scValToNative(item.key);
      if (keyName === "Config" || (Array.isArray(keyName) && keyName[0] === "Config")) {
        const raw = scValToNative(item.val);
        return {
          client: String(raw.client || ""),
          freelancer: String(raw.freelancer || ""),
          token: String(raw.token || ""),
          total_amount: BigInt(raw.total_amount?.toString() || 0),
          dispute_resolver: String(raw.dispute_resolver || ""),
          timeout_duration: Number(raw.timeout_duration || 0),
          progress_threshold: Number(raw.progress_threshold || 80),
        };
      }
    }

    return null;
  } catch (error) {
    console.error("Error al obtener ProjectConfig con getLedgerEntries:", error);
    return null;
  }
};

/**
 * Consulta la cantidad total de hitos creados en el contrato mediante getLedgerEntries.
 */
export const getMilestoneCount = async (
  contractId: string = STELLAR_CONFIG.escrowContractId
): Promise<number> => {
  if (!contractId) return 0;

  try {
    const instanceKey = xdr.LedgerKey.contractData(
      new xdr.LedgerKeyContractData({
        contract: new Address(contractId).toScAddress(),
        key: xdr.ScVal.scvLedgerKeyContractInstance(),
        durability: xdr.ContractDataDurability.persistent,
      })
    );

    const response = await server.getLedgerEntries(instanceKey);
    if (!response.entries || response.entries.length === 0) return 0;

    const storage = getInstanceStorage(response.entries[0]);

    for (const item of storage) {
      const keyName = scValToNative(item.key);
      if (
        keyName === "MilestoneCount" ||
        (Array.isArray(keyName) && keyName[0] === "MilestoneCount")
      ) {
        const raw = scValToNative(item.val);
        return Number(raw || 0);
      }
    }

    return 0;
  } catch (error) {
    console.error("Error consultando MilestoneCount con getLedgerEntries:", error);
    return 0;
  }
};

/**
 * Consulta un hito específico por su ID del almacenamiento persistente del contrato
 * mediante getLedgerEntries.
 */
export const getMilestone = async (
  milestoneId: number,
  contractId: string = STELLAR_CONFIG.escrowContractId
): Promise<Milestone | null> => {
  if (!contractId) return null;

  try {
    const milestoneKey = xdr.LedgerKey.contractData(
      new xdr.LedgerKeyContractData({
        contract: new Address(contractId).toScAddress(),
        key: xdr.ScVal.scvVec([
          nativeToScVal("Milestone", { type: "symbol" }),
          nativeToScVal(milestoneId, { type: "u32" }),
        ]),
        durability: xdr.ContractDataDurability.persistent,
      })
    );

    const response = await server.getLedgerEntries(milestoneKey);
    if (!response.entries || response.entries.length === 0) return null;

    const contractDataVal = getContractDataVal(response.entries[0]);
    if (!contractDataVal) return null;

    const raw = scValToNative(contractDataVal);
    return {
      id: Number(raw.id ?? milestoneId),
      description_hash: String(raw.description_hash || ""),
      amount: BigInt(raw.amount?.toString() || 0),
      status: normalizeMilestoneStatus(raw.status),
      submission_timestamp: Number(raw.submission_timestamp || 0),
    };
  } catch (error) {
    console.error(`Error consultando hito ${milestoneId} con getLedgerEntries:`, error);
    return null;
  }
};

/**
 * Consulta todos los hitos del contrato en un solo lote eficiente de getLedgerEntries.
 */
export const getAllMilestones = async (
  contractId: string = STELLAR_CONFIG.escrowContractId
): Promise<Milestone[]> => {
  if (!contractId) return [];

  const count = await getMilestoneCount(contractId);
  if (count <= 0) return [];

  try {
    const keys: xdr.LedgerKey[] = [];
    const contractAddr = new Address(contractId);

    for (let i = 0; i < count; i++) {
      keys.push(
        xdr.LedgerKey.contractData(
          new xdr.LedgerKeyContractData({
            contract: contractAddr.toScAddress(),
            key: xdr.ScVal.scvVec([
              nativeToScVal("Milestone", { type: "symbol" }),
              nativeToScVal(i, { type: "u32" }),
            ]),
            durability: xdr.ContractDataDurability.persistent,
          })
        )
      );
    }

    const response = await server.getLedgerEntries(...keys);
    if (!response.entries || response.entries.length === 0) return [];

    const milestones: Milestone[] = [];
    for (const entry of response.entries) {
      const contractDataVal = getContractDataVal(entry);
      if (contractDataVal) {
        const raw = scValToNative(contractDataVal);
        milestones.push({
          id: Number(raw.id),
          description_hash: String(raw.description_hash || ""),
          amount: BigInt(raw.amount?.toString() || 0),
          status: normalizeMilestoneStatus(raw.status),
          submission_timestamp: Number(raw.submission_timestamp || 0),
        });
      }
    }

    return milestones.sort((a, b) => a.id - b.id);
  } catch (error) {
    console.error("Error consultando lista de hitos con getLedgerEntries:", error);
    return [];
  }
};

/**
 * Consulta consolidada del estado del contrato de custodia (Configuración, Conteo de Hitos y Lista de Hitos).
 */
export const getEscrowContractState = async (
  contractId: string = STELLAR_CONFIG.escrowContractId
): Promise<EscrowContractState> => {
  const [config, milestoneCount, milestones] = await Promise.all([
    getContractConfig(contractId),
    getMilestoneCount(contractId),
    getAllMilestones(contractId),
  ]);

  return {
    config,
    milestoneCount,
    milestones,
    contractId,
  };
};

/**
 * Consulta los fondos USDC en custodia bloqueados dentro del contrato de escrow.
 */
export const getEscrowLockedBalance = async (
  contractId: string = STELLAR_CONFIG.escrowContractId,
  sacContractId: string = STELLAR_CONFIG.usdcSacContractId
): Promise<UsdcBalanceResult> => {
  return await getUsdcBalance(contractId, sacContractId);
};

// ============================================================================
// 7. ARITMÉTICA PRECISA DE ENTEROS PARA USDC (7 DECIMALES - NUNCA FLOAT)
// ============================================================================

/**
 * Convierte un monto decimal en formato humano (ej: "150.5") a stroops BigInt (7 decimales).
 */
export const parseUsdc = (amount: string | number): bigint => {
  const parts = String(amount).trim().split(".");
  const intPart = parts[0] || "0";
  const decPart = (parts[1] || "").padEnd(7, "0").slice(0, 7);
  return BigInt(`${intPart}${decPart}`);
};

/**
 * Convierte stroops BigInt (ej: 1505000000n) a string decimal humano (ej: "150.5").
 */
export const formatUsdc = (stroops: bigint | string | number): string => {
  const raw = BigInt(stroops).toString().padStart(8, "0");
  const intPart = raw.slice(0, -7) || "0";
  const decPart = raw.slice(-7).replace(/0+$/, "");
  return decPart ? `${intPart}.${decPart}` : intPart;
};

// Re-exportación de utilidades comunes de Stellar SDK
export { nativeToScVal, scValToNative, Address, Contract };
