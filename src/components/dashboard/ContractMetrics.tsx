import React from 'react';

interface ContractMetricsProps {
  totalAmount?: number;
  releasedAmount?: number;
  lockedAmount?: number;
  progressPercent?: number;
  milestonesCompleted?: number;
  totalMilestones?: number;
  antiLockupDays?: number;
  counterpartyName?: string;
  counterpartyTag?: string;
  counterpartyWallet?: string;
}

export const ContractMetrics: React.FC<ContractMetricsProps> = ({
  totalAmount = 85000,
  releasedAmount = 25000,
  lockedAmount = 60000,
  progressPercent = 60,
  milestonesCompleted = 3,
  totalMilestones = 5,
  antiLockupDays = 11,
  counterpartyName = "Acme Corp",
  counterpartyTag = "Venture Studio Dev",
  counterpartyWallet = "GA78...K32P",
}) => {
  const liquidityDevengada = ((releasedAmount / totalAmount) * 100).toFixed(1);

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
      
      {/* KPI 1: En Custodia */}
      <div 
        className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between"
        style={{
          border: '1px solid rgb(226, 232, 240)',
          boxShadow: 'rgba(234, 88, 12, 0.05) 0px 10px 25px -5px, rgba(0, 0, 0, 0.02) 0px 4px 6px -2px'
        }}
      >
        <div className="flex items-center justify-between">
          <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
            Total en Custodia
          </span>
          <span className="p-1.5 rounded-lg bg-surface-container-low text-secondary flex items-center">
            <span className="material-symbols-outlined text-base">payments</span>
          </span>
        </div>
        <div className="my-space-sm">
          <div className="font-metric-xl text-metric-xl font-bold text-secondary tracking-tight">
            ${totalAmount.toLocaleString()} <span className="font-label-md text-label-md font-semibold text-on-surface-variant">USDC</span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Liberado: <span className="font-semibold text-on-surface">${releasedAmount.toLocaleString()}</span> • Bloqueado: <span className="font-semibold text-on-surface">${lockedAmount.toLocaleString()}</span>
          </p>
        </div>
        <div>
          <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
            <div className="bg-secondary h-2 rounded-full" style={{ width: `${liquidityDevengada}%` }}></div>
          </div>
          <span className="font-code-sm text-code-sm text-on-surface-variant mt-1 block">
            {liquidityDevengada}% liquidez devengada
          </span>
        </div>
      </div>

      {/* KPI 2: Progreso */}
      <div 
        className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between"
        style={{
          border: '1px solid rgb(226, 232, 240)',
          boxShadow: 'rgba(234, 88, 12, 0.05) 0px 10px 25px -5px, rgba(0, 0, 0, 0.02) 0px 4px 6px -2px'
        }}
      >
        <div className="flex items-center justify-between">
          <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
            Progreso del Contrato
          </span>
          <span className="p-1.5 rounded-lg bg-surface-container-low text-tertiary flex items-center">
            <span className="material-symbols-outlined text-base">donut_large</span>
          </span>
        </div>
        <div className="my-space-sm flex items-center gap-space-md">
          {/* SVG Donut Chart */}
          <svg className="w-14 h-14 transform -rotate-90 flex-shrink-0" viewBox="0 0 36 36">
            <path 
              className="text-surface-container" 
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="3.5"
            />
            <path 
              className="text-primary" 
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
              fill="none" 
              stroke="#ea580c" 
              strokeDasharray={`${progressPercent}, 100`} 
              strokeLinecap="round" 
              strokeWidth="3.5"
            />
          </svg>
          <div>
            <div className="font-metric-xl text-metric-xl font-bold text-on-surface">
              {progressPercent}%
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {milestonesCompleted} de {totalMilestones} hitos en ciclo
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 font-body-sm text-body-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-xs text-secondary">check_circle</span>
          <span>Última liberación: hace 4 días</span>
        </div>
      </div>

      {/* KPI 3: Anti-Lockup */}
      <div 
        className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between"
        style={{
          border: '1px solid rgb(226, 232, 240)',
          boxShadow: 'rgba(234, 88, 12, 0.05) 0px 10px 25px -5px, rgba(0, 0, 0, 0.02) 0px 4px 6px -2px'
        }}
      >
        <div className="flex items-center justify-between">
          <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
            Plazo de Revisión
          </span>
          <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">timer</span>
            Activo
          </span>
        </div>
        <div className="my-space-sm">
          <div className="font-metric-xl text-metric-xl font-bold text-primary tracking-tight" style={{ color: '#ea580c' }}>
            {antiLockupDays} días
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Reclamo automático por inactividad
          </p>
        </div>
        <div>
          <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
            <div className="bg-primary h-2 rounded-full" style={{ width: '79%', backgroundColor: '#ea580c' }}></div>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="font-code-sm text-code-sm text-on-surface-variant">Tiempo restante</span>
            <span className="font-code-sm text-code-sm font-semibold" style={{ color: '#ea580c' }}>79%</span>
          </div>
        </div>
      </div>

      {/* KPI 4: Contraparte Comercial */}
      <div 
        className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between"
        style={{
          border: '1px solid rgb(226, 232, 240)',
          boxShadow: 'rgba(234, 88, 12, 0.05) 0px 10px 25px -5px, rgba(0, 0, 0, 0.02) 0px 4px 6px -2px'
        }}
      >
        <div className="flex items-center justify-between">
          <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
            Contraparte Comercial
          </span>
          <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed-variant font-label-sm text-label-sm font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-xs fill-1">verified</span>
            KYB N3
          </span>
        </div>
        <div className="my-space-sm flex items-center gap-space-sm">
          <div 
            className="w-10 h-10 rounded-xl font-bold flex items-center justify-center font-headline-sm text-headline-sm shadow-sm"
            style={{ backgroundColor: '#f1f5f9', color: '#131b2e', border: '1px solid #e2e8f0' }}
          >
            A
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-headline-sm text-headline-sm font-bold truncate">
              {counterpartyName}
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {counterpartyTag}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low">
          <span className="font-code-sm text-code-sm text-on-surface-variant">Wallet Stellar</span>
          <span className="font-code-sm text-code-sm font-bold text-tertiary">
            {counterpartyWallet}
          </span>
        </div>
      </div>

    </section>
  );
};
