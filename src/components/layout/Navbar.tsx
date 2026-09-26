import React from 'react';
import { UserSession } from '../../types';
import agreedPayLogo from '../../assets/agreedpay-logo.jpeg';

interface NavbarProps {
  session: UserSession;
  onOpenAuth: () => void;
  onDisconnect: () => void;
  onOpenCreateAgreement: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  session,
  onOpenAuth,
  onDisconnect,
  onOpenCreateAgreement,
}) => {
  const truncateAddress = (addr: string) => {
    if (!addr) return 'GABC...9XYZ';
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-surface-container-lowest border-b border-surface-container-highest z-50">
      <div className="w-full h-full px-space-lg flex items-center justify-between gap-space-md">
        
        {/* Brand */}
        <div className="flex items-center gap-space-sm cursor-pointer select-none">
          <img
            src={agreedPayLogo}
            alt="AgreedPay"
            className="w-8 h-8 rounded-lg object-cover shadow-sm"
          />
          <span className="font-headline-sm text-headline-sm tracking-tight text-on-surface font-bold">
            AgreedPay
          </span>
          <span className="hidden sm:inline px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider font-semibold">
            Custodia Inteligente
          </span>
        </div>

        {/* Actions & user session */}
        <div className="flex items-center gap-space-md">

          {/* Quick Create Button */}
          <button
            onClick={onOpenCreateAgreement}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-label-md text-label-md text-white font-bold shadow-sm transition-all transform active:scale-95"
            style={{ backgroundColor: '#ea580c' }}
          >
            <span className="material-symbols-outlined text-sm">add_circle</span>
            <span>+ Crear Acuerdo</span>
          </button>

          {/* Profile / Wallet Connect */}
          {session.isConnected ? (
            <div className="flex items-center gap-space-sm pl-space-sm border-l border-surface-container-high">
              <img 
                alt="Profile" 
                className="w-8 h-8 rounded-full object-cover border border-surface-container-high" 
                src="https://lh3.googleusercontent.com/aida/AEtjO1VZ8gbVkCj-O3R_Arrte5xtn2JDF-NvrDAyJpqyoriTNMdPX289k89AlRvXfia-MpVWwdJ_--4Vkk93ofE9nC2GRSYBTeQbmWeLsBhQZUp7a-xNHXJPHQDBT9759MXY1BLmwBucUcaGNuWkT0A-tDpRVFyIl4CRFX8VPXXVdaBMDzutUnw_wpVEHwgm89z5pkDmehv84vg3UVdoHyyq1iqfIvl-MlELDUewvXDvqE8tt4LFqUmHPugL1DJ1" 
              />
              <div className="hidden sm:flex flex-col text-left">
                <span className="font-code-sm text-code-sm text-on-surface font-medium">
                  {truncateAddress(session.address || '')}
                </span>
                <span className="font-label-sm text-label-sm text-secondary font-semibold">
                  {session.authMethod === 'cavos' ? 'Cavos Verified' : 'Verified Multi-Sig'}
                </span>
              </div>
              <button
                onClick={onDisconnect}
                title="Desconectar"
                className="w-7 h-7 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-base">logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-label-md text-label-md font-bold text-white shadow-sm transition-all"
              style={{ backgroundColor: '#006194' }}
            >
              <span className="material-symbols-outlined text-base">account_balance_wallet</span>
              <span>Conectar Billetera</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
