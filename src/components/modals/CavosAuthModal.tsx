import React, { useState } from 'react';
import { AuthMethod } from '../../types';

interface CavosAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (method: AuthMethod, address: string) => void;
}

export const CavosAuthModal: React.FC<CavosAuthModalProps> = ({
  isOpen,
  onClose,
  onConnect,
}) => {
  const [loadingMethod, setLoadingMethod] = useState<AuthMethod>(null);

  if (!isOpen) return null;

  const handleCavosConnect = async () => {
    setLoadingMethod('cavos');
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const simulatedCavosAddress = "GD43REI5DWYIHVIWO2XHWODU4Y4K4PXC3IV53Y6M5EEF53I4AFUL3QSR";
      onConnect('cavos', simulatedCavosAddress);
      onClose();
    } catch (err) {
      console.error("Error conectando con Cavos:", err);
    } finally {
      setLoadingMethod(null);
    }
  };

  const handleFreighterConnect = async () => {
    setLoadingMethod('freighter');
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const simulatedFreighterAddress = "GA6MBBMLUQQ2KHAESUEAE67WMCMI64AXRVJGAJRCF2EQDFGVKE55MMRU";
      onConnect('freighter', simulatedFreighterAddress);
      onClose();
    } catch (err) {
      console.error("Error conectando con Freighter:", err);
    } finally {
      setLoadingMethod(null);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-space-md sm:p-space-lg"
      style={{ backgroundColor: 'rgba(19, 27, 46, 0.4)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-2xl p-space-lg sm:p-space-xl relative border border-slate-200"
        style={{ backgroundColor: '#ffffff', borderRadius: '20px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón Cerrar */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        {/* Encabezado */}
        <div className="text-center space-y-2">
          <div 
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm"
            style={{ backgroundColor: '#fff7ed', border: '1px solid #fed7aa', color: '#ea580c' }}
          >
            <span className="material-symbols-outlined text-2xl">fingerprint</span>
          </div>
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface tracking-tight">
            Acceso Institucional AgreedPay
          </h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs mx-auto">
            Elige tu método preferido de autenticación para operar en Stellar Testnet.
          </p>
        </div>

        {/* Opciones de Login */}
        <div className="mt-6 space-y-3">
          
          {/* Opción 1: Cavos (Recomendado / Sin Fricción) */}
          <button
            type="button"
            onClick={handleCavosConnect}
            disabled={loadingMethod !== null}
            className="w-full relative group rounded-xl p-4 text-left transition-all shadow-sm active:scale-[0.98]"
            style={{
              backgroundColor: '#faf8ff',
              border: '1.5px solid rgb(234, 88, 12)',
            }}
          >
            <div 
              className="absolute top-3 right-3 flex items-center gap-1 rounded-full px-2 py-0.5 font-label-sm text-label-sm font-bold"
              style={{ backgroundColor: '#fff7ed', color: '#ea580c' }}
            >
              <span className="material-symbols-outlined text-xs">bolt</span>
              <span>Recomendado</span>
            </div>

            <div className="flex items-start gap-3.5">
              <div 
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: '#fff7ed', color: '#ea580c' }}
              >
                {loadingMethod === 'cavos' ? (
                  <span className="material-symbols-outlined text-xl animate-spin">refresh</span>
                ) : (
                  <span className="material-symbols-outlined text-xl">fingerprint</span>
                )}
              </div>
              <div className="space-y-0.5 pr-14">
                <p className="font-label-md text-label-md font-bold text-on-surface group-hover:text-primary transition-colors">
                  Google / Passkeys (Sin Gas)
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-snug">
                  Cavos Account Abstraction. Firma biométrica con <strong style={{ color: '#ea580c' }}>0 XLM en comisiones</strong>.
                </p>
              </div>
            </div>
          </button>

          {/* Opción 2: Freighter Wallet (Web3 Nativo) */}
          <button
            type="button"
            onClick={handleFreighterConnect}
            disabled={loadingMethod !== null}
            className="w-full group rounded-xl border border-slate-200 bg-surface-container-low/60 p-4 text-left hover:bg-surface-container transition-all active:scale-[0.98]"
          >
            <div className="flex items-start gap-3.5">
              <div 
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-surface-container text-tertiary"
              >
                {loadingMethod === 'freighter' ? (
                  <span className="material-symbols-outlined text-xl animate-spin">refresh</span>
                ) : (
                  <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
                )}
              </div>
              <div className="space-y-0.5">
                <p className="font-label-md text-label-md font-bold text-on-surface">
                  Conectar Freighter Wallet
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-snug">
                  Billetera de extensión nativa en navegador para usuarios Web3 avanzados.
                </p>
              </div>
            </div>
          </button>

        </div>

        {/* Footer Informativo */}
        <div className="mt-5 rounded-xl bg-surface-container-low border border-slate-200 p-3 font-code-sm text-code-sm text-on-surface-variant text-center">
          🔒 Custodia descentralizada no custodial en Stellar Soroban
        </div>

      </div>
    </div>
  );
};
