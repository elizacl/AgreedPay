import React, { useState } from 'react';

interface CreateAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (agreement: any) => void;
}

export const CreateAgreementModal: React.FC<CreateAgreementModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [projectName, setProjectName] = useState('Desarrollo Web SaaS & Plataforma Mobile');
  const [counterparty, setCounterparty] = useState('freelancer@acmeventure.dev');
  const [amount, setAmount] = useState('85,000.00');
  const [threshold, setThreshold] = useState(80);
  const [antiLockup, setAntiLockup] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      onCreate({
        title: projectName,
        freelancerAddress: counterparty,
        totalAmount: parseFloat(amount.replace(/,/g, '')) || 85000,
        progressThreshold: threshold,
        antiLockup,
      });

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1200);
    }, 1500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-space-md sm:p-space-lg overflow-y-auto"
      style={{ background: 'rgba(19, 27, 46, 0.4)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      {/* MODAL CONTAINER */}
      <div 
        className="relative w-full max-w-[620px] my-auto bg-surface-container-lowest rounded-2xl shadow-2xl p-space-lg sm:p-space-xl flex flex-col gap-space-lg transition-transform duration-200"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1px solid rgb(241, 245, 249)',
          boxShadow: 'rgba(234, 88, 12, 0.12) 0px 25px 50px -12px, rgba(0, 0, 0, 0.04) 0px 10px 20px -5px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-start justify-between gap-space-md">
          <div className="flex items-start gap-space-md">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
              style={{
                backgroundColor: 'rgb(255, 247, 237)',
                color: 'rgb(234, 88, 12)',
                border: '1px solid rgb(255, 237, 213)'
              }}
            >
              <span className="material-symbols-outlined text-2xl fill-1">lock</span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
                  Configurar Contrato Inteligente de Custodia B2B
                </h2>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Creación de Escrow para desarrollo y servicios profesionales en Soroban (Stellar) con liquidación automatizada por oráculo y verificación de código.
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-space-md">
          {/* Campo 1: Nombre del Proyecto */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-on-surface flex items-center justify-between" htmlFor="projectName">
              <span>Nombre del Proyecto / Servicio B2B</span>
              <span className="text-on-surface-variant font-body-sm text-body-sm">Obligatorio</span>
            </label>
            <div className="relative flex items-center">
              <input 
                id="projectName"
                type="text"
                required
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Ej. Integración API Core Bancario"
                className="w-full h-11 px-3.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md shadow-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                style={{
                  border: '1.5px solid rgb(226, 232, 240)',
                  borderRadius: '0.75rem',
                  backgroundColor: '#ffffff'
                }}
              />
            </div>
          </div>

          {/* Campo 2: Contraparte B2B */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="font-label-md text-label-md text-on-surface" htmlFor="counterpartyInput">
                Contraparte B2B (Freelancer / Agencia Receptora de Fondos)
              </label>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed font-label-sm text-label-sm">
                <span className="material-symbols-outlined text-xs fill-1">verified</span>
                Cuenta Verificada KYB
              </span>
            </div>
            <div className="relative flex items-center">
              <input 
                id="counterpartyInput"
                type="text"
                required
                value={counterparty}
                onChange={(e) => setCounterparty(e.target.value)}
                placeholder="correo@empresa.com o clave pública GA..."
                className="w-full h-11 pl-3.5 pr-28 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md shadow-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                style={{
                  border: '1.5px solid rgb(226, 232, 240)',
                  borderRadius: '0.75rem',
                  backgroundColor: '#ffffff'
                }}
              />
              <div className="absolute right-2 px-2 py-1 rounded bg-surface-container font-code-sm text-code-sm text-on-surface-variant font-medium select-none pointer-events-none">
                GA78...K32P
              </div>
            </div>
          </div>

          {/* Campo 3: Monto Total en Custodia */}
          <div 
            className="p-space-md rounded-xl flex flex-col gap-space-xs shadow-sm"
            style={{
              background: 'linear-gradient(rgb(250, 250, 250) 0%, rgb(248, 250, 252) 100%)',
              border: '1px solid rgb(226, 232, 240)',
              borderRadius: '1rem'
            }}
          >
            <div className="flex items-center justify-between">
              <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider" htmlFor="escrowAmount">
                Monto Total en Custodia (SAC USDC)
              </label>
              <div className="flex items-center gap-1 font-label-sm text-label-sm text-secondary font-medium">
                <span className="material-symbols-outlined text-xs">account_balance_wallet</span>
                <span>150,000.00 USDC disponibles</span>
              </div>
            </div>
            <div className="flex items-baseline justify-between gap-space-sm pt-1">
              <div className="flex items-baseline gap-2">
                <input 
                  id="escrowAmount"
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="font-metric-xl text-metric-xl text-on-surface font-bold tracking-tight bg-transparent border-none outline-none max-w-[200px]"
                />
                <span className="font-headline-sm text-headline-sm text-primary font-bold">USDC</span>
              </div>
              <div className="text-right flex flex-col">
                <span className="font-code-sm text-code-sm text-on-surface font-semibold">≈ ${amount} USD</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Paridad 1:1 Nativo Soroban</span>
              </div>
            </div>
          </div>

          {/* SECCIÓN 4: SLIDER DE UMBRAL IA OBLIGATORIO */}
          <div 
            className="p-space-md rounded-xl shadow-sm flex flex-col gap-space-sm"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid rgb(241, 245, 249)',
              borderRadius: '1rem',
              boxShadow: 'rgba(0, 0, 0, 0.04) 0px 1px 3px'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-base fill-1">neurology</span>
                <span className="font-label-md text-label-md text-on-surface font-semibold">
                  Umbral de Verificación por Oráculo IA (progress_threshold)
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-code-sm text-code-sm font-bold">
                <span>{threshold}%</span>
                <span className="font-label-sm text-label-sm font-normal text-on-primary-fixed-variant">Recomendado</span>
              </div>
            </div>

            {/* Interactive Range Slider */}
            <div className="flex flex-col gap-2 pt-2">
              <div className="relative w-full flex items-center">
                <input 
                  type="range"
                  min="50"
                  max="95"
                  step="1"
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer focus:outline-none"
                  style={{
                    accentColor: 'rgb(234, 88, 12)',
                    background: 'rgb(254, 215, 170)',
                    height: '6px',
                    borderRadius: '9999px'
                  }}
                />
              </div>
              <div className="flex justify-between font-code-sm text-code-sm text-on-surface-variant px-0.5">
                <span>50% (Permisivo)</span>
                <span className="text-primary font-semibold">80% (Estándar B2B)</span>
                <span>95% (Estricto)</span>
              </div>
            </div>

            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed pt-1">
              El oráculo Soroban comparará commits en GitHub, cobertura de tests unitarios y entregables en staging contra los requerimientos del contrato. Si la coincidencia supera el <strong className="text-on-surface font-semibold">{threshold}%</strong>, el hito queda pre-aprobado.
            </p>
          </div>

          {/* SECCIÓN 5: CONDICIONES DE SEGURIDAD Y EJECUCIÓN */}
          <div className="flex flex-col gap-space-sm">
            {/* Toggle Anti-Lockup */}
            <div className="flex items-start justify-between gap-space-md p-space-sm rounded-lg bg-surface-container-low">
              <div className="flex flex-col gap-0.5">
                <span className="font-label-md text-label-md text-on-surface font-semibold">
                  Activar protección de liberación por inactividad (Anti-Lockup 14 días)
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Permite al freelancer solicitar reclamo si la contraparte no revisa las entregas tras 14 días naturales.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                <input 
                  type="checkbox" 
                  checked={antiLockup} 
                  onChange={(e) => setAntiLockup(e.target.checked)} 
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface-container-lowest after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:border-surface-container-high after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {/* Resumen técnico Soroban & Cavos Paymaster */}
            <div className="p-space-sm px-space-md rounded-xl bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                <span className="font-code-sm text-code-sm text-on-surface font-medium">Red de Ejecución:</span>
                <span className="font-code-sm text-code-sm text-on-surface font-semibold">Stellar Soroban (Testnet)</span>
              </div>
              <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-tertiary-fixed bg-tertiary-fixed px-2.5 py-1 rounded-md">
                <span>Tarifa de Red: 0.00000 XLM</span>
                <span className="font-bold">⚡ Patrocinado por Cavos Paymaster</span>
              </div>
            </div>
          </div>

          {/* SECCIÓN 6: BOTONERA DE ACCIÓN */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-space-sm pt-space-xs">
            <button 
              type="button" 
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-3 rounded-xl font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors text-center font-semibold"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={isSubmitting || isSuccess}
              className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-headline-sm text-headline-sm shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] font-bold ${
                isSuccess 
                  ? 'bg-secondary text-on-secondary' 
                  : 'bg-primary text-on-primary hover:bg-primary-container'
              }`}
              style={{
                backgroundColor: isSuccess ? '#16a34a' : 'rgb(234, 88, 12)',
                color: '#ffffff',
                borderRadius: '0.75rem',
                boxShadow: isSuccess 
                  ? 'rgba(22, 163, 74, 0.35) 0px 10px 20px -5px' 
                  : 'rgba(234, 88, 12, 0.35) 0px 10px 20px -5px, rgba(234, 88, 12, 0.2) 0px 4px 6px -2px'
              }}
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined text-xl animate-spin">progress_activity</span>
                  <span>Firmando con Cavos Paymaster...</span>
                </>
              ) : isSuccess ? (
                <>
                  <span className="material-symbols-outlined text-xl">check_circle</span>
                  <span>¡Escrow Desplegado con Éxito!</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-xl fill-1">lock</span>
                  <span>Bloquear Fondos en Custodia (Gasless Escrow)</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
