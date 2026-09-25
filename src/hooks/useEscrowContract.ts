import { useState, useCallback } from 'react';
import { Milestone } from '../types/contract';
import { STELLAR_CONFIG } from '../lib/stellar';

export const useEscrowContract = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const approveMilestone = useCallback(async (milestoneId: number) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockTx = "0x" + Math.random().toString(16).substring(2, 66);
      setTxHash(mockTx);
      return { success: true, txHash: mockTx };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const claimTimeout = useCallback(async (milestoneId: number) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockTx = "0x" + Math.random().toString(16).substring(2, 66);
      setTxHash(mockTx);
      return { success: true, txHash: mockTx };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const submitMilestoneProof = useCallback(async (milestoneId: number, proofHash: string) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockTx = "0x" + Math.random().toString(16).substring(2, 66);
      setTxHash(mockTx);
      return { success: true, txHash: mockTx };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    contractId: STELLAR_CONFIG.escrowContractId,
    tokenAddress: STELLAR_CONFIG.usdcContractId,
    isSubmitting,
    txHash,
    approveMilestone,
    claimTimeout,
    submitMilestoneProof,
  };
};
