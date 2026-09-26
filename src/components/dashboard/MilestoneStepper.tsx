import React, { useState } from 'react';
import { Role } from '../../types';

export interface StepperMilestone {
  id: number;
  status: 'Pending' | 'Submitted' | 'Approved' | 'Disputed' | 'RevisionRequired' | 'TimedOut';
  amountUsdc: number;
  descriptionHash: string;
  submissionTimestamp: number;
}

interface MilestoneStepperProps {
  role: Role;
  milestones: StepperMilestone[];
  isLoading?: boolean;
  contractId?: string;
  onApprove: (id: number) => Promise<void> | void;
  onDispute: (id: number) => void;
  onSubmitWork?: (id: number) => Promise<void> | void;
  onClaimTimeout?: (id: number) => Promise<void> | void;
  onOpenDisputeModal?: () => void;
}

const STATUS_META: Record<
  StepperMilestone['status'],
  { label: string; bg: string; fg: string; icon: string }
> = {
  Pending: { label: 'En custodia · Esperando entrega', bg: '#f1f5f9', fg: '#475569', icon: 'lock' },
  Submitted: { label: 'Entregado · Requiere aprobación', bg: '#ffedd5', fg: '#ea580c', icon: 'hourglass_top' },
  Approved: { label: 'Aprobado & Pagado', bg: '#dcfce7', fg: '#16a34a', icon: 'check' },
  Disputed: { label: 'En disputa / arbitraje', bg: '#fee2e2', fg: '#dc2626', icon: 'gavel' },
  RevisionRequired: { label: 'Prórroga de revisión otorgada (IA)', bg: '#fef3c7', fg: '#b45309', icon: 'update' },
  TimedOut: { label: 'Concluido (timeout / disputa resuelta)', bg: '#e2e8f0', fg: '#334155', icon: 'flag' },
};

