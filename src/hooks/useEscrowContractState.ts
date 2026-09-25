import { useState, useEffect, useCallback } from "react";
import {
  getEscrowContractState,
  getUsdcBalance,
  STELLAR_CONFIG,
  type EscrowContractState,
  type UsdcBalanceResult,
} from "../lib/soroban";

export interface UseEscrowContractStateOptions {
  contractId?: string;
  accountAddress?: string;
  sacContractId?: string;
  pollIntervalMs?: number; // Auto-refresco opcional (ej: 10000ms)
}

export interface UseEscrowContractStateReturn {
  state: EscrowContractState | null;
  lockedBalance: UsdcBalanceResult | null;
  accountBalance: UsdcBalanceResult | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook de React para consultar el estado completo del contrato de custodia
 * (Configuración, Conteo de hitos, Lista de hitos y Balances SAC USDC)
 * mediante consultas de lectura `getLedgerEntries` en Soroban RPC (sin Horizon).
 */
export const useEscrowContractState = (
  options?: UseEscrowContractStateOptions
): UseEscrowContractStateReturn => {
  const [state, setState] = useState<EscrowContractState | null>(null);
  const [lockedBalance, setLockedBalance] = useState<UsdcBalanceResult | null>(null);
  const [accountBalance, setAccountBalance] = useState<UsdcBalanceResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<Error | string | null>(null);

  const contractId = options?.contractId || STELLAR_CONFIG.escrowContractId;
  const sacContractId = options?.sacContractId || STELLAR_CONFIG.usdcSacContractId;
  const accountAddress = options?.accountAddress;

  const fetchContractData = useCallback(async () => {
    if (!contractId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      // 1. Consultar estado del contrato de custodia (config e hitos) vía getLedgerEntries
      const escrowState = await getEscrowContractState(contractId);
      setState(escrowState);

      // 2. Consultar balance bloqueado en el contrato de custodia vía getLedgerEntries
      if (sacContractId) {
        const locked = await getUsdcBalance(contractId, sacContractId);
        setLockedBalance(locked);
      }

      // 3. Consultar balance de la cuenta conectada si se especificó
      if (accountAddress && sacContractId) {
        const userBal = await getUsdcBalance(accountAddress, sacContractId);
        setAccountBalance(userBal);
      }
    } catch (err: any) {
      console.error("Error en useEscrowContractState:", err);
      setIsError(true);
      setError(err?.message || err?.toString() || "Error leyendo estado del contrato");
    } finally {
      setIsLoading(false);
    }
  }, [contractId, sacContractId, accountAddress]);

  useEffect(() => {
    fetchContractData();

    if (options?.pollIntervalMs && options.pollIntervalMs > 0) {
      const interval = setInterval(fetchContractData, options.pollIntervalMs);
      return () => clearInterval(interval);
    }
  }, [fetchContractData, options?.pollIntervalMs]);

  return {
    state,
    lockedBalance,
    accountBalance,
    isLoading,
    isError,
    error,
    refetch: fetchContractData,
  };
};

export default useEscrowContractState;
