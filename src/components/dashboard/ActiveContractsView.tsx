import React, { useState } from 'react';

interface ActiveContractsViewProps {
  onSelectContract: (id: string) => void;
  onOpenCreateAgreement: () => void;
  onOpenDispute: (id: string) => void;
}

export const ActiveContractsView: React.FC<ActiveContractsViewProps> = ({
  onSelectContract,
  onOpenCreateAgreement,
  onOpenDispute,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'REVIEW' | 'DISPUTE'>('ALL');

  const contracts = [
    {
      id: '#4092',
      title: 'Plataforma Web SaaS & Mobile App',
      hash: 'C...88BA',
      type: 'Soroban Escrow',
      counterpartyName: 'Acme Corp',
      counterpartyInitial: 'A',
      counterpartyTier: 'Venture Studio (Tier 1)',
      status: 'Activo (3/5 hitos)',
      statusType: 'ACTIVE',
      amount: '$85,000.00',
      progress: 60,
      progressText: '3 de 5 hitos',
    },
    {
      id: '#4088',
      title: 'Smart Contract Auditing & Formal Verification',
      hash: 'C...412F',
      type: 'Soroban Audit Multi-Sig',
      counterpartyName: 'CertiX Labs',
      counterpartyInitial: 'C',
      counterpartyTier: 'Security Auditor (EU)',
      status: 'En Revisión Final',
      statusType: 'REVIEW',
      amount: '$45,000.00',
      progress: 90,
      progressText: 'Hito final pendiente',
    },
    {
      id: '#4075',
      title: 'Mobile App UI/UX Redesign & Design System',
      hash: 'C...99E1',
      type: 'Milestone Escrow',
      counterpartyName: 'Finovate Health Inc.',
      counterpartyInitial: 'F',
      counterpartyTier: 'US Enterprise Client',
      status: 'En Ejecución',
      statusType: 'ACTIVE',
      amount: '$35,000.00',
      progress: 40,
      progressText: '2 de 5 hitos',
    },
    {
      id: '#4061',
      title: 'Infraestructura Cloud & Migración Kubernetes',
      hash: 'C...10AA',
      type: 'Enterprise Retainer',
      counterpartyName: 'ScaleOps Global',
      counterpartyInitial: 'S',
      counterpartyTier: 'DevOps Agency (DE)',
      status: 'Activo',
      statusType: 'ACTIVE',
      amount: '$125,000.00',
      progress: 75,
      progressText: '3 de 4 hitos',
    },
    {
      id: '#4054',
      title: 'Integración Oráculo IoT & Pasarela Stellar',
      hash: 'C...77D3',
      type: 'Mediación Soroban Arb',
      counterpartyName: 'Helios Energy S.A.',
      counterpartyInitial: 'H',
      counterpartyTier: 'Energy Utility (LATAM)',
      status: 'Disputa Abierta',
      statusType: 'DISPUTE',
      amount: '$125,000.00',
      progress: 50,
      progressText: 'Hito 3 en disputa',
    },
  ];

  const filtered = contracts.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.counterpartyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.includes(searchTerm);
    if (statusFilter === 'ALL') return matchesSearch;
    return matchesSearch && c.statusType === statusFilter;
  });

  return (
    <div className="flex flex-col w-full gap-space-lg">
      
      {/* Top Header & Page Title */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-space-lg">
        <div className="flex flex-col gap-space-xs">
          <div className="inline-flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-high text-tertiary font-code-sm text-code-sm font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
              Soroban Runtime v21.4
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-sm text-secondary">verified_user</span>
              Multi-Sig Institutional Core
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
            Contratos de Custodia B2B Activos
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            Gestión descentralizada de acuerdos escrow multiactivo sobre Stellar Soroban. Liquidación condicional automatizada mediante oráculos y verificación formal.
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center gap-space-sm">
          <div className="relative flex-1 sm:w-72 sm:flex-initial">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant/70 text-lg">
              search
            </span>
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar contrato o contraparte..."
              className="w-full h-10 pl-9 pr-3 rounded-lg bg-surface-container-lowest text-body-sm font-body-sm text-on-surface shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-slate-200 transition-all"
            />
          </div>

          <button 
            type="button"
            onClick={() => setStatusFilter(statusFilter === 'ALL' ? 'ACTIVE' : 'ALL')}
            className="h-10 px-space-md rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container-low shadow-sm flex items-center gap-2 font-label-md text-label-md transition-colors border border-slate-200"
          >
            <span className="material-symbols-outlined text-base text-outline">tune</span>
            <span>{statusFilter === 'ALL' ? 'Filtrar por Estado' : `Filtro: ${statusFilter}`}</span>
          </button>

          <button 
            type="button"
            onClick={onOpenCreateAgreement}
            className="h-10 px-space-lg rounded-xl text-on-primary font-headline-sm text-headline-sm font-bold shadow-md flex items-center gap-2 transition-all transform active:scale-95"
            style={{ backgroundColor: 'rgb(234, 88, 12)', color: '#ffffff' }}
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            <span>Crear Nuevo Acuerdo</span>
          </button>
        </div>
      </div>

      {/* Quick KPI Filter Stat Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md">
        <div 
          onClick={() => setStatusFilter('ALL')}
          className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex items-center justify-between cursor-pointer hover:bg-surface-container-low/50 transition-colors border border-slate-200"
        >
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Total Activos</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="font-headline-md text-headline-md text-on-surface font-bold">8</span>
              <span className="font-label-sm text-label-sm text-secondary font-semibold" style={{ color: '#16a34a' }}>100% operativos</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary" style={{ color: '#ea580c' }}>
            <span className="material-symbols-outlined">folder_shared</span>
          </div>
        </div>

        <div 
          onClick={() => setStatusFilter('ALL')}
          className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex items-center justify-between cursor-pointer hover:bg-surface-container-low/50 transition-colors border border-slate-200"
        >
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Volumen en Custodia</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-headline-md text-headline-md font-bold" style={{ color: '#16a34a' }}>$415,000</span>
              <span className="font-code-sm text-code-sm text-on-surface-variant font-medium">USDC</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary" style={{ color: '#16a34a' }}>
            <span className="material-symbols-outlined">lock</span>
          </div>
        </div>

        <div 
          onClick={() => setStatusFilter('REVIEW')}
          className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex items-center justify-between cursor-pointer hover:bg-surface-container-low/50 transition-colors border border-slate-200"
        >
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">En Revisión</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="font-headline-md text-headline-md font-bold text-tertiary">3</span>
              <span className="font-label-sm text-label-sm text-tertiary font-medium">Req. aprobación</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-tertiary">
            <span className="material-symbols-outlined">pending_actions</span>
          </div>
        </div>

        <div 
          onClick={() => setStatusFilter('DISPUTE')}
          className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex items-center justify-between cursor-pointer hover:bg-surface-container-low/50 transition-colors border border-slate-200"
        >
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">En Disputa</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="font-headline-md text-headline-md text-error font-bold" style={{ color: '#ba1a1a' }}>1</span>
              <span className="font-label-sm text-label-sm text-error font-medium" style={{ color: '#ba1a1a' }}>Arbitraje activo</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-error-container/30 flex items-center justify-center" style={{ color: '#ba1a1a' }}>
            <span className="material-symbols-outlined">gavel</span>
          </div>
        </div>
      </div>

      {/* Active Contracts Master Table Card */}
      <div 
        className="w-full bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden"
        style={{
          border: '1px solid rgb(226, 232, 240)',
          boxShadow: 'rgba(234, 88, 12, 0.05) 0px 10px 25px -5px, rgba(0, 0, 0, 0.02) 0px 4px 6px -2px'
        }}
      >
        <div className="px-space-lg py-space-md bg-surface-container-lowest flex flex-wrap items-center justify-between gap-space-sm border-b border-surface-container-high">
          <div className="flex items-center gap-space-sm">
            <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Registros de Liquidación
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container-high font-label-sm text-label-sm text-outline font-semibold">
              Soroban Ledger 54,198,024
            </span>
          </div>
          <div className="flex items-center gap-space-xs text-on-surface-variant font-code-sm text-code-sm">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span>Actualización en tiempo real vía RPC WebSocket</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-outline font-label-sm text-label-sm uppercase tracking-wider">
                <th className="py-3 px-space-lg" scope="col">Contrato &amp; Proyecto</th>
                <th className="py-3 px-space-md" scope="col">Contraparte (KYB)</th>
                <th className="py-3 px-space-md" scope="col">Estado de Custodia</th>
                <th className="py-3 px-space-md text-right" scope="col">Monto en Custodia</th>
                <th className="py-3 px-space-md" scope="col">Progreso Hitos</th>
                <th className="py-3 px-space-lg text-center" scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high font-body-md text-body-md text-on-surface">
              {filtered.map((item) => (
                <tr 
                  key={item.id}
                  className={`hover:bg-surface-container-low/40 transition-colors group ${
                    item.statusType === 'DISPUTE' ? 'bg-error-container/5' : ''
                  }`}
                >
                  <td className="py-space-md px-space-lg">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-code-sm text-code-sm font-semibold" style={{ color: item.statusType === 'DISPUTE' ? '#ba1a1a' : '#ea580c' }}>
                          {item.id}
                        </span>
                        <span className="font-label-md text-label-md font-bold text-on-surface">
                          {item.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-code-sm text-code-sm text-outline">Hash: {item.hash}</span>
                        <span className={`inline-flex items-center gap-1 font-label-sm text-label-sm ${
                          item.statusType === 'DISPUTE' ? 'text-error' : 'text-tertiary'
                        }`}>
                          <span className="material-symbols-outlined text-xs">
                            {item.statusType === 'DISPUTE' ? 'gavel' : 'deployed_code'}
                          </span> 
                          {item.type}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-space-md px-space-md">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                        style={{
                          backgroundColor: item.statusType === 'DISPUTE' ? 'rgba(186, 26, 26, 0.15)' : '#f1f5f9',
                          color: item.statusType === 'DISPUTE' ? '#ba1a1a' : '#ea580c'
                        }}
                      >
                        {item.counterpartyInitial}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-label-md text-label-md font-semibold text-on-surface">
                          {item.counterpartyName}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-secondary text-sm">verified</span>
                          <span className="font-code-sm text-code-sm text-outline">{item.counterpartyTier}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-space-md px-space-md whitespace-nowrap">
                    <span 
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-label-sm text-label-sm font-semibold ${
                        item.statusType === 'DISPUTE'
                          ? 'bg-error-container text-on-error-container'
                          : item.statusType === 'REVIEW'
                          ? 'bg-surface-variant text-tertiary'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${
                        item.statusType === 'DISPUTE' ? 'bg-error animate-ping' : 'bg-primary'
                      }`} style={{ backgroundColor: item.statusType === 'DISPUTE' ? '#ba1a1a' : '#ea580c' }}></span>
                      {item.status}
                    </span>
                  </td>

                  <td className="py-space-md px-space-md text-right whitespace-nowrap">
                    <div className="flex flex-col items-end">
                      <span className="font-headline-sm text-headline-sm font-bold tabular-nums" style={{ color: '#16a34a' }}>
                        {item.amount}
                      </span>
                      <span className="font-code-sm text-code-sm text-outline">USDC (Stellar Anchor)</span>
                    </div>
                  </td>

                  <td className="py-space-md px-space-md w-44">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-label-sm font-label-sm">
                        <span className="text-on-surface font-semibold">{item.progress}%</span>
                        <span className="text-outline">{item.progressText}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500" 
                          style={{
                            width: `${item.progress}%`,
                            backgroundColor: item.statusType === 'DISPUTE' ? '#ba1a1a' : '#ea580c'
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>

                  <td className="py-space-md px-space-lg text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      {item.statusType === 'DISPUTE' ? (
                        <button 
                          type="button"
                          onClick={() => onOpenDispute(item.id)}
                          className="px-3 py-1.5 rounded-lg bg-error-container text-on-error-container font-label-md text-label-md font-semibold transition-colors shadow-sm"
                        >
                          Ver Disputa
                        </button>
                      ) : (
                        <button 
                          type="button"
                          onClick={() => onSelectContract(item.id)}
                          className="px-3 py-1.5 rounded-lg font-label-md text-label-md font-semibold transition-colors shadow-sm"
                          style={{ backgroundColor: '#fff7ed', color: '#ea580c', border: '1px solid #fed7aa' }}
                        >
                          Ver Detalle
                        </button>
                      )}
                      <button 
                        type="button"
                        onClick={() => alert(`Opciones del contrato ${item.id}`)}
                        className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">more_vert</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination & Table Footer */}
        <div className="px-space-lg py-space-md bg-surface-container-lowest flex flex-col sm:flex-row items-center justify-between gap-space-md border-t border-surface-container-high">
          <div className="flex items-center gap-space-md">
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Mostrando <strong className="text-on-surface font-semibold">1-5</strong> de <strong className="text-on-surface font-semibold">8</strong> contratos activos
            </span>
            <div className="h-4 w-px bg-surface-container-high hidden sm:block"></div>
            <div className="flex items-center gap-space-xs">
              <button 
                type="button"
                onClick={() => alert('Descargando lista de contratos en CSV...')}
                className="px-2 py-1 rounded bg-surface-container-low text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm flex items-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                <span>CSV</span>
              </button>
              <button 
                type="button"
                onClick={() => alert('Generando informe general de auditoría en PDF...')}
                className="px-2 py-1 rounded bg-surface-container-low text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm flex items-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                <span>Auditoría PDF</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-lg text-outline hover:bg-surface-container transition-colors disabled:opacity-30" disabled>
              <span className="material-symbols-outlined text-base">chevron_left</span>
            </button>
            <button 
              className="w-8 h-8 rounded-lg text-white font-label-md text-label-md font-bold shadow-sm"
              style={{ backgroundColor: '#ea580c' }}
            >
              1
            </button>
            <button className="w-8 h-8 rounded-lg text-on-surface hover:bg-surface-container transition-colors font-label-md text-label-md">
              2
            </button>
            <button className="p-1.5 rounded-lg text-on-surface hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-base">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Multi-Sig Protocol & Security Assurance Banner */}
      <div 
        className="p-space-lg rounded-2xl bg-surface-container-low flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md shadow-sm border border-slate-200"
      >
        <div className="flex items-center gap-space-md">
          <div className="w-12 h-12 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">shield_locked</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Garantía de Fondos y Cumplimiento B2B
            </span>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Todos los activos están bloqueados criptográficamente en contratos inteligentes de Soroban auditados. Las liberaciones requieren quórum de firmas institucionales (M-de-N) y verificación de hitos off-chain.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-space-sm shrink-0">
          <button 
            type="button"
            onClick={() => alert('Verificación RPC Soroban: Estado de contratos sincronizado 100% con ledger #54,198,024')}
            className="px-space-md py-2 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container font-label-md text-label-md shadow-sm transition-colors flex items-center gap-1.5 border border-slate-200"
          >
            <span className="material-symbols-outlined text-base">code</span>
            <span>Verificación RPC</span>
          </button>
          <button 
            type="button"
            onClick={() => window.open('https://stellar.org/soroban', '_blank')}
            className="px-space-md py-2 rounded-lg bg-tertiary text-on-tertiary hover:bg-tertiary-container font-label-md text-label-md transition-colors flex items-center gap-1.5"
            style={{ backgroundColor: '#006194', color: '#ffffff' }}
          >
            <span className="material-symbols-outlined text-base">menu_book</span>
            <span>Doc. Técnica</span>
          </button>
        </div>
      </div>

    </div>
  );
};
