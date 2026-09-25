import { useState, useCallback } from 'react';
import { usdcToStroops, STELLAR_CONFIG } from '../lib/stellar';

export interface NewAgreementParams {
  title: string;
  freelancerAddress: string;
  totalAmount: number;
  milestonesCount: number;
  progressThreshold: number;
}

export const useDeposit = () => {
  const [isDepositing, setIsDepositing] = useState(false);
  const [depositTxHash, setDepositTxHash] = useState<string | null>(null);

  const depositAndCreateMilestones = useCallback(async (params: NewAgreementParams) => {
    setIsDepositing(true);
    try {
      // Simula el ensamblado de la transacción Soroban y el fondeo atómico en SAC USDC
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const simulatedTx = "0x" + Math.random().toString(16).substring(2, 66);
      setDepositTxHash(simulatedTx);
      return {
        success: true,
        txHash: simulatedTx,
        stroops: usdcToStroops(params.totalAmount),
      };
    } finally {
      setIsDepositing(false);
    }
  }, []);

  return {
    isDepositing,
    depositTxHash,
    depositAndCreateMilestones,
  };
};
