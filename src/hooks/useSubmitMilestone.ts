import { useState, useCallback } from "react";
import {
  invokeContract,
  STELLAR_CONFIG,
  nativeToScVal,
  SupportedWalletType,
} from "../lib/soroban";

export interface SubmitMilestoneParams {
  milestoneId: number;
  proofHash: string; // Hash SHA-256 del entregable
  signerAddress: string; // Clave pública del freelancer
  walletType?: SupportedWalletType;
  signFn?: (xdr: string) => Promise<string>;
  contractId?: string;
}

export interface UseSubmitMilestoneReturn {
  execute: (params: SubmitMilestoneParams) => Promise<{
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
 * Hook para que el freelancer envíe el hash SHA-256 del entregable del hito.
 * Invoca el método on-chain `submit_milestone(milestone_id, proof_hash)` del contrato Soroban.
 */
export const useSubmitMilestone = (): UseSubmitMilestoneReturn => {
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
    async (params: SubmitMilestoneParams) => {
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
          throw new Error("signerAddress es requerida para enviar el hito.");
        }

        if (typeof params.milestoneId !== "number" || params.milestoneId < 0) {
          throw new Error("milestoneId debe ser un número entero mayor o igual a 0.");
        }

        if (!params.proofHash || typeof params.proofHash !== "string") {
          throw new Error("proofHash (hash SHA-256 del entregable) es requerido.");
        }

        // Argumentos Soroban: milestone_id (u32), proof_hash (String)
        const milestoneIdScVal = nativeToScVal(params.milestoneId, { type: "u32" });
        const proofHashScVal = nativeToScVal(params.proofHash.trim(), { type: "string" });

        const result = await invokeContract({
          contractId,
          method: "submit_milestone",
          args: [milestoneIdScVal, proofHashScVal],
          signerAddress: params.signerAddress,
          walletType: params.walletType || "freighter",
          signFn: params.signFn,
        });

        setTxHash(result.txHash);
        setLedger(result.ledger);
        setIsSuccess(true);
        return result;
      } catch (err: any) {
        const errorMsg = err?.message || err?.toString() || "Error desconocido al enviar hito";
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

export default useSubmitMilestone;
