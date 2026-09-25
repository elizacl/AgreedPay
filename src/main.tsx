import React from 'react';
import ReactDOM from 'react-dom/client';
import { CavosProvider, CavosConfig } from '@cavos/kit/react';
import App from './App';
import './index.css';

// Configuración modular de Cavos para Stellar Testnet
const cavosConfig: CavosConfig = {
  appId: import.meta.env.VITE_CAVOS_APP_ID || 'agreedpay-rwa',
  chains: ['stellar'],
  defaultChain: 'stellar',
  network: 'testnet',
  appSalt: import.meta.env.VITE_CAVOS_APP_SALT || 'agreedpay-rwa-v1',
  persistSession: true,
  rpcUrl: import.meta.env.VITE_STELLAR_RPC_URL || 'https://soroban-testnet.stellar.org',
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CavosProvider config={cavosConfig}>
      <App />
    </CavosProvider>
  </React.StrictMode>
);
