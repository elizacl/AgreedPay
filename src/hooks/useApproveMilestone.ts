import { useState, useCallback } from "react";
import {
  invokeContract,
  STELLAR_CONFIG,
  nativeToScVal,
  SupportedWalletType,
} from "../lib/soroban";

export interface ApproveMilestoneParams {
  milestoneId: number;
  signerAddress: string; // Clave pública del cliente
  walletType?: SupportedWalletType;
  signFn?: (xdr: string) => Promise<string>;
  contractId?: string;
}

export interface UseApproveMilestoneReturn {
  execute: (params: ApproveMilestoneParams) => Promise<{
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
 * Hook para la aprobación de entrega por parte del cliente y liberación de fondos en SAC USDC.
 * Invoca el método on-chain `approve_milestone(milestone_id)` del contrato Soroban.
 */
export const useApproveMilestone = (): UseApproveMilestoneReturn => {
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
    async (params: ApproveMilestoneParams) => {
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
          throw new Error("signerAddress es requerida para aprobar el hito.");
        }

        if (typeof params.milestoneId !== "number" || params.milestoneId < 0) {
          throw new Error("milestoneId debe ser un número entero mayor o igual a 0.");
        }

        // Argumentos Soroban: milestone_id (u32)
        const milestoneIdScVal = nativeToScVal(params.milestoneId, { type: "u32" });

        const result = await invokeContract({
          contractId,
          method: "approve_milestone",
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
        const errorMsg = err?.message || err?.toString() || "Error desconocido al aprobar hito";
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

export default useApproveMilestone;
