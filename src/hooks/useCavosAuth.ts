import { useState, useCallback } from 'react';
import { UserSession, AuthMethod } from '../types/ui';

export const useCavosAuth = () => {
  const [session, setSession] = useState<UserSession>({
    isConnected: true,
    address: 'GD43REI5DWYIHVIWO2XHWODU4Y4K4PXC3IV53Y6M5EEF53I4AFUL3QSR',
    authMethod: 'cavos',
    email: 'empresa@fintechlatam.com',
    isGasless: true,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loginWithCavos = useCallback(async (userId?: string, email?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simula / ejecuta la conexión con el SDK de Cavos Kit
      await new Promise((resolve) => setTimeout(resolve, 800));
      const address = "GD43REI5DWYIHVIWO2XHWODU4Y4K4PXC3IV53Y6M5EEF53I4AFUL3QSR";
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
      await new Promise((resolve) => setTimeout(resolve, 600));
      const address = "GA6MBBMLUQQ2KHAESUEAE67WMCMI64AXRVJGAJRCF2EQDFGVKE55MMRU";
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
