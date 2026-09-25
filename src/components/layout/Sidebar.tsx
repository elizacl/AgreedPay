import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const settlementOps = [
    { id: 'escrow-overview', label: 'Escrow Overview', icon: 'dashboard' },
    { id: 'active-contracts', label: 'Active Contracts', icon: 'history_edu' },
    { id: 'milestones', label: 'Milestones', icon: 'fact_check' },
    { id: 'dispute-center', label: 'Dispute Center', icon: 'gavel' },
    { id: 'audit-and-logs', label: 'Audit & Logs', icon: 'receipt_long' },
  ];

  const configuration = [
    { id: 'treasury-vault', label: 'Treasury Vault', icon: 'account_balance' },
    { id: 'api-and-webhooks', label: 'API & Webhooks', icon: 'webhook' },
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-surface-container-lowest border-r border-surface-container-highest z-40 hidden md:flex flex-col justify-between py-space-md">
      <div className="flex flex-col gap-space-xs px-space-sm">
        
        {/* Section 1: Settlement Ops */}
        <div className="px-space-sm py-space-xs font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
          Settlement Ops
        </div>
        <nav className="flex flex-col gap-space-xs">
          {settlementOps.map((item) => {
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

        {/* Section 2: Configuration */}
        <div className="mt-space-md px-space-sm py-space-xs font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
          Configuration
        </div>
        <nav className="flex flex-col gap-space-xs">
          {configuration.map((item) => {
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

      {/* Footer: Sponsor Relay Cavos */}
      <div className="px-space-md">
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
