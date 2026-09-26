import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const mainOps = [
    { id: 'escrow-overview', label: 'Panel Principal', icon: 'dashboard' },
    { id: 'active-contracts', label: 'Todos los Acuerdos', icon: 'history_edu' },
    { id: 'dispute-center', label: 'Centro de Disputas', icon: 'gavel' },
    { id: 'audit-and-logs', label: 'Actividad y Registros', icon: 'receipt_long' },
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-surface-container-lowest border-r border-surface-container-highest z-40 hidden md:flex flex-col justify-between py-space-md">
      <div className="flex flex-col gap-space-xs px-space-sm">
        
        {/* Section 1: Mis Operaciones */}
        <div className="px-space-sm py-space-xs font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
          Mis Operaciones
        </div>
        <nav className="flex flex-col gap-space-xs">
          {mainOps.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-space-sm px-space-sm py-2 rounded-xl transition-all text-left font-body-sm text-body-sm ${
                  isActive
                    ? 'font-label-md text-label-md shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                }`}
                style={
                  isActive
                    ? {
                        backgroundColor: 'rgb(255, 247, 237)',
                        color: 'rgb(234, 88, 12)',
                        border: '1px solid rgb(255, 237, 213)',
                        fontWeight: 600,
                      }
                    : {}
                }
              >
                <span 
                  className={`material-symbols-outlined text-lg ${isActive ? 'fill-1' : ''}`}
                  style={{ color: isActive ? '#ea580c' : undefined }}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

      </div>

      {/* Footer: Network Status + Sponsor Relay */}
      <div className="px-space-md flex flex-col gap-space-sm">
        {/* Network Status */}
        <div className="p-space-sm rounded-xl bg-surface-container-low border border-surface-container-high flex flex-col gap-space-xs">
          <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
            Estado de Red
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span className="font-code-sm text-code-sm text-on-surface font-medium">Stellar Testnet</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-code-sm text-code-sm text-on-surface-variant">⚡ Gasless (Patrocinada)</span>
          </div>
        </div>

        {/* Sponsor Relay */}
        <div className="p-space-sm rounded-xl bg-surface-container-low border border-surface-container-high flex flex-col gap-space-xs">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Sponsor Relay</span>
            <span className="font-code-sm text-code-sm text-secondary font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
              Online
            </span>
          </div>
          <div className="w-full bg-surface-container rounded-full h-1.5">
            <div className="bg-secondary h-1.5 rounded-full w-full"></div>
          </div>
          <span className="font-code-sm text-code-sm text-on-surface-variant">
            0 XLM consumed by client
          </span>
        </div>
      </div>
    </aside>
  );
};
