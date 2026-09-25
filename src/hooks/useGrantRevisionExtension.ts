import { useState, useCallback } from "react";
import {
  invokeContract,
  STELLAR_CONFIG,
  nativeToScVal,
  SupportedWalletType,
} from "../lib/soroban";

export interface GrantRevisionExtensionOptions {
  extensionSeconds?: number | bigint; // default: 432_000s (5 días según especificación RWA)
  signerAddress?: string; // Clave pública del dispute_resolver (agente IA o mediador)
  walletType?: SupportedWalletType;
  signFn?: (xdr: string) => Promise<string>;
  contractId?: string;
}

export interface GrantRevisionExtensionParams extends GrantRevisionExtensionOptions {
  milestoneId: number;
}

export interface UseGrantRevisionExtensionReturn {
  execute: (
    paramOrId: number | GrantRevisionExtensionParams,
    extensionSecondsOrOptions?: number | bigint | GrantRevisionExtensionOptions,
    maybeOptions?: GrantRevisionExtensionOptions
  ) => Promise<{
    txHash: string;
    ledger: number;
    returnValue: any;
  }>;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | string | null;
  txHash: string | null;
  ledger: number | null;
  reset: () => void;
}

const DEFAULT_REVISION_EXTENSION_SECONDS = 432000; // 5 días en segundos

/**
 * Hook para registrar extensiones de revisión aprobadas o arbitradas por el Agente de IA o mediador.
 * Invoca el método on-chain `grant_revision_extension(milestone_id, extension_seconds)` del contrato Soroban.
 * Cambia el estado del hito a `RevisionRequired` y posterga la fecha límite.
 */
export const useGrantRevisionExtension = (): UseGrantRevisionExtensionReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<Error | string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [ledger, setLedger] = useState<number | null>(null);

  const reset = useCallback(() => {
    setIsLoading(false);
    setIsSuccess(false);
    setIsError(false);
    setError(null);
    setTxHash(null);
    setLedger(null);
  }, []);

  const execute = useCallback(
    async (
      paramOrId: number | GrantRevisionExtensionParams,
      extensionSecondsOrOptions?: number | bigint | GrantRevisionExtensionOptions,
      maybeOptions?: GrantRevisionExtensionOptions
    ) => {
      setIsLoading(true);
      setIsSuccess(false);
      setIsError(false);
      setError(null);

      try {
        let milestoneId: number;
        let extensionSeconds: number | bigint = DEFAULT_REVISION_EXTENSION_SECONDS;
        let options: GrantRevisionExtensionOptions = {};

        // Soporte dual de llamada: execute(milestoneId, extensionSeconds, options) ó execute({ milestoneId, extensionSeconds, ... })
        if (typeof paramOrId === "number") {
          milestoneId = paramOrId;
          if (
            typeof extensionSecondsOrOptions === "number" ||
            typeof extensionSecondsOrOptions === "bigint"
          ) {
            extensionSeconds = extensionSecondsOrOptions;
            options = maybeOptions || {};
          } else if (typeof extensionSecondsOrOptions === "object" && extensionSecondsOrOptions !== null) {
            options = extensionSecondsOrOptions;
            if (options.extensionSeconds !== undefined) {
              extensionSeconds = options.extensionSeconds;
            }
          }
        } else if (typeof paramOrId === "object" && paramOrId !== null) {
          milestoneId = paramOrId.milestoneId;
          extensionSeconds = paramOrId.extensionSeconds ?? DEFAULT_REVISION_EXTENSION_SECONDS;
          options = paramOrId;
        } else {
          throw new Error("Parámetros inválidos para useGrantRevisionExtension.");
        }

        const contractId = options.contractId || STELLAR_CONFIG.escrowContractId;
        if (!contractId) {
          throw new Error(
            "Contract ID no configurado. Define PUBLIC_ESCROW_CONTRACT_ID o pásalo en los parámetros."
          );
        }

        const signerAddress = options.signerAddress;
        if (!signerAddress) {
          throw new Error(
            "signerAddress (dispute_resolver / agente IA) es requerida para otorgar la prórroga."
          );
        }

        if (typeof milestoneId !== "number" || milestoneId < 0) {
          throw new Error("milestoneId debe ser un número entero mayor o igual a 0.");
        }

        // Argumentos Soroban: milestone_id (u32), extension_seconds (u64)
        const milestoneIdScVal = nativeToScVal(milestoneId, { type: "u32" });
        const extensionSecondsScVal = nativeToScVal(BigInt(extensionSeconds), { type: "u64" });

        const result = await invokeContract({
          contractId,
          method: "grant_revision_extension",
          args: [milestoneIdScVal, extensionSecondsScVal],
          signerAddress,
          walletType: options.walletType || "freighter",
          signFn: options.signFn,
        });

        setTxHash(result.txHash);
        setLedger(result.ledger);
        setIsSuccess(true);
        return result;
      } catch (err: any) {
        const errorMsg =
          err?.message || err?.toString() || "Error desconocido al otorgar prórroga";
        setError(errorMsg);
        setIsError(true);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    execute,
    isLoading,
    isSuccess,
    isError,
    error,
    txHash,
    ledger,
    reset,
  };
};

export default useGrantRevisionExtension;
