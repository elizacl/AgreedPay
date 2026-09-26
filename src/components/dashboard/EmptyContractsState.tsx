import React from 'react';

interface EmptyContractsStateProps {
  onOpenCreateAgreement: () => void;
}

export const EmptyContractsState: React.FC<EmptyContractsStateProps> = ({ onOpenCreateAgreement }) => {
  return (
    <div 
      className="w-full bg-surface-container-lowest p-space-xl rounded-2xl shadow-sm flex flex-col items-center justify-center text-center my-6"
      style={{
        border: '1px dashed rgb(203, 213, 225)',
        boxShadow: 'rgba(234, 88, 12, 0.03) 0px 8px 20px -4px'
      }}
    >
      <div 
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-sm"
        style={{
          background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
          border: '1px solid #fed7aa'
        }}
      >
        <span className="material-symbols-outlined text-3xl" style={{ color: '#ea580c' }}>
          description
        </span>
      </div>

      <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-2">
        No tienes contratos activos en esta cuenta
      </h3>
      <p className="font-body-md text-body-md text-on-surface-variant max-w-md mb-6">
        Inicia un acuerdo comercial formal con custodia programable en USDC. Los fondos solo se liberan cuando apruebes cada hito.
      </p>

      <button
        type="button"
        onClick={onOpenCreateAgreement}
        className="px-6 py-3 rounded-xl font-label-md text-label-md font-bold text-white shadow-md flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        style={{
          backgroundColor: '#ea580c',
          boxShadow: 'rgba(234, 88, 12, 0.3) 0px 8px 16px -2px'
        }}
      >
        <span className="material-symbols-outlined text-lg">add_circle</span>
        <span>Crear Mi Primer Acuerdo B2B</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-100 w-full max-w-2xl text-left">
        <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low/50">
          <span className="material-symbols-outlined text-secondary text-xl mt-0.5" style={{ color: '#16a34a' }}>
            verified_user
          </span>
          <div>
            <h4 className="font-label-md text-label-md font-bold text-on-surface">Custodia RWA Segura</h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Fondos bloqueados en smart contract Soroban.</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low/50">
          <span className="material-symbols-outlined text-xl mt-0.5" style={{ color: '#ea580c' }}>
            bolt
          </span>
          <div>
            <h4 className="font-label-md text-label-md font-bold text-on-surface">100% Sin Gas</h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Transacciones patrocinadas por Account Abstraction.</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low/50">
          <span className="material-symbols-outlined text-tertiary text-xl mt-0.5">
            link
          </span>
          <div>
            <h4 className="font-label-md text-label-md font-bold text-on-surface">Comprobante Inmutable</h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Verificación directa en el explorador Stellar.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
