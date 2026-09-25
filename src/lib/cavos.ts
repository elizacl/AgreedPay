import { Cavos } from "@cavos/kit";

export const CAVOS_CONFIG = {
  appId: import.meta.env.VITE_CAVOS_APP_ID || 'agreedpay-testnet',
  appSalt: import.meta.env.VITE_CAVOS_APP_SALT || 'agreedpay-rwa-v1',
  network: 'testnet' as const,
  chains: ['stellar'] as const,
  defaultChain: 'stellar' as const,
};

export const connectCavosWallet = async (userId: string, email?: string) => {
  try {
    const session = await Cavos.connect({
      chains: ["stellar"],
      defaultChain: "stellar",
      network: "testnet",
      identity: { userId, email },
      appSalt: CAVOS_CONFIG.appSalt,
      appId: CAVOS_CONFIG.appId,
    });
    return session.wallet("stellar");
  } catch (error) {
    console.error("Error al conectar Cavos wallet:", error);
    throw error;
  }
};
