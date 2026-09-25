import React from 'react';

export const DeliverablesPanel: React.FC = () => {
  return (
    <div className="flex flex-col gap-space-md">
      
      {/* 1. DELIVERABLES SECTION (STRUCTURED B2B CARDS) */}
      <div 
        className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-md"
        style={{
          border: '1px solid rgb(226, 232, 240)',
          boxShadow: 'rgba(234, 88, 12, 0.05) 0px 10px 25px -5px, rgba(0, 0, 0, 0.02) 0px 4px 6px -2px'
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary">folder_special</span>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              Entregables del Proyecto
            </h3>
          </div>
          <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-semibold">
            4 Verificados
          </span>
        </div>

        <div className="flex flex-col gap-space-xs">
          {/* Deliverable 1: GitHub */}
          <a 
            className="p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex items-center justify-between gap-space-sm group"
            href="https://github.com/elizacl/AgreedPay"
            target="_blank"
            rel="noreferrer"
          >
            <div className="flex items-center gap-space-sm min-w-0">
              <div 
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
              >
                <span className="material-symbols-outlined text-lg text-on-surface">code</span>
              </div>
              <div className="min-w-0">
                <div className="font-label-md text-label-md font-bold text-on-surface group-hover:text-primary transition-colors truncate">
                  Repositorio GitHub (Branch main)
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="px-1.5 py-0.5 rounded bg-surface-container font-code-sm text-code-sm text-on-surface-variant">
                    v1.4.2 merged
                  </span>
                  <span className="font-code-sm text-code-sm text-on-surface-variant">
                    commit 42e9a1
                  </span>
                </div>
              </div>
            </div>
            <span className="material-symbols-outlined text-sm text-on-surface-variant group-hover:translate-x-0.5 transition-transform">
              open_in_new
            </span>
          </a>

          {/* Deliverable 2: Figma */}
          <a 
            className="p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex items-center justify-between gap-space-sm group"
            href="https://figma.com"
            target="_blank"
            rel="noreferrer"
          >
            <div className="flex items-center gap-space-sm min-w-0">
              <div 
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                style={{ backgroundColor: '#fff7ed', border: '1px solid #fed7aa' }}
              >
                <span className="material-symbols-outlined text-lg" style={{ color: '#ea580c' }}>palette</span>
              </div>
              <div className="min-w-0">
                <div className="font-label-md text-label-md font-bold text-on-surface group-hover:text-primary transition-colors truncate">
                  Tablero de Figma UI
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="px-1.5 py-0.5 rounded bg-surface-container font-code-sm text-code-sm text-on-surface-variant">
                    124 pantallas
                  </span>
                  <span className="font-label-sm text-label-sm font-semibold" style={{ color: '#16a34a' }}>
                    Prototipo Listo
                  </span>
                </div>
              </div>
            </div>
            <span className="material-symbols-outlined text-sm text-on-surface-variant group-hover:translate-x-0.5 transition-transform">
              open_in_new
            </span>
          </a>

          {/* Deliverable 3: Staging */}
          <a 
            className="p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex items-center justify-between gap-space-sm group"
            href="https://agreedpay.vercel.app"
            target="_blank"
            rel="noreferrer"
          >
            <div className="flex items-center gap-space-sm min-w-0">
              <div 
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}
              >
                <span className="material-symbols-outlined text-lg text-secondary">cloud_done</span>
              </div>
              <div className="min-w-0">
                <div className="font-label-md text-label-md font-bold text-on-surface group-hover:text-primary transition-colors truncate">
                  Entorno Staging (Vercel)
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-secondary"></span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Live Ping: 24ms</span>
                  <span className="font-code-sm text-code-sm text-tertiary">app-stg.agreedpay.dev</span>
                </div>
              </div>
            </div>
            <span className="material-symbols-outlined text-sm text-on-surface-variant group-hover:translate-x-0.5 transition-transform">
              open_in_new
            </span>
          </a>

          {/* Deliverable 4: Swagger API */}
          <a 
            className="p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex items-center justify-between gap-space-sm group"
            href="#"
            onClick={(e) => { e.preventDefault(); alert('Swagger OpenAPI 3.0: 38 endpoints interactivos de Soroban listos.'); }}
          >
            <div className="flex items-center gap-space-sm min-w-0">
              <div 
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd' }}
              >
                <span className="material-symbols-outlined text-lg text-tertiary">description</span>
              </div>
              <div className="min-w-0">
                <div className="font-label-md text-label-md font-bold text-on-surface group-hover:text-primary transition-colors truncate">
                  Documentación de APIs (Swagger)
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="px-1.5 py-0.5 rounded bg-surface-container font-code-sm text-code-sm text-on-surface-variant">
                    OpenAPI 3.0
                  </span>
                  <span className="font-code-sm text-code-sm text-on-surface-variant">
                    38 Endpoints probados
                  </span>
                </div>
              </div>
            </div>
            <span className="material-symbols-outlined text-sm text-on-surface-variant group-hover:translate-x-0.5 transition-transform">
              open_in_new
            </span>
          </a>
        </div>
      </div>

      {/* 2. MULTI-SIG AUTHORIZED SIGNERS (QUORUM 2/3) */}
      <div 
        className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-md"
        style={{
          border: '1px solid rgb(226, 232, 240)',
          boxShadow: 'rgba(234, 88, 12, 0.05) 0px 10px 25px -5px, rgba(0, 0, 0, 0.02) 0px 4px 6px -2px'
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">security</span>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              Firmantes Autorizados
            </h3>
          </div>
          <span 
            className="px-2 py-0.5 rounded-full font-label-sm text-label-sm font-bold"
            style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}
          >
            Quórum 2 de 3
          </span>
        </div>

        <div className="flex flex-col gap-space-xs">
          {/* Signer 1: Client */}
          <div className="flex items-center justify-between p-space-sm rounded-xl bg-surface-container-low">
            <div className="flex items-center gap-space-sm">
              <img 
                className="w-9 h-9 rounded-full object-cover border border-slate-200" 
                alt="Solaria Capital" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA92t-hfXY2yg2EmZwfScZ_EBIqKdsggmno7GFfm4z3ZsWsS_NuTPAEOCd8zYhOmO-7ZvJ1fFYoubO3-PkpKHi3BaHRsLjsC2BcxU9qPkGePg8RPu5v2e9Tphu5DAP-Vefs0rslUJuZH7EVvU0HO8VmKf5BtBN4IOOSqqblIpoxaNQ6bjsNPl2xmQ7sGqDRxV388yqq374WMe236cdxFA7D7bknZtTW3uP-ghy94a45LkJRW1WgKQB63Q" 
              />
              <div>
                <span className="font-label-md text-label-md font-bold text-on-surface block">
                  Solaria Capital (Cliente)
                </span>
                <span className="font-code-sm text-code-sm text-on-surface-variant block">
                  GABC...9XYZ
                </span>
              </div>
            </div>
            <span 
              className="px-2 py-1 rounded font-label-sm text-label-sm font-semibold flex items-center gap-1"
              style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}
            >
              <span className="material-symbols-outlined text-xs">check</span>
              Firmado
            </span>
          </div>

          {/* Signer 2: Dev */}
          <div className="flex items-center justify-between p-space-sm rounded-xl bg-surface-container-low">
            <div className="flex items-center gap-space-sm">
              <img 
                className="w-9 h-9 rounded-full object-cover border border-slate-200" 
                alt="Acme Corp" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxEcSrzJncXG7GmnCypom46e8EmZtvvx84dM7BaI6wvCqDOPIpTFfX25KYHLn6Te3XkA4Ixr2UWcGUwS9JRgu30NYNFGXxmVosXbWCXO0n7WS6uiWhFx4r2w2YXJOc5E_4-FJg3ps9yE-glqvtQWEemu43xdqtqAXWBXSTw5TEalLfMJy9rzF7tbguE0-XjcjXG00VcX22R56my868MTsz1Wy3vTeIOBoHuabs5E9Cua3KAPR8vGdTAg" 
              />
              <div>
                <span className="font-label-md text-label-md font-bold text-on-surface block">
                  Acme Corp (Freelancer/Dev)
                </span>
                <span className="font-code-sm text-code-sm text-on-surface-variant block">
                  GA78...K32P
                </span>
              </div>
            </div>
            <span 
              className="px-2 py-1 rounded font-label-sm text-label-sm font-semibold flex items-center gap-1"
              style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}
            >
              <span className="material-symbols-outlined text-xs">check</span>
              Firmado
            </span>
          </div>

          {/* Signer 3: Arbitrator */}
          <div className="flex items-center justify-between p-space-sm rounded-xl bg-surface-container-low opacity-75">
            <div className="flex items-center gap-space-sm">
              <div className="w-9 h-9 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center">
                <span className="material-symbols-outlined text-base">gavel</span>
              </div>
              <div>
                <span className="font-label-md text-label-md font-semibold text-on-surface block">
                  Tribunal Arbitral B2B #12
                </span>
                <span className="font-code-sm text-code-sm text-on-surface-variant block">
                  GSYS...99TT
                </span>
              </div>
            </div>
            <span className="px-2 py-1 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-medium">
              En Reserva
            </span>
          </div>
        </div>

        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Ambas partes han aportado sus llaves criptográficas. La transacción final del Hito 3 puede ser ejecutada en la red Stellar.
        </p>
      </div>

      {/* 3. RECENT ON-CHAIN EVENTS WIDGET */}
      <div 
        className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-sm"
        style={{
          border: '1px solid rgb(226, 232, 240)',
          boxShadow: 'rgba(234, 88, 12, 0.05) 0px 10px 25px -5px, rgba(0, 0, 0, 0.02) 0px 4px 6px -2px'
        }}
      >
        <div className="flex items-center justify-between">
          <span className="font-label-md text-label-md font-bold text-on-surface uppercase tracking-wider">
            Eventos On-Chain Recientes
          </span>
          <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
        </div>
        <div className="flex flex-col gap-space-xs font-code-sm text-code-sm">
          <div className="p-2 rounded bg-surface-container-low flex justify-between items-center">
            <span className="text-on-surface-variant truncate">CONTRACT_EVIDENCE_RECORDED</span>
            <span className="text-on-surface font-semibold flex-shrink-0">hace 14m</span>
          </div>
          <div className="p-2 rounded bg-surface-container-low flex justify-between items-center">
            <span className="text-on-surface-variant truncate">SPONSORED_RELAY_FEES: 0 XLM</span>
            <span className="text-secondary font-semibold flex-shrink-0">hace 14m</span>
          </div>
          <div className="p-2 rounded bg-surface-container-low flex justify-between items-center">
            <span className="text-on-surface-variant truncate">SIGNATURE_APPENDED: Acme Corp</span>
            <span className="text-on-surface font-semibold flex-shrink-0">hace 2h</span>
          </div>
        </div>
      </div>

    </div>
  );
};