export const MilestoneStepper: React.FC<MilestoneStepperProps> = ({
  role,
  milestones,
  isLoading,
  contractId,
  onApprove,
  onDispute,
  onSubmitWork,
  onClaimTimeout,
  onOpenDisputeModal,
}) => {
  const [copiedHash, setCopiedHash] = useState<number | null>(null);
  const [pendingActionId, setPendingActionId] = useState<number | null>(null);

  const handleCopyHash = (id: number, hash: string) => {
    navigator.clipboard?.writeText(hash);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const withPending = async (id: number, fn?: (id: number) => Promise<void> | void) => {
    if (!fn) return;
    setPendingActionId(id);
    try {
      await fn(id);
    } finally {
      setPendingActionId(null);
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
            Seguimiento de entregables y liberación de fondos (on-chain, Stellar Testnet)
          </p>
        </div>
        <span className="font-code-sm text-code-sm px-2.5 py-1 rounded bg-surface-container text-on-surface-variant font-medium">
          Custodia Segura
        </span>
      </div>

      {isLoading && (
        <div className="w-full p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm border border-slate-200 text-center font-body-sm text-on-surface-variant">
          Leyendo estado del contrato en Soroban RPC (getLedgerEntries)...
        </div>
      )}

      {!isLoading && milestones.length === 0 && (
        <div className="w-full p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm border border-slate-200 text-center font-body-sm text-on-surface-variant">
          Este contrato aún no tiene hitos. Fondea el escrow para crear el primero.
        </div>
      )}

      {/* Timeline List */}
      {milestones.length > 0 && (
        <div className="flex flex-col relative pl-6">
          <div className="absolute left-3 top-3 bottom-6 w-0.5 bg-surface-container-highest"></div>

          {milestones.map((m) => {
            const meta = STATUS_META[m.status] || STATUS_META.Pending;
            const isBusy = pendingActionId === m.id;
            const isActionable = m.status === 'Submitted' || m.status === 'Pending';

            return (
              <div key={m.id} className="relative flex items-start gap-space-md pb-space-lg group">
                <div
                  className="absolute -left-6 top-1 w-6 h-6 rounded-full flex items-center justify-center shadow-sm z-10"
                  style={{ backgroundColor: meta.bg, color: meta.fg }}
                >
                  <span className="material-symbols-outlined text-sm font-bold">{meta.icon}</span>
                </div>

                <div
                  className="w-full bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col gap-space-sm"
                  style={{
                    border: m.status === 'Submitted' ? '1px solid rgb(254, 215, 170)' : '1px solid rgb(226, 232, 240)',
                  }}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
                    <div className="min-w-0">
                      <div className="flex items-center gap-space-xs mb-1 flex-wrap">
                        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                          Hito #{m.id}
                        </span>
                        <span
                          className="px-2 py-0.5 rounded-full font-label-sm text-label-sm font-semibold"
                          style={{ backgroundColor: meta.bg, color: meta.fg }}
                        >
                          {meta.label}
                        </span>
                      </div>
                      <details className="mt-1 text-xs group/details">
                        <summary className="cursor-pointer text-outline hover:text-tertiary font-code-sm list-none flex items-center gap-1 select-none">
                          <span className="material-symbols-outlined text-xs">tune</span>
                          <span>Detalles técnicos on-chain</span>
                        </summary>
                        <div className="mt-1.5 p-2 rounded bg-surface-container-low font-code-sm text-on-surface-variant flex flex-col gap-1 border border-slate-200">
                          <div className="flex justify-between gap-2">
                            <span>Contrato Soroban:</span>
                            <span className="font-semibold text-on-surface truncate max-w-[200px]">
                              {contractId ? `${contractId.slice(0, 6)}...${contractId.slice(-6)}` : '—'}
                            </span>
                          </div>
                          <div className="flex justify-between gap-2">
                            <span>Hash (descripción/prueba):</span>
                            <button
                              type="button"
                              onClick={() => handleCopyHash(m.id, m.descriptionHash)}
                              className="font-semibold text-on-surface truncate max-w-[200px] text-right hover:underline"
                              title={m.descriptionHash}
                            >
                              {copiedHash === m.id ? 'Copiado ✓' : `${m.descriptionHash.slice(0, 14)}...`}
                            </button>
                          </div>
                          {m.submissionTimestamp > 0 && (
                            <div className="flex justify-between gap-2">
                              <span>Timestamp (submission/deadline):</span>
                              <span className="font-semibold text-on-surface">
                                {new Date(m.submissionTimestamp * 1000).toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </details>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="font-metric-md text-metric-md font-bold" style={{ color: meta.fg }}>
                        ${m.amountUsdc.toLocaleString(undefined, { maximumFractionDigits: 7 })}
                      </span>
                      <span className="font-code-sm text-code-sm text-on-surface-variant block">USDC</span>
                    </div>
                  </div>

                  {isActionable && (
                    <div className="flex flex-col sm:flex-row items-center gap-space-sm pt-space-xs border-t border-slate-100 mt-1">
                      {role === 'client' ? (
                        m.status === 'Submitted' ? (
                          <>
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => withPending(m.id, onApprove)}
                              className="w-full sm:flex-1 py-2.5 px-5 rounded-xl font-label-md text-label-md font-bold shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-95 disabled:opacity-60"
                              style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
                            >
                              {isBusy ? (
                                <>
                                  <span className="material-symbols-outlined text-base animate-spin">refresh</span>
                                  <span>Firmando con Freighter...</span>
                                </>
                              ) : (
                                <>
                                  <span className="material-symbols-outlined text-base">verified</span>
                                  <span>Aprobar y Liberar Fondos</span>
                                </>
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => (onOpenDisputeModal ? onOpenDisputeModal() : onDispute(m.id))}
                              className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-surface-container-lowest hover:bg-surface-container-low text-on-surface-variant hover:text-on-surface font-label-md text-label-md font-semibold transition-all shadow-sm flex items-center justify-center gap-2 border border-slate-200"
                            >
                              <span className="material-symbols-outlined text-base" style={{ color: '#ea580c' }}>warning</span>
                              Disputar
                            </button>
                          </>
                        ) : (
                          <span className="font-body-sm text-body-sm text-on-surface-variant">
                            Esperando entregable del freelancer.
                          </span>
                        )
                      ) : (
                        <>
                          {m.status === 'Pending' && (
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => withPending(m.id, onSubmitWork)}
                              className="w-full sm:flex-1 py-2.5 px-5 rounded-xl font-label-md text-label-md font-bold shadow-md flex items-center justify-center gap-2 transition-all text-white disabled:opacity-60"
                              style={{ backgroundColor: '#ea580c' }}
                            >
                              <span className="material-symbols-outlined text-base">send</span>
                              <span>{isBusy ? 'Enviando...' : 'Notificar Entrega al Cliente'}</span>
                            </button>
                          )}
                          {m.status === 'Submitted' && (
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => withPending(m.id, onClaimTimeout)}
                              className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-surface-container-lowest hover:bg-surface-container-low text-on-surface-variant hover:text-on-surface font-label-md text-label-md font-semibold transition-all shadow-sm flex items-center justify-center gap-2 border border-slate-200 disabled:opacity-60"
                            >
                              <span className="material-symbols-outlined text-base" style={{ color: '#ea580c' }}>timer</span>
                              Reclamar por Timeout (14d)
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
