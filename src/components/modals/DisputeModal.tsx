import React, { useState } from 'react';

interface DisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  milestoneId?: number;
  milestoneTitle?: string;
  amount?: number;
}

export const DisputeModal: React.FC<DisputeModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  milestoneId = 3,
  milestoneTitle = "Hito 3: Despliegue en Staging & Pruebas End-to-End",
  amount = 25000,
}) => {
  const [selectedReason, setSelectedReason] = useState('Incumplimiento de especificación en Swagger');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onConfirm(selectedReason);
      onClose();
    }, 1200);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-space-md"
      style={{ backgroundColor: 'rgba(40, 48, 68, 0.4)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div 
        className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-space-lg shadow-2xl flex flex-col gap-space-md border border-slate-200"
        style={{ backgroundColor: '#ffffff' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2" style={{ color: '#ea580c' }}>
            <span className="material-symbols-outlined text-2xl">gavel</span>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              Registrar Evidencia de Disputa
            </h3>
          </div>
          <button 
            type="button"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            onClick={onClose}
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
          El contrato desplegado aún no expone una función para abrir disputas on-chain. Esta acción registra la evidencia de <strong>{milestoneTitle} (${amount.toLocaleString()} USDC)</strong> para su revisión off-chain.
        </p>

        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">
            Motivo Principal
          </label>
          <select 
            value={selectedReason}
            onChange={(e) => setSelectedReason(e.target.value)}
            className="w-full h-11 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md border border-slate-200 outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="Incumplimiento de especificación en Swagger">Incumplimiento de especificación en Swagger</option>
            <option value="Pruebas automatizadas incompletas en Staging">Pruebas automatizadas incompletas en Staging</option>
            <option value="Retraso no acordado en la entrega del entregable">Retraso no acordado en la entrega del entregable</option>
            <option value="Otro desacuerdo técnico/legal">Otro desacuerdo técnico/legal</option>
          </select>
        </div>

        {/* Info Box */}
        <div className="p-3 rounded-xl bg-surface-container-low flex items-start gap-2.5 border border-slate-200">
          <span className="material-symbols-outlined text-base text-tertiary mt-0.5">smart_toy</span>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            El árbitro puede evaluar la evidencia off-chain. Para cambiar el estado a <code>Disputed</code> desde la interfaz se requiere desplegar una nueva versión del contrato.
          </p>
        </div>

        <div className="flex justify-end gap-space-sm pt-space-xs">
          <button 
            type="button"
            className="px-4 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md font-semibold transition-colors"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button 
            type="button"
            disabled={isSubmitting}
            onClick={handleConfirm}
            className="px-5 py-2.5 rounded-xl font-label-md text-label-md font-bold text-white shadow-md flex items-center gap-2 transition-all"
            style={{ backgroundColor: '#ea580c' }}
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                <span>Registrando evidencia...</span>
              </>
            ) : (
              <span>Registrar Evidencia</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
