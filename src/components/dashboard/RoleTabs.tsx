import React from 'react';
import { Role } from '../../types';

interface RoleTabsProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  onDownloadLegalPdf?: () => void;
  onOpenVault?: () => void;
}

export const RoleTabs: React.FC<RoleTabsProps> = ({
  currentRole,
  onRoleChange,
  onDownloadLegalPdf,
  onOpenVault,
}) => {
  return (
    <section 
      className="flex flex-col gap-space-md bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm"
      style={{
        border: '1px solid rgb(226, 232, 240)',
        boxShadow: 'rgba(234, 88, 12, 0.05) 0px 10px 25px -5px, rgba(0, 0, 0, 0.02) 0px 4px 6px -2px'
      }}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div className="flex flex-col gap-space-xs">
          <div className="flex flex-wrap items-center gap-space-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed-variant font-label-sm text-label-sm font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
              Activo (3/5 Hitos)
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-xs">lock</span>
              Custodia Segura
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
            Contrato B2B #4092: Desarrollo de Plataforma Web SaaS & Mobile App
          </h1>
        </div>

        <div className="flex items-center gap-space-sm flex-wrap">
          <button 
            type="button"
            onClick={onDownloadLegalPdf || (() => alert('Descargando Auditoría Legal Criptográfica en PDF...'))}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors text-on-surface font-label-md text-label-md shadow-sm font-semibold"
          >
            <span className="material-symbols-outlined text-base text-tertiary">picture_as_pdf</span>
            Auditoría Legal (PDF)
          </button>
          <button 
            type="button"
            onClick={onOpenVault || (() => alert('Accediendo a Bóveda de Garantía Soroban...'))}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors text-on-surface font-label-md text-label-md shadow-sm font-semibold"
          >
            <span className="material-symbols-outlined text-base text-secondary">lock</span>
            Bóveda de Garantía
          </button>
        </div>
      </div>

      {/* ROLE SELECTOR BAR */}
      <div className="flex items-center gap-space-sm pt-space-sm border-t border-surface-container-low">
        <div className="inline-flex p-1 rounded-xl bg-surface-container-low">
          <button 
            type="button"
            onClick={() => onRoleChange('client')}
            className={`px-4 py-2 rounded-lg font-label-md text-label-md transition-all font-semibold flex items-center gap-2 ${
              currentRole === 'client'
                ? 'shadow-sm bg-primary text-on-primary font-bold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            style={
              currentRole === 'client'
                ? { backgroundColor: 'rgb(234, 88, 12)', color: '#ffffff' }
                : {}
            }
          >
            <span className="material-symbols-outlined text-sm">business_center</span>
            Vista Cliente
          </button>
          <button 
            type="button"
            onClick={() => onRoleChange('developer')}
            className={`px-4 py-2 rounded-lg font-label-md text-label-md transition-all font-semibold flex items-center gap-2 ${
              currentRole === 'developer'
                ? 'shadow-sm bg-primary text-on-primary font-bold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            style={
              currentRole === 'developer'
                ? { backgroundColor: 'rgb(234, 88, 12)', color: '#ffffff' }
                : {}
            }
          >
            <span className="material-symbols-outlined text-sm">terminal</span>
            Vista Freelancer
          </button>
        </div>
      </div>
    </section>
  );
};
