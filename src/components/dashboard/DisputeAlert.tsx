import React from 'react';
import { Bot, AlertTriangle, Clock, ArrowRight, ShieldAlert, CheckCircle2, ExternalLink } from 'lucide-react';
import { Role } from '../../types/ui';
import { DisputeInfo } from '../../types/contract';

interface DisputeAlertProps {
  dispute?: DisputeInfo;
  role: Role;
  onResolveOrFix?: () => void;
}

export const DisputeAlert: React.FC<DisputeAlertProps> = ({
  dispute = {
    milestoneId: 2,
    milestoneTitle: "Hito 2: Integración Cavos & Account Abstraction",
    functionalScore: 84.5,
    extensionDays: 5,
    extensionDeadline: "4d 18h 32m",
    arbitrationVerdict: "ExtensionGranted",
    rationale: "El análisis de AST y cobertura de pruebas en GitHub determinó un avance funcional del 84.5% (>= 80%). Se otorga un período de gracia de 5 días para corregir dependencias y pruebas E2E.",
  },
  role,
  onResolveOrFix,
}) => {
  return (
    <div className="rounded-2xl border-2 border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 p-4 sm:p-5 shadow-lg shadow-amber-500/10 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Info Principal de la Disputa */}
        <div className="flex items-start space-x-3.5">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <Bot className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300 border border-amber-500/40">
                Arbitraje IA: ExtensionGranted
              </span>
              <span className="text-xs text-slate-400">
                {dispute.milestoneTitle}
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed max-w-2xl">
              {dispute.rationale}
            </p>
          </div>
        </div>

        {/* Métricas de Arbitraje y Acción */}
        <div className="flex flex-wrap items-center gap-3 md:flex-shrink-0">
          {/* Score de Avance */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-center">
            <span className="block text-[10px] uppercase font-semibold text-slate-500">Avance Evaluado</span>
            <span className="text-sm font-bold font-mono text-emerald-400">
              {dispute.functionalScore}%
            </span>
          </div>

          {/* Temporizador de Prórroga */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-center">
            <span className="block text-[10px] uppercase font-semibold text-amber-400">Prórroga de 5d</span>
            <span className="text-sm font-bold font-mono text-amber-300 flex items-center justify-center space-x-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{dispute.extensionDeadline}</span>
            </span>
          </div>

          {/* Botón de Acción según Rol */}
          {role === 'developer' ? (
            <button
              onClick={onResolveOrFix}
              className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:from-amber-400 hover:to-orange-400 shadow-md shadow-amber-500/20 transition active:scale-95"
            >
              <span>Subsanar y Re-enviar Hash</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              onClick={onResolveOrFix}
              className="flex items-center space-x-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
            >
              <span>Ver Auditoría LLM</span>
              <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
            </button>
          )}

        </div>

      </div>
    </div>
  );
};
