import { useState, useCallback } from "react";
import {
  invokeContract,
  STELLAR_CONFIG,
  parseUsdc,
  nativeToScVal,
  SupportedWalletType,
} from "../lib/soroban";

export interface DepositMilestoneInput {
  amount: string | number | bigint;
  descriptionHash: string;
}

export interface DepositParams {
  milestones?: DepositMilestoneInput[];
  amounts?: (string | number | bigint)[];
  hashes?: string[];
  progressThreshold?: number;
  signerAddress: string;
  walletType?: SupportedWalletType;
  signFn?: (xdr: string) => Promise<string>;
  contractId?: string;
}

export interface UseDepositReturn {
  execute: (params: DepositParams) => Promise<{
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
 * Hook para gestionar el depósito inicial y bloqueo de fondos en SAC USDC.
 * Invoca el método on-chain `deposit_and_create_milestones` del contrato Soroban.
 */
export const useDeposit = (): UseDepositReturn => {
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
    async (params: DepositParams) => {
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
          throw new Error("signerAddress es requerida para fondear el contrato.");
        }

        // Normalizar montos y hashes: soporta `milestones: [{ amount, descriptionHash }]` o arrays paralelos `amounts` y `hashes`
        let parsedAmounts: bigint[] = [];
        let parsedHashes: string[] = [];

        if (params.milestones && params.milestones.length > 0) {
          parsedAmounts = params.milestones.map((m) =>
            typeof m.amount === "bigint" ? m.amount : parseUsdc(m.amount)
          );
          parsedHashes = params.milestones.map((m) => m.descriptionHash);
        } else if (params.amounts && params.hashes) {
          if (params.amounts.length !== params.hashes.length) {
            throw new Error("La cantidad de montos y de hashes debe ser idéntica.");
          }
          parsedAmounts = params.amounts.map((a) =>
            typeof a === "bigint" ? a : parseUsdc(a)
          );
          parsedHashes = params.hashes;
        } else {
          throw new Error(
            "Debes proporcionar la lista de hitos a fondear con montos y hashes."
          );
        }

        if (parsedAmounts.length === 0) {
          throw new Error("Debe incluirse al menos 1 hito para crear el contrato.");
        }

        // Argumentos Soroban: amounts (Vec<i128>), hashes (Vec<String>)
        const amountsScVal = nativeToScVal(parsedAmounts, { type: "i128" });
        const hashesScVal = nativeToScVal(parsedHashes, { type: "string" });

        const result = await invokeContract({
          contractId,
          method: "deposit_and_create_milestones",
          args: [amountsScVal, hashesScVal],
          signerAddress: params.signerAddress,
          walletType: params.walletType || "freighter",
          signFn: params.signFn,
        });

        setTxHash(result.txHash);
        setLedger(result.ledger);
        setIsSuccess(true);
        return result;
      } catch (err: any) {
        const errorMsg = err?.message || err?.toString() || "Error desconocido en el depósito";
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

export default useDeposit;
