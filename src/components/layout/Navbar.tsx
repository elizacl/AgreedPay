import React from 'react';
import { UserSession } from '../../types';

interface NavbarProps {
  session: UserSession;
  onOpenAuth: () => void;
  onDisconnect: () => void;
  onOpenCreateAgreement: () => void;
  role: 'client' | 'developer';
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  session,
  onOpenAuth,
  onDisconnect,
  onOpenCreateAgreement,
  role,
  activeTab = 'escrow-overview',
  onSelectTab,
}) => {
  const truncateAddress = (addr: string) => {
    if (!addr) return 'GABC...9XYZ';
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  const navLinks = [
    { id: 'escrow-overview', label: 'Escrow Overview' },
    { id: 'active-contracts', label: 'Active Contracts' },
    { id: 'milestones', label: 'Milestones' },
    { id: 'dispute-center', label: 'Dispute Center' },
    { id: 'audit-and-logs', label: 'Audit & Logs' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-surface-container-lowest border-b border-surface-container-highest z-50">
      <div className="w-full h-full px-space-lg flex items-center justify-between gap-space-md">
        
        {/* Brand & Desktop Navigation */}
        <div className="flex items-center gap-space-lg">
          <div 
            className="flex items-center gap-space-sm cursor-pointer select-none"
            onClick={() => onSelectTab && onSelectTab('escrow-overview')}
          >
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center font-headline-sm text-headline-sm font-bold shadow-sm"
              style={{ backgroundColor: '#ea580c', color: '#ffffff' }}
            >
              A
            </div>
            <span className="font-headline-sm text-headline-sm tracking-tight text-on-surface font-bold">
              AgreedPay
            </span>
            <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider font-semibold">
              B2B Escrow
            </span>
          </div>

          <nav className="hidden xl:flex items-center gap-space-xs">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onSelectTab && onSelectTab(link.id)}
                  className={`px-3 py-1.5 rounded-lg transition-colors font-label-md text-label-md ${
                    isActive
                      ? 'text-primary font-bold bg-surface-container-low'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                  }`}
                  style={isActive ? { color: '#ea580c', backgroundColor: '#fff7ed', border: '1px solid #ffedd5' } : {}}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Network status, gasless relayer & user session */}
        <div className="flex items-center gap-space-md">
          {/* Stellar Testnet */}
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface-container border border-surface-container-high">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span className="font-code-sm text-code-sm text-on-surface font-medium">Stellar Testnet</span>
          </div>

          {/* Sponsored Gasless Transaction */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed">
            <span className="font-label-sm text-label-sm font-semibold">⚡ Transacción Sin Gas (Patrocinada)</span>
          </div>

          {/* Settlement Pool */}
          <div className="hidden sm:flex flex-col text-right">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Settlement Pool</span>
            <span className="font-code-sm text-code-sm text-on-surface font-semibold">150,000.00 USDC</span>
          </div>

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
