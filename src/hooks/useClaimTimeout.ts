import { useState, useCallback } from "react";
import {
  invokeContract,
  STELLAR_CONFIG,
  nativeToScVal,
  SupportedWalletType,
} from "../lib/soroban";

export interface ClaimTimeoutParams {
  milestoneId: number;
  signerAddress: string; // Clave pública del freelancer
  walletType?: SupportedWalletType;
  signFn?: (xdr: string) => Promise<string>;
  contractId?: string;
}

export interface UseClaimTimeoutReturn {
  execute: (params: ClaimTimeoutParams) => Promise<{
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

/**
 * Hook para ejecutar el retiro de fondos (cláusula anti-lockup) si el cliente no responde dentro del plazo de 14 días.
 * Invoca el método on-chain `claim_timeout(milestone_id)` del contrato Soroban.
 */
export const useClaimTimeout = (): UseClaimTimeoutReturn => {
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
    async (params: ClaimTimeoutParams) => {
      setIsLoading(true);
      setIsSuccess(false);
      setIsError(false);
      setError(null);

      try {
        const contractId = params.contractId || STELLAR_CONFIG.escrowContractId;
        if (!contractId) {
          throw new Error(
            "Contract ID no configurado. Define PUBLIC_ESCROW_CONTRACT_ID o pásalo en los parámetros."
          );
        }

        if (!params.signerAddress) {
          throw new Error("signerAddress es requerida para reclamar el timeout.");
        }

        if (typeof params.milestoneId !== "number" || params.milestoneId < 0) {
          throw new Error("milestoneId debe ser un número entero mayor o igual a 0.");
        }

        // Argumentos Soroban: milestone_id (u32)
        const milestoneIdScVal = nativeToScVal(params.milestoneId, { type: "u32" });

        const result = await invokeContract({
          contractId,
          method: "claim_timeout",
          args: [milestoneIdScVal],
          signerAddress: params.signerAddress,
          walletType: params.walletType || "freighter",
          signFn: params.signFn,
        });

        setTxHash(result.txHash);
        setLedger(result.ledger);
        setIsSuccess(true);
        return result;
      } catch (err: any) {
        const errorMsg =
          err?.message || err?.toString() || "Error desconocido al reclamar por timeout";
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

export default useClaimTimeout;
