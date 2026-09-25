export type Role = 'client' | 'developer';

export type AuthMethod = 'cavos' | 'freighter' | null;

export interface UserSession {
  isConnected: boolean;
  address: string | null;
  authMethod: AuthMethod;
  email?: string;
  isGasless: boolean;
}

export interface NavTabItem {
  id: string;
  label: string;
  icon?: string;
}
