// Configuración y cliente ligero para persistencia de metadatos off-chain en Supabase
export const SUPABASE_CONFIG = {
  url: import.meta.env.VITE_SUPABASE_URL || 'https://agreedpay.supabase.co',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'public-anon-key-placeholder',
};

export interface OffchainProjectMetadata {
  contractId: string;
  sowUrl: string;
  sowHash: string;
  githubRepoUrl: string;
  figmaUrl?: string;
  createdAt: string;
}

export const fetchProjectMetadata = async (contractId: string): Promise<OffchainProjectMetadata | null> => {
  // Simulación o lectura real de metadatos off-chain
  return {
    contractId,
    sowUrl: "https://agreedpay.io/sow/agreedpay-core-v2.pdf",
    sowHash: "0x9376506ed445239beb653d8389e77af667cd66b0486060cc1122766bd0151940",
    githubRepoUrl: "https://github.com/elizacl/AgreedPay",
    figmaUrl: "https://figma.com/@agreedpay",
    createdAt: new Date().toISOString(),
  };
};
