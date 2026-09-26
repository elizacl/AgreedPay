import React from 'react';
import agreedPayLogo from '../assets/agreedpay-logo.jpeg';

interface WelcomeScreenProps {
  onOpenAuth: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onOpenAuth }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
      
      {/* Hero Section */}
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
        
        {/* Icon */}
        <img
          src={agreedPayLogo}
          alt="AgreedPay"
          className="w-20 h-20 rounded-2xl object-cover shadow-lg"
          style={{ boxShadow: 'rgba(234, 88, 12, 0.3) 0px 12px 30px -6px' }}
        />

        {/* Title */}
        <div className="space-y-3">
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight" style={{ fontSize: '2rem', lineHeight: '2.5rem' }}>
            Custodia Inteligente para<br/>Acuerdos Profesionales
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto leading-relaxed">
            Protege tus pagos por hitos con custodia programable. 
            Sin comisiones de gas. Sin intermediarios bancarios.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={onOpenAuth}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-label-md text-label-md font-bold text-white shadow-lg transition-all transform hover:scale-[1.02] active:scale-95"
            style={{ 
              backgroundColor: '#ea580c',
              boxShadow: 'rgba(234, 88, 12, 0.35) 0px 6px 16px -2px'
            }}
          >
            <span className="material-symbols-outlined text-base">fingerprint</span>
            Conectar con Google (Sin Gas)
          </button>
          <button
            onClick={onOpenAuth}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-label-md text-label-md font-semibold text-on-surface bg-surface-container-lowest hover:bg-surface-container-low shadow-sm transition-all border border-slate-200"
          >
            <span className="material-symbols-outlined text-base">account_balance_wallet</span>
            Conectar Wallet
          </button>
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-3xl mx-auto mt-16 w-full">
        <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold mb-6">
          Cómo funciona
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-surface-container-lowest border border-slate-200 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl" style={{ color: '#ea580c' }}>edit_note</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Crea un Acuerdo</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Define los términos del contrato, la contraparte y el presupuesto total en USDC.
            </p>
          </div>
          
          <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-surface-container-lowest border border-slate-200 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl" style={{ color: '#ea580c' }}>flag</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Define Hitos</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Divide el proyecto en entregables verificables. Los fondos se bloquean hasta aprobación.
            </p>
          </div>
          
          <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-surface-container-lowest border border-slate-200 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl" style={{ color: '#16a34a' }}>payments</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Libera Pagos</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Aprueba cada entregable y los fondos se liberan automáticamente. Verificable en blockchain.
            </p>
          </div>
        </div>
      </div>

      {/* Trust bar */}
      <div className="mt-12 flex items-center gap-6 text-on-surface-variant">
        <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">Respaldado por</span>
        <div className="flex items-center gap-4">
          <span className="font-code-sm text-code-sm font-semibold px-3 py-1 rounded-full bg-surface-container">Stellar</span>
          <span className="font-code-sm text-code-sm font-semibold px-3 py-1 rounded-full bg-surface-container">USDC</span>
          <span className="font-code-sm text-code-sm font-semibold px-3 py-1 rounded-full bg-surface-container">Soroban</span>
          <span className="font-code-sm text-code-sm font-semibold px-3 py-1 rounded-full bg-surface-container">Cavos</span>
        </div>
      </div>
    </div>
  );
};
