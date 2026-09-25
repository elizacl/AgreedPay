import React, { useState } from 'react';
import { Role } from '../../types';

interface MilestoneStepperProps {
  role: Role;
  onApprove: (id: number) => Promise<void> | void;
  onDispute: (id: number) => void;
  onSubmitWork?: (id: number) => Promise<void> | void;
  onClaimTimeout?: (id: number) => Promise<void> | void;
  onOpenDisputeModal?: () => void;
}

export const MilestoneStepper: React.FC<MilestoneStepperProps> = ({
  role,
  onApprove,
  onDispute,
  onSubmitWork,
  onClaimTimeout,
  onOpenDisputeModal,
}) => {
  const [copiedHash, setCopiedHash] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isApprovedSuccess, setIsApprovedSuccess] = useState(false);

  const handleCopyHash = () => {
    navigator.clipboard?.writeText('0x7f4a8b9e112d7c589b32fa9084');
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleApproveClick = async () => {
    setIsApproving(true);
    try {
      await onApprove(2);
      setTimeout(() => {
        setIsApproving(false);
        setIsApprovedSuccess(true);
      }, 1400);
    } catch {
      setIsApproving(false);
    }
  };

  return (
    <div className="flex flex-col gap-space-md">
      {/* Header */}
      <div className="flex items-center justify-between px-space-xs">
        <div>
          <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
            Rastreador de Hitos
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Ejecución descentralizada supervisada por contratos Stellar Soroban
          </p>
        </div>
        <span className="font-code-sm text-code-sm px-2.5 py-1 rounded bg-surface-container text-on-surface-variant font-medium">
          Modo: Estricto (Multisig 2/3)
        </span>
      </div>

      {/* Timeline List */}
      <div className="flex flex-col relative pl-6">
        {/* Connecting Vertical Guide */}
        <div className="absolute left-3 top-3 bottom-6 w-0.5 bg-surface-container-highest"></div>

        {/* HITO 1: COMPLETADO */}
        <div className="relative flex items-start gap-space-md pb-space-lg group">
          <div className="absolute -left-6 top-1 w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-sm z-10" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
            <span className="material-symbols-outlined text-sm font-bold">check</span>
          </div>
          <div 
            className="w-full bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-space-sm"
            style={{ border: '1px solid rgb(226, 232, 240)' }}
          >
            <div>
              <div className="flex items-center gap-space-xs mb-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Hito 1 • 12 Oct 2024</span>
                <span className="px-2 py-0.5 rounded-full font-label-sm text-label-sm font-semibold" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
                  Fondos Desembolsados
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Arquitectura y Sistema de Diseño UI/UX en Figma
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                Wireframes completos, design system con tokens y flujos aprobados.
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="font-metric-md text-metric-md font-bold text-secondary" style={{ color: '#16a34a' }}>$15,000</span>
              <span className="font-code-sm text-code-sm text-on-surface-variant block">Tx: 0x48a...bc19</span>
            </div>
          </div>
        </div>

        {/* HITO 2: COMPLETADO */}
        <div className="relative flex items-start gap-space-md pb-space-lg group">
          <div className="absolute -left-6 top-1 w-6 h-6 rounded-full flex items-center justify-center shadow-sm z-10" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
            <span className="material-symbols-outlined text-sm font-bold">check</span>
          </div>
          <div 
            className="w-full bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-space-sm"
            style={{ border: '1px solid rgb(226, 232, 240)' }}
          >
            <div>
              <div className="flex items-center gap-space-xs mb-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Hito 2 • 28 Oct 2024</span>
                <span className="px-2 py-0.5 rounded-full font-label-sm text-label-sm font-semibold" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
                  Fondos Desembolsados
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Frontend React &amp; Integración de APIs
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                Integración cliente REST y autenticación passkey verificada.
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="font-metric-md text-metric-md font-bold text-secondary" style={{ color: '#16a34a' }}>$20,000</span>
              <span className="font-code-sm text-code-sm text-on-surface-variant block">Tx: 0x91d...72fa</span>
            </div>
          </div>
        </div>

        {/* HITO 3: EN REVISIÓN / ACTIVO (HERO MILESTONE CARD) */}
        <div className="relative flex items-start gap-space-md pb-space-lg">
          <div 
            className="absolute -left-6 top-1 w-6 h-6 rounded-full flex items-center justify-center shadow-sm ring-4 z-10"
            style={{
              backgroundColor: '#ea580c',
              color: '#ffffff',
              boxShadow: '0 0 0 4px rgb(255, 237, 213)'
            }}
          >
            <span className="material-symbols-outlined text-sm font-bold">hourglass_top</span>
          </div>

          <div 
            className="w-full bg-surface-container-lowest p-space-lg rounded-2xl shadow-md flex flex-col gap-space-md"
            style={{
              border: '1px solid rgb(254, 215, 170)',
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(255, 247, 237, 0.4) 50%, #ffffff 100%)',
              boxShadow: 'rgba(234, 88, 12, 0.12) 0px 12px 30px -6px, rgba(0, 0, 0, 0.02) 0px 4px 6px -2px'
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-space-xs">
              <div className="flex items-center gap-2">
                <span 
                  className="px-2.5 py-1 rounded-md font-label-sm text-label-sm uppercase tracking-wider font-bold"
                  style={{ backgroundColor: '#ea580c', color: '#ffffff' }}
                >
                  Hito 3 (Actual) • En Revisión
                </span>
                <span className="px-2.5 py-1 rounded-md bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">draw</span>
                  Firma 1 de 2 requeridas
                </span>
              </div>
              <div className="text-right">
                <span className="font-metric-xl text-metric-xl font-bold text-secondary" style={{ color: '#16a34a' }}>$25,000</span>
                <span className="font-code-sm text-code-sm text-on-surface-variant block">Fianza Escrow USDC</span>
              </div>
            </div>

            <div>
              <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                Despliegue en Staging &amp; Pruebas End-to-End
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1 leading-relaxed">
                Despliegue completado en entorno Vercel Preview. Suite de pruebas Cypress y Playwright ejecutadas con 100% de éxito. Documentación de endpoints actualizada.
              </p>
            </div>

            {/* AI AUDIT METRIC BOX */}
            <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
              <div className="flex items-start gap-space-sm">
                <div className="w-8 h-8 rounded-lg bg-surface-container-high text-tertiary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-base">smart_toy</span>
                </div>
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">
                    Auditoría IA de Entregables
                  </span>
                  <p className="font-body-sm text-body-sm font-semibold text-on-surface">
                    94% de cumplimiento de especificaciones en repositorio GitHub
                    <span className="font-normal font-code-sm ml-1" style={{ color: '#16a34a' }}>
                      (Supera umbral del 80%)
                    </span>
                  </p>
                </div>
              </div>
              <a 
                className="inline-flex items-center gap-1 font-label-md text-label-md text-tertiary hover:underline flex-shrink-0 font-semibold"
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer"
              >
                Ver Pull Request / Preview Staging ↗
              </a>
            </div>

            {/* SHA-256 HASH & EVIDENCE IPFS */}
            <div className="p-space-sm rounded-xl bg-surface-container flex flex-wrap items-center justify-between gap-space-sm">
              <div className="flex items-center gap-space-sm min-w-0">
                <span className="material-symbols-outlined text-sm text-on-surface-variant">fingerprint</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">SHA-256:</span>
                <span className="font-code-sm text-code-sm text-on-surface font-semibold truncate">
                  0x7f4a8b9e112d7c589b32fa9084
                </span>
              </div>
              <div className="flex items-center gap-space-xs">
                <button 
                  type="button"
                  onClick={handleCopyHash}
                  className="px-2.5 py-1 rounded bg-surface-container-lowest hover:bg-surface-container-high text-on-surface font-code-sm text-code-sm font-medium transition-colors shadow-sm"
                >
                  {copiedHash ? 'Copiado ✓' : 'Copiar Hash'}
                </button>
                <a 
                  className="px-2.5 py-1 rounded bg-surface-container-lowest hover:bg-surface-container-high text-tertiary font-code-sm text-code-sm font-medium inline-flex items-center gap-1 shadow-sm"
                  href="https://ipfs.io"
                  target="_blank"
                  rel="noreferrer"
                >
                  IPFS ↗
                </a>
              </div>
            </div>

            {/* ACTION BUTTONS: APPROVAL / DISPUTE */}
            <div className="flex flex-col sm:flex-row items-center gap-space-sm pt-space-xs">
              {role === 'client' ? (
                <>
                  <button 
                    type="button"
                    disabled={isApproving || isApprovedSuccess}
                    onClick={handleApproveClick}
                    className="w-full sm:flex-1 py-3 px-6 rounded-xl font-label-md text-label-md font-bold shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-95"
                    style={{
                      backgroundColor: isApprovedSuccess ? '#16a34a' : '#16a34a',
                      color: '#ffffff',
                      boxShadow: 'rgba(22, 163, 74, 0.35) 0px 6px 16px -2px'
                    }}
                  >
                    {isApproving ? (
                      <>
                        <span className="material-symbols-outlined text-base animate-spin">refresh</span>
                        <span>Firmando Transacción Stellar...</span>
                      </>
                    ) : isApprovedSuccess ? (
                      <>
                        <span className="material-symbols-outlined text-base">check_circle</span>
                        <span>$25,000 USDC Liberados con Éxito</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-base">verified</span>
                        <span>Aprobar y Liberar Fondos ($25,000)</span>
                      </>
                    )}
                  </button>

                  <button 
                    type="button"
                    onClick={onOpenDisputeModal || (() => onDispute(2))}
                    className="w-full sm:w-auto py-3 px-5 rounded-xl bg-surface-container-lowest hover:bg-surface-container-low text-on-surface-variant hover:text-on-surface font-label-md text-label-md font-semibold transition-all shadow-sm flex items-center justify-center gap-2 border border-slate-200"
                  >
                    <span className="material-symbols-outlined text-base text-primary" style={{ color: '#ea580c' }}>warning</span>
                    Solicitar Corrección / Abrir Disputa
                  </button>
                </>
              ) : (
                <>
                  <button 
                    type="button"
                    onClick={() => onSubmitWork && onSubmitWork(2)}
                    className="w-full sm:flex-1 py-3 px-6 rounded-xl font-label-md text-label-md font-bold shadow-md flex items-center justify-center gap-2 transition-all text-white"
                    style={{ backgroundColor: '#ea580c' }}
                  >
                    <span className="material-symbols-outlined text-base">send</span>
                    Notificar Entrega al Cliente
                  </button>
                  <button 
                    type="button"
                    onClick={() => onClaimTimeout && onClaimTimeout(2)}
                    className="w-full sm:w-auto py-3 px-5 rounded-xl bg-surface-container-lowest hover:bg-surface-container-low text-on-surface-variant hover:text-on-surface font-label-md text-label-md font-semibold transition-all shadow-sm flex items-center justify-center gap-2 border border-slate-200"
                  >
                    <span className="material-symbols-outlined text-base text-primary" style={{ color: '#ea580c' }}>timer</span>
                    Reclamar por Timeout (11d restantes)
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* HITO 4: BLOQUEADO */}
        <div className="relative flex items-start gap-space-md pb-space-lg opacity-60">
          <div className="absolute -left-6 top-1 w-6 h-6 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center shadow-sm z-10">
            <span className="material-symbols-outlined text-xs">lock</span>
          </div>
          <div 
            className="w-full bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-space-sm"
            style={{ border: '1px solid rgb(226, 232, 240)' }}
          >
            <div>
              <div className="flex items-center gap-space-xs mb-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Hito 4 • Previsto 18 Nov</span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                  Pendiente de Desbloqueo
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Entrega de Código Fuente &amp; Despliegue en Producción
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                Transferencia de secretos, DNS de dominio principal y setup CI/CD final.
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="font-metric-md text-metric-md font-bold text-on-surface-variant">$15,000</span>
              <span className="font-code-sm text-code-sm text-on-surface-variant block">En custodia</span>
            </div>
          </div>
        </div>

        {/* HITO 5: BLOQUEADO */}
        <div className="relative flex items-start gap-space-md opacity-60">
          <div className="absolute -left-6 top-1 w-6 h-6 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center shadow-sm z-10">
            <span className="material-symbols-outlined text-xs">lock</span>
          </div>
          <div 
            className="w-full bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-space-sm"
            style={{ border: '1px solid rgb(226, 232, 240)' }}
          >
            <div>
              <div className="flex items-center gap-space-xs mb-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Hito 5 • Previsto 30 Nov</span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                  Pendiente de Desbloqueo
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Garantía de Soporte &amp; Traspaso de Repositorios
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                Periodo de soporte de 30 días posteriores al lanzamiento y handover formal.
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="font-metric-md text-metric-md font-bold text-on-surface-variant">$10,000</span>
              <span className="font-code-sm text-code-sm text-on-surface-variant block">En custodia</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
