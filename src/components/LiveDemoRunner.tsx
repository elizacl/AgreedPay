import React, { useState, useEffect, useRef } from 'react';

interface DemoStep {
  label: string;
  status: string;
  hash?: string;
}

interface DemoResult {
  ok: boolean;
  contractId?: string;
  explorerUrl?: string;
  client?: string;
  freelancer?: string;
  steps?: DemoStep[];
  error?: string;
}

export const LiveDemoRunner: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [result, setResult] = useState<DemoResult | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleRun = async () => {
    setIsRunning(true);
    setResult(null);
    setElapsed(0);
    timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);

    try {
      const res = await fetch('/api/demo', { method: 'POST' });
      const data: DemoResult = await res.json();
      setResult(data);
    } catch (err: any) {
      setResult({ ok: false, error: err?.message || 'Error de red' });
    } finally {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsRunning(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 w-full">
      <div
        className="p-6 rounded-2xl bg-surface-container-lowest border border-slate-200 shadow-sm flex flex-col items-center gap-4 text-center"
        style={{ borderColor: 'rgb(254, 215, 170)', background: 'linear-gradient(135deg, #ffffff 0%, rgba(255, 247, 237, 0.5) 100%)' }}
      >
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-2xl" style={{ color: '#ea580c' }}>bolt</span>
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
            Prueba real, sin wallet ni instalar nada
          </h3>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
          Genera cuentas nuevas en Stellar Testnet, despliega una instancia del contrato auditado y ejecuta
          depósito → entrega → aprobación de pago — transacciones reales, verificables en Stellar Expert.
        </p>

        <button
          type="button"
          onClick={handleRun}
          disabled={isRunning}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-label-md text-label-md font-bold text-white shadow-lg transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-70"
          style={{ backgroundColor: '#ea580c', boxShadow: 'rgba(234, 88, 12, 0.35) 0px 6px 16px -2px' }}
        >
          {isRunning ? (
            <>
              <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
              Ejecutando en Testnet... ({elapsed}s)
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-base">play_arrow</span>
              Correr demo real en Testnet
            </>
          )}
        </button>

        {result && result.ok && (
          <div className="w-full mt-2 p-4 rounded-xl bg-white border border-slate-200 text-left flex flex-col gap-2">
            <p className="font-label-sm text-label-sm font-bold" style={{ color: '#16a34a' }}>
              ✅ Flujo completado on-chain
            </p>
            <div className="font-code-sm text-code-sm text-on-surface-variant break-all">
              Contrato: {result.contractId}
            </div>
            <a
              href={result.explorerUrl}
              target="_blank"
              rel="noreferrer"
              className="font-code-sm text-code-sm hover:underline inline-flex items-center gap-1"
              style={{ color: '#ea580c' }}
            >
              <span className="material-symbols-outlined text-xs">open_in_new</span>
              Ver contrato en Stellar Expert
            </a>
            <ul className="mt-1 flex flex-col gap-1">
              {(result.steps || [])
                .filter((s) => s.hash)
                .map((s, i) => (
                  <li key={i} className="font-code-sm text-code-sm text-on-surface-variant flex justify-between gap-2">
                    <span>{s.label}</span>
                    <a
                      href={`https://stellar.expert/explorer/testnet/tx/${s.hash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline"
                      style={{ color: '#ea580c' }}
                    >
                      {s.hash?.slice(0, 8)}...
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        )}

        {result && !result.ok && (
          <div className="w-full mt-2 p-4 rounded-xl bg-red-50 border border-red-200 text-left">
            <p className="font-label-sm text-label-sm font-bold text-red-700">Error ejecutando la demo</p>
            <p className="font-code-sm text-code-sm text-red-600 mt-1">{result.error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveDemoRunner;
