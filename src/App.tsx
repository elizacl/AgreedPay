import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ContractMetrics } from './components/dashboard/ContractMetrics';
import { RoleTabs } from './components/dashboard/RoleTabs';
import { MilestoneStepper } from './components/dashboard/MilestoneStepper';
import { DeliverablesPanel } from './components/dashboard/DeliverablesPanel';
import { ActiveContractsView } from './components/dashboard/ActiveContractsView';
import { AuditLogsView } from './components/dashboard/AuditLogsView';
import { CavosAuthModal } from './components/modals/CavosAuthModal';
import { CreateAgreementModal, CreateAgreementInput } from './components/modals/CreateAgreementModal';
import { DisputeModal } from './components/modals/DisputeModal';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Role, AuthMethod } from './types/ui';
import { Milestone } from './types/contract';
import { useCavosAuth } from './hooks/useCavosAuth';
import { useDeposit } from './hooks/useDeposit';
import { useSubmitMilestone } from './hooks/useSubmitMilestone';
import { useApproveMilestone } from './hooks/useApproveMilestone';
import { useClaimTimeout } from './hooks/useClaimTimeout';

export const App: React.FC = () => {
  const [role, setRole] = useState<Role>('client');
  const [activeTab, setActiveTab] = useState<string>('escrow-overview');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState<boolean>(false);
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Auth & Contract Hooks
  const { session, loginWithCavos, loginWithFreighter, logout } = useCavosAuth();
  const { execute: deposit } = useDeposit();
  const { execute: submitMilestone } = useSubmitMilestone();
  const { execute: approveMilestone } = useApproveMilestone();
  const { execute: claimTimeout } = useClaimTimeout();

  // Active contract milestones ($85,000 USDC)
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: 1,
      title: 'Arquitectura y Sistema de Diseño UI/UX en Figma',
      description: 'Wireframes completos, design system con tokens y flujos aprobados.',
      amount: 15000,
      status: 'Approved',
      proofHash: '0x48abc19041289124018240981203984102938401',
      submittedAt: '2024-10-12',
    },
    {
      id: 2,
      title: 'Frontend React & Integración de APIs',
      description: 'Integración cliente REST y autenticación passkey verificada.',
      amount: 20000,
      status: 'Approved',
      proofHash: '0x91d72fa019283019823901840192309XYZ998124',
      submittedAt: '2024-10-28',
    },
    {
      id: 3,
      title: 'Despliegue en Staging & Pruebas End-to-End',
      description: 'Despliegue completado en entorno Vercel Preview. Suite de pruebas Cypress y Playwright ejecutadas.',
      amount: 25000,
      status: 'Submitted',
      proofHash: '0x7f4a8b9e112d7c589b32fa9084',
      submittedAt: '2024-11-04',
    },
    {
      id: 4,
      title: 'Entrega de Código Fuente & Despliegue en Producción',
      description: 'Transferencia de secretos, DNS de dominio principal y setup CI/CD final.',
      amount: 15000,
      status: 'Pending',
    },
    {
      id: 5,
      title: 'Garantía de Soporte & Traspaso de Repositorios',
      description: 'Periodo de soporte de 30 días posteriores al lanzamiento y handover formal.',
      amount: 10000,
      status: 'Pending',
    },
  ]);

  const handleConnect = async (method: AuthMethod) => {
    try {
      if (method === 'cavos') {
        await loginWithCavos();
      } else {
        await loginWithFreighter();
      }
      setSuccessToast('✅ Billetera conectada exitosamente');
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err: any) {
      const message = err?.message || 'Error al conectar la billetera.';
      if (message.includes('Freighter')) {
        setErrorToast('Freighter no detectado. Instala la extensión desde freighter.app para conectar tu wallet nativa.');
      } else {
        setErrorToast(message);
      }
      setTimeout(() => setErrorToast(null), 6000);
    }
  };

  const getSigner = () => {
    if (!session.isConnected || !session.address || !session.authMethod) {
      throw new Error('Conecta Cavos o Freighter antes de firmar una transacción.');
    }

    return { signerAddress: session.address, walletType: session.authMethod };
  };

  const createDescriptionHash = async (description: string): Promise<string> => {
    const payload = new TextEncoder().encode(description);
    const digest = await crypto.subtle.digest('SHA-256', payload);
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
  };

  const handleApproveMilestone = async (id: number) => {
    await approveMilestone({ milestoneId: id, ...getSigner() });
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'Approved' } : m))
    );
  };

  const handleDisputeMilestone = (id: number) => {
    setIsDisputeModalOpen(true);
  };

  const handleConfirmDispute = (reason: string) => {
    alert(`Evidencia de disputa registrada: "${reason}". El contrato desplegado no expone dispute_milestone; la apertura on-chain requiere una nueva versión del contrato.`);
  };

  const handleSubmitWork = async (id: number) => {
    const proofHash = await createDescriptionHash(`deliverable:${id}:${new Date().toISOString()}`);
    await submitMilestone({ milestoneId: id, proofHash, ...getSigner() });
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, status: 'Submitted', proofHash } : m
      )
    );
  };

  const handleClaimTimeout = async (id: number) => {
    await claimTimeout({ milestoneId: id, ...getSigner() });
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'Approved' } : m))
    );
  };

  const handleCreateAgreement = async (data: CreateAgreementInput) => {
    const descriptionHash = await createDescriptionHash(`${data.title}:${data.freelancerAddress}`);
    await deposit({
      milestones: [{ amount: data.totalAmount, descriptionHash }],
      ...getSigner(),
    });
  };

  return (
    <div 
      className="min-h-screen bg-surface font-body-md text-on-surface antialiased flex flex-col"
      style={{
        background: 'radial-gradient(circle at 50% 0%, rgba(255, 237, 213, 0.5) 0%, rgba(248, 250, 252, 0.8) 50%, rgb(248, 250, 252) 100%)',
      }}
    >
      {/* Error Toast */}
      {errorToast && (
        <div className="fixed top-20 right-6 z-[100] max-w-sm animate-in slide-in-from-right">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 shadow-lg">
            <span className="material-symbols-outlined text-red-500 text-xl flex-shrink-0">error</span>
            <div className="flex-1">
              <p className="font-label-md text-label-md font-semibold text-red-800">Error de Conexión</p>
              <p className="font-body-sm text-body-sm text-red-700 mt-0.5">{errorToast}</p>
            </div>
            <button onClick={() => setErrorToast(null)} className="text-red-400 hover:text-red-600">
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {successToast && (
        <div className="fixed top-20 right-6 z-[100] max-w-sm">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-200 shadow-lg">
            <span className="material-symbols-outlined text-green-500 text-xl">check_circle</span>
            <p className="font-label-md text-label-md font-semibold text-green-800">{successToast}</p>
            <button onClick={() => setSuccessToast(null)} className="text-green-400 hover:text-green-600 ml-auto">
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        </div>
      )}

      {/* 1. Header Fijo Superior (Web2-First) */}
      <Navbar
        session={session}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onDisconnect={logout}
        onOpenCreateAgreement={() => setIsCreateModalOpen(true)}
      />

      {/* Conditional: Welcome Screen vs Dashboard */}
      {!session.isConnected ? (
        <div className="flex-1 flex flex-col pt-16">
          <WelcomeScreen onOpenAuth={() => setIsAuthModalOpen(true)} />
        </div>
      ) : (
        <>
          {/* 2. Sidebar Lateral Fijo */}
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />

          {/* 3. Contenedor Principal */}
          <div className="md:pl-64 flex-1 flex flex-col pt-16">
            <main className="w-full px-4 sm:px-6 lg:px-space-xl py-space-lg flex flex-col gap-space-lg">
          
          {/* VISTA 1: PANEL PRINCIPAL (ESCROW OVERVIEW) */}
          {activeTab === 'escrow-overview' && (
            <div className="flex flex-col gap-space-lg w-full">
              
              {/* Header del Contrato & Switcher de Perspectiva */}
              <RoleTabs
                currentRole={role}
                onRoleChange={setRole}
                onDownloadLegalPdf={() => alert('Generando informe legal criptográfico auditado en PDF...')}
                onOpenVault={() => alert('Bóveda de Garantía: $85,000 USDC bloqueados en Soroban')}
              />

              {/* 4 Tarjetas KPI Superiores (Brex Metrics) */}
              <ContractMetrics
                totalAmount={85000}
                releasedAmount={25000}
                lockedAmount={60000}
                progressPercent={60}
                milestonesCompleted={3}
                totalMilestones={5}
                antiLockupDays={11}
                counterpartyName="Acme Corp"
                counterpartyTag="Venture Studio Dev"
                counterpartyWallet="GA78...K32P"
              />

              {/* Cuadrícula de 2 Columnas (7 cols Timeline Hitos + 5 cols Entregables & Firmantes) */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
                
                {/* 7 Columnas: Rastreador de Hitos */}
                <div className="xl:col-span-7">
                  <MilestoneStepper
                    role={role}
                    onApprove={handleApproveMilestone}
                    onDispute={handleDisputeMilestone}
                    onSubmitWork={handleSubmitWork}
                    onClaimTimeout={handleClaimTimeout}
                    onOpenDisputeModal={() => setIsDisputeModalOpen(true)}
                  />
                </div>

                {/* 5 Columnas: Entregables + Firmantes Multi-Sig + Eventos */}
                <div className="xl:col-span-5">
                  <DeliverablesPanel />
                </div>

              </div>

            </div>
          )}

          {/* VISTA 2: ACTIVE CONTRACTS */}
          {activeTab === 'active-contracts' && (
            <ActiveContractsView
              onSelectContract={(id) => {
                setActiveTab('escrow-overview');
              }}
              onOpenCreateAgreement={() => setIsCreateModalOpen(true)}
              onOpenDispute={(id) => {
                setIsDisputeModalOpen(true);
              }}
            />
          )}

          {/* VISTA 3: AUDIT & LOGS */}
          {activeTab === 'audit-and-logs' && (
            <AuditLogsView />
          )}

          {/* VISTA 3: CENTRO DE DISPUTAS */}
          {activeTab === 'dispute-center' && (
            <div className="flex flex-col gap-space-md bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-2" style={{ color: '#ea580c' }}>
                <span className="material-symbols-outlined text-2xl">gavel</span>
                <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">
                  Centro de Disputas
                </h2>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                Resolución descentralizada mediante verificación automática de entregables y mediación arbitral.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md pt-2">
                <div className="p-space-md rounded-xl bg-surface-container-low border border-slate-200 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="font-label-sm text-label-sm text-secondary font-bold uppercase">Disputa Activa #4054</span>
                    <h3 className="font-headline-sm font-bold text-on-surface">Integración Oráculo IoT</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Helios Energy S.A. vs. ScaleOps LatAm</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                    <span className="font-code-sm text-code-sm text-outline">Fondos congelados: $125,000 USDC</span>
                    <button 
                      onClick={() => setIsDisputeModalOpen(true)}
                      className="px-3 py-1.5 rounded-lg bg-error-container text-on-error-container font-label-md font-semibold"
                    >
                      Ver Mediación
                    </button>
                  </div>
                </div>

                <div className="p-space-md rounded-xl bg-surface-container-low border border-slate-200 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="font-label-sm text-label-sm font-bold uppercase" style={{ color: '#ea580c' }}>Política de Subsanación</span>
                    <h3 className="font-headline-sm font-bold text-on-surface">Regla del 80% — Prórroga Automática</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Si el avance verificado es &ge; 80%, se conceden 5 días de prórroga antes de penalizaciones.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                    <span className="font-code-sm text-code-sm text-secondary font-semibold">Operativo 100%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* 4. Mobile Bottom Navigation Bar */}
      <nav 
        className="md:hidden fixed bottom-0 w-full z-50 bg-surface-container-lowest/95 backdrop-blur-xl border-t border-slate-200"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.94)', backdropFilter: 'blur(16px)' }}
      >
        <div className="flex justify-around items-center h-16 px-space-xs">
          <button
            type="button"
            onClick={() => setActiveTab('escrow-overview')}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] min-h-[44px] transition-colors ${
              activeTab === 'escrow-overview' ? 'font-bold' : 'text-on-surface-variant hover:text-on-surface'
            }`}
            style={{ color: activeTab === 'escrow-overview' ? '#ea580c' : undefined }}
          >
            <span className="material-symbols-outlined text-[24px]">dashboard</span>
            <span className="font-label-sm text-label-sm">Panel</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('active-contracts')}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] min-h-[44px] transition-colors ${
              activeTab === 'active-contracts' ? 'font-bold' : 'text-on-surface-variant hover:text-on-surface'
            }`}
            style={{ color: activeTab === 'active-contracts' ? '#ea580c' : undefined }}
          >
            <span className="material-symbols-outlined text-[24px]">history_edu</span>
            <span className="font-label-sm text-label-sm">Acuerdos</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dispute-center')}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] min-h-[44px] transition-colors ${
              activeTab === 'dispute-center' ? 'font-bold' : 'text-on-surface-variant hover:text-on-surface'
            }`}
            style={{ color: activeTab === 'dispute-center' ? '#ea580c' : undefined }}
          >
            <span className="material-symbols-outlined text-[24px]">gavel</span>
            <span className="font-label-sm text-label-sm">Disputas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('audit-and-logs')}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] min-h-[44px] transition-colors ${
              activeTab === 'audit-and-logs' ? 'font-bold' : 'text-on-surface-variant hover:text-on-surface'
            }`}
            style={{ color: activeTab === 'audit-and-logs' ? '#ea580c' : undefined }}
          >
            <span className="material-symbols-outlined text-[24px]">receipt_long</span>
            <span className="font-label-sm text-label-sm">Actividad</span>
          </button>
        </div>
      </nav>
        </>
      )}

      {/* 5. Modales Funcionales */}
      <CavosAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onConnect={handleConnect}
      />

      <CreateAgreementModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateAgreement}
      />

      <DisputeModal
        isOpen={isDisputeModalOpen}
        onClose={() => setIsDisputeModalOpen(false)}
        onConfirm={handleConfirmDispute}
        milestoneId={3}
        milestoneTitle="Hito 3: Despliegue en Staging & Pruebas End-to-End"
        amount={25000}
      />

    </div>
  );
};

export default App;
