import { useState, useCallback } from 'react';
import { UserSession, AuthMethod } from '../types/ui';
import { connectCavosWallet, disconnectCavosWallet } from '../lib/cavos';
import { connectFreighter } from '../lib/soroban';

export const useCavosAuth = () => {
  const [session, setSession] = useState<UserSession>({
    isConnected: false,
    address: null,
    authMethod: null,
    isGasless: false,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loginWithCavos = useCallback(async (userId?: string, email?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const wallet = await connectCavosWallet(userId || email || 'agreedpay-client-user', email);
      const address = wallet.address;
      setSession({
        isConnected: true,
        address,
        authMethod: 'cavos',
        email: email || 'cliente@agreedpay.io',
        isGasless: true,
      });
      return address;
    } catch (err: any) {
      setError(err?.message || "Error al autenticar con Cavos");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithFreighter = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const address = await connectFreighter();
      setSession({
        isConnected: true,
        address,
        authMethod: 'freighter',
        isGasless: false,
      });
      return address;
    } catch (err: any) {
      setError(err?.message || "Error al conectar Freighter");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    disconnectCavosWallet();
    setSession({
      isConnected: false,
      address: null,
      authMethod: null,
      isGasless: false,
    });
  }, []);

  return {
    session,
    isLoading,
    error,
    loginWithCavos,
    loginWithFreighter,
    logout,
  };
};
