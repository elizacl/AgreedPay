export const STELLAR_CONFIG = {
  network: import.meta.env.VITE_STELLAR_NETWORK || 'TESTNET',
  networkPassphrase: import.meta.env.VITE_STELLAR_NETWORK_PASSPHRASE || 'Test SDF Network ; September 2015',
  rpcUrl: import.meta.env.VITE_STELLAR_RPC_URL || 'https://soroban-testnet.stellar.org',
  escrowContractId: import.meta.env.VITE_ESCROW_CONTRACT_ID || 'CD6QQHMFJKOJYXNFIHSRWQTATG5AW22L6FHPFM76Y4Q2EUBFAOO563QR',
  usdcContractId: import.meta.env.VITE_USDC_CONTRACT_ID || 'CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA',
};

// USDC en Stellar tiene exactamente 7 decimales (1 USDC = 10^7 stroops)
export const STROOP_FACTOR = 10_000_000n;

export const usdcToStroops = (amount: number): bigint => {
  return BigInt(Math.round(amount * 10_000_000));
};

export const stroopsToUsdc = (stroops: bigint): number => {
  return Number(stroops) / 10_000_000;
};

export const truncateAddress = (addr: string, start = 5, end = 4): string => {
  if (!addr) return '';
  return `${addr.slice(0, start)}...${addr.slice(-end)}`;
};
