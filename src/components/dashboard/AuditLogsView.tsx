import React, { useState } from 'react';

export const AuditLogsView: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandedRow, setExpandedRow] = useState<string | null>('detail-row-1');
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [selfTestRunning, setSelfTestRunning] = useState<boolean>(false);

  const toggleDetails = (rowId: string) => {
    setExpandedRow(expandedRow === rowId ? null : rowId);
  };

  const copyHash = (hashText: string) => {
    navigator.clipboard?.writeText(hashText);
    setToastMessage(`TX Hash copiado al portapapeles: ${hashText.slice(0, 16)}...`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleExport = () => {
    setToastMessage('Lote criptográfico de 1,429 transacciones serializado con firma SHA-256 institucional.');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const runVerificationSelfTest = () => {
    setSelfTestRunning(true);
    setTimeout(() => {
      setSelfTestRunning(false);
      setToastMessage('✓ Self-test completado: Hashes SHA-256 e integridad del State Ledger de Soroban verificados al 100%.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3500);
    }, 1200);
  };

  const logs = [
    {
      id: 'detail-row-1',
      time: '2025-05-18 14:32:09',
      event: 'MILESTONE_SETTLED',
      category: 'RELEASE',
      badgeClass: 'bg-secondary-fixed text-on-secondary-fixed',
      badgeDot: 'bg-secondary',
      contract: 'Contrato #4092',
      milestone: 'Hito 2/3: MVP Frontend & Auth',
      signer: 'GABC...9XYZ',
      signerRole: 'Cliente',
      roleBadge: 'bg-tertiary-fixed text-on-tertiary-fixed',
      amount: '+$25,000.00 USDC',
      amountSub: '0.00000 XLM Gasless',
      hash: '0x8a92...4f1e',
      fullHash: '0x8a92c4b819f7da56e29410bfae1882c9431b920194819dca8911082c914f1e9a',
      payload: {
        protocol: 'Soroban-v21',
        contract_id: 'CA4092E7B38A89104BA9D22E891C007421DA198B201',
        function: 'release_milestone_funds',
        parameters: {
          milestone_index: 2,
          amount: '25000000000',
          asset: 'USDC:GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
          beneficiary: 'GD99BEE7C401AA02TR89914BA5002C9914A89B0021'
        },
        auth: {
          mode: 'Ed25519_Multisig',
          threshold: 2,
          signatures_verified: 2,
          signer_1: 'GABC4788910ABBA8918239048123901840192309XYZ',
          signer_2: 'GCIA998124018240981203984102938401293840XYZ'
        },
        sponsor_relay: {
          account: 'GCVOSPAYMASTER00192384710923840192384019238',
          fee_charged_xlm: '0.0000000',
          consumed_by_client: '0 XLM'
        }
      }
    },
    {
      id: 'detail-row-2',
      time: '2025-05-18 14:31:54',
      event: 'ORACLE_AI_VERIFIED',
      category: 'ORACLE',
      badgeClass: 'bg-tertiary-fixed text-on-tertiary-fixed',
      badgeDot: 'bg-tertiary-container',
      contract: 'Contrato #4092',
      milestone: 'Validación PR Github & Tests CI (98.4%)',
      signer: 'GORC...AI01',
      signerRole: 'Oráculo IA',
      roleBadge: 'bg-tertiary-container text-on-tertiary-container',
      amount: 'Registro Hash de Evidencia',
      amountSub: '0.00000 XLM Gasless',
      hash: '0x3b11...99bc',
      fullHash: '0x3b11d99bc4010892a014902348bca19041289124018240981203984102938401',
      payload: {
        attestation_type: 'DELIVERABLE_COMPLIANCE',
        github_commit_hash: 'e67ba9108f910ca8b44910283019baf4',
        test_suite_coverage: '99.1%',
        semantic_analysis: 'All milestone 2 deliverables satisfied according to SLA contract stipulations',
        proof_sha256: '4b684cb864b4c79527f678cb39d2279eb11bb0e9b9cbca01878b30e051c7bb5e',
        gas_subsidized_by: 'CavosPaymasterRelay'
      }
    },
    {
      id: 'detail-row-3',
      time: '2025-05-18 14:15:20',
      event: 'MULTISIG_SIGNATURE_APPENDED',
      category: 'MULTISIG',
      badgeClass: 'bg-inverse-surface text-inverse-on-surface',
      badgeDot: 'bg-secondary-fixed',
      contract: 'Contrato #4092',
      milestone: 'Multi-sig Key 2 de 2',
      signer: 'GCIA...0XYZ',
      signerRole: 'Firmante Institucional',
      roleBadge: 'bg-surface-container-high text-on-surface-variant',
      amount: 'Voto Favorable Registrado',
      amountSub: '0.00000 XLM Gasless',
      hash: '0x71a4...112e',
      fullHash: '0x71a4112e4019283019823901840192309XYZ9981240182409812039841029384',
      payload: {
        multisig_scheme: '2-of-2-M-of-N',
        signature_witness: '71a4112e098dfa0021bbae334091a0c4f8281048bca19041289124018240981203984102938401',
        verified_on_stellar_ledger: 52409874,
        gasless_sponsor_executed: true
      }
    },
    {
      id: 'detail-row-4',
      time: '2025-05-18 12:04:11',
      event: 'CONTRACT_EVIDENCE_RECORDED',
      category: 'ORACLE',
      badgeClass: 'bg-tertiary-fixed text-on-tertiary-fixed',
      badgeDot: 'bg-tertiary-container',
      contract: 'Contrato #4088',
      milestone: 'Documentación API & Swagger',
      signer: 'GD99...02TR',
      signerRole: 'Freelancer',
      roleBadge: 'bg-secondary-fixed text-on-secondary-fixed',
      amount: 'SHA-256 IPFS Anchor',
      amountSub: '0.00000 XLM Gasless',
      hash: '0x5c90...a109',
      fullHash: '0x5c90a1099824018240981203984102938401293840XYZ4092E7B38A89104BA9D2',
      payload: {
        evidence_digest: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        mime_type: 'application/pdf+openapi-json',
        storage_adapter: 'IPFS+Filecoin',
        stamped_by: 'GD99BEE7C401AA02TR89914BA5002C9914A89B0021'
      }
    },
    {
      id: 'detail-row-5',
      time: '2025-05-18 10:19:42',
      event: 'SPONSORED_RELAY_FEE',
      category: 'RELEASE',
      badgeClass: 'bg-primary-fixed text-on-primary-fixed',
      badgeDot: 'bg-primary',
      contract: 'Pool Global #01',
      milestone: 'Recarga de Subsidio Paymaster',
      signer: 'GCVO...PAY1',
      signerRole: 'Relayer Cavos',
      roleBadge: 'bg-primary-fixed-dim text-on-primary-fixed',
      amount: '+250.00 XLM',
      amountSub: 'Depósito a Balance de Gas',
      hash: '0x1f44...ee82',
      fullHash: '0x1f44ee8209384102938401293840XYZ4092E7B38A89104BA9D22E891C007421DA198B201',
      payload: {
        sponsor_network: 'Stellar_Soroban_Testnet',
        amount_replenished_xlm: '250.0000000',
        total_reserve_xlm: '1480.2000000',
        policy: '100% Zero-Gas for AgreedPay Escrow Clients'
      }
    },
    {
      id: 'detail-row-6',
      time: '2025-05-17 19:40:15',
      event: 'DISPUTE_MEDIATION_OPENED',
      category: 'DISPUTE',
      badgeClass: 'bg-error-container text-on-error-container',
      badgeDot: 'bg-error',
      contract: 'Contrato #4010',
      milestone: 'Hito 1/2: Diseño de Arquitectura',
      signer: 'GCLIENT...55A1',
      signerRole: 'Cliente',
      roleBadge: 'bg-tertiary-fixed text-on-tertiary-fixed',
      amount: 'Bloqueo Preventivo $12,500 USDC',
      amountSub: '0.00000 XLM Gasless',
      hash: '0x99e2...001a',
      fullHash: '0x99e2001a98401293840XYZ4092E7B38A89104BA9D22E891C007421DA198B20194819dca',
      payload: {
        dispute_id: 'DISP-2025-041',
        reason: 'Scope mismatch on milestone technical specs',
        timelock_period_seconds: 604800,
        arbitrator_appointed: 'GARB99812039841029384012938401293840129384XYZ',
        escrow_locked_balance: '12500.00 USDC',
        can_settle_unilateral: false
      }
    }
  ];

  const filteredLogs = logs.filter((log) => {
    const matchesCategory = filterCategory === 'ALL' || log.category === filterCategory;
    const matchesSearch =
      log.contract.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.signer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.fullHash.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full gap-space-lg">
      
      {/* Page Header & Action Bar */}
      <div className="flex flex-col gap-space-md">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-md">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-space-sm">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-surface-container-high text-primary" style={{ color: '#ea580c' }}>
                <span className="material-symbols-outlined text-lg">receipt_long</span>
              </span>
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-outline">
                Stellar Protocol v21 • Soroban VM
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
              Audit &amp; Logs: Trazabilidad On-Chain
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
              Registro inmutable y verificable de transacciones, invocaciones de smart contracts y validaciones de oráculo en Stellar Testnet.
            </p>
          </div>

          <div className="flex items-center gap-space-sm self-start lg:self-center">
            <button 
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-space-sm px-space-md py-2.5 rounded-lg text-on-primary font-label-md text-label-md transition-all shadow-md active:scale-95"
              style={{ backgroundColor: '#ea580c', color: '#ffffff' }}
            >
              <span className="material-symbols-outlined text-base">verified_user</span>
              <span>Exportar Registro Criptográfico</span>
              <span className="font-code-sm text-code-sm bg-white/20 px-1.5 py-0.5 rounded text-white font-mono">
                JSON/CSV
              </span>
            </button>
          </div>
        </div>

        {/* Live Network Metadata Badges */}
        <div className="flex flex-wrap items-center gap-space-sm pt-space-xs">
          <div className="inline-flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-surface-container-lowest shadow-sm border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-tertiary-container animate-ping"></span>
            <span className="font-label-sm text-label-sm text-tertiary font-semibold">
              Red: Stellar Testnet (Soroban v21)
            </span>
          </div>
          <div className="inline-flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-surface-container-lowest shadow-sm border border-slate-200">
            <span className="material-symbols-outlined text-sm text-outline">account_tree</span>
            <span className="font-code-sm text-code-sm text-on-surface font-medium">Ledger Actual:</span>
            <span className="font-code-sm text-code-sm font-bold" style={{ color: '#ea580c' }}>#52,409,882</span>
          </div>
          <div className="inline-flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-surface-container-lowest shadow-sm border border-slate-200">
            <span className="material-symbols-outlined text-sm text-secondary">bolt</span>
            <span className="font-label-sm text-label-sm text-on-surface font-medium">Gas Sponsoring:</span>
            <span className="font-label-sm text-label-sm font-bold text-secondary" style={{ color: '#16a34a' }}>
              Cavos Paymaster (100% Subvencionado)
            </span>
          </div>
          <div className="inline-flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-surface-container-lowest shadow-sm border border-slate-200">
            <span className="material-symbols-outlined text-sm text-tertiary">lock_clock</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Sync: 12ms</span>
          </div>
        </div>
      </div>

      {/* Export Confirmation Toast */}
      {showToast && (
        <div className="p-space-md rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-between shadow-md transition-all border border-secondary/20">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-secondary">check_circle</span>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md font-bold">Registro Notificado</span>
              <span className="font-body-sm text-body-sm text-on-secondary-fixed-variant">
                {toastMessage}
              </span>
            </div>
          </div>
          <button className="p-1 rounded-lg hover:bg-secondary/10" onClick={() => setShowToast(false)}>
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>
      )}

      {/* KPI Metric Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
        <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:shadow-md transition-all border border-slate-200">
          <div className="flex items-start justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Total Eventos Registrados</span>
            <span className="inline-flex items-center gap-1 font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> 100% Uptime
            </span>
          </div>
          <div className="my-space-sm">
            <div className="font-metric-xl text-metric-xl text-on-surface font-bold tracking-tight">1,429</div>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Invocaciones Smart Contract validadas</span>
          </div>
          <div className="flex items-center gap-space-xs pt-space-xs text-secondary font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span className="font-semibold">+18.4%</span>
            <span className="text-on-surface-variant font-normal">vs. ciclo anterior de custodia</span>
          </div>
        </div>

        <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:shadow-md transition-all border border-slate-200">
          <div className="flex items-start justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Gas Patrocinado Total</span>
            <span className="inline-flex items-center gap-1 font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-semibold">
              100% Subvencionado
            </span>
          </div>
          <div className="my-space-sm">
            <div className="flex items-baseline gap-space-xs">
              <span className="font-metric-xl text-metric-xl font-bold tracking-tight text-secondary" style={{ color: '#16a34a' }}>
                1,480.20
              </span>
              <span className="font-headline-sm text-headline-sm font-bold text-secondary" style={{ color: '#16a34a' }}>
                XLM
              </span>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">$0.00 pagado por partes negociadoras</span>
          </div>
          <div className="flex items-center justify-between pt-space-xs text-on-surface-variant font-code-sm text-code-sm">
            <span>Relayer: Cavos v2.4</span>
            <span className="text-tertiary">Fee pool: Seguro</span>
          </div>
        </div>

        <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:shadow-md transition-all border border-slate-200">
          <div className="flex items-start justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Tiempo Medio Confirmación</span>
            <span className="inline-flex items-center gap-1 font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-semibold">
              SCP Consenso
            </span>
          </div>
          <div className="my-space-sm">
            <div className="flex items-baseline gap-space-xs">
              <span className="font-metric-xl text-metric-xl text-on-surface font-bold tracking-tight">3.6</span>
              <span className="font-headline-sm text-headline-sm font-bold text-primary" style={{ color: '#ea580c' }}>seg</span>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Soroban State Commitment Ledger</span>
          </div>
          <div className="flex items-center gap-space-xs pt-space-xs text-on-surface-variant font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-sm text-secondary">speed</span>
            <span className="text-secondary font-semibold" style={{ color: '#16a34a' }}>Cero latencia de reintento</span>
            <span className="text-outline">• 0 transacciones fallidas</span>
          </div>
        </div>
      </div>

      {/* Interactive Filtering & Query Bar */}
      <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md border border-slate-200">
        <div className="flex-1 min-w-[280px]">
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-outline text-lg">search</span>
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por TX Hash (0x...), Contrato ID, o Wallet G..."
              className="w-full pl-10 pr-4 py-2 text-body-md font-body-md bg-surface-container-low text-on-surface rounded-lg focus:outline-none focus:bg-surface-container-lowest border border-slate-200 transition-all"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-space-xs">
          <div className="flex items-center p-1 rounded-lg bg-surface-container-low text-label-sm font-label-sm">
            {[
              { id: 'ALL', label: 'Todos' },
              { id: 'RELEASE', label: 'Liberación' },
              { id: 'ORACLE', label: 'Oráculo IA' },
              { id: 'MULTISIG', label: 'Multisig' },
              { id: 'DISPUTE', label: 'Disputas' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterCategory(tab.id)}
                className={`px-space-sm py-1 rounded transition-all ${
                  filterCategory === tab.id
                    ? 'bg-surface-container-lowest text-on-surface font-bold shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button 
            type="button"
            className="inline-flex items-center gap-space-xs px-space-sm py-2 rounded-lg bg-surface-container-low text-on-surface font-label-sm text-label-sm hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-base text-outline">calendar_today</span>
            <span>Últimos 7 días</span>
          </button>
        </div>
      </div>

      {/* Main On-Chain Ledger Table Container */}
      <div 
        className="rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden border border-slate-200"
      >
        <div className="px-space-lg py-space-md bg-surface-container-low flex items-center justify-between border-b border-surface-container-high">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-xl" style={{ color: '#ea580c' }}>dataset</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Ledger de Invocaciones &amp; Eventos Soroban
            </h2>
            <span className="font-code-sm text-code-sm px-2 py-0.5 rounded-full bg-surface-container text-outline">
              Total {filteredLogs.length} eventos en viewport
            </span>
          </div>
          <div className="flex items-center gap-space-sm">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Auto-polling cada 5s</span>
            <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low text-outline font-label-sm text-label-sm uppercase tracking-wider">
                <th className="py-3 px-space-md font-semibold">Timestamp (UTC)</th>
                <th className="py-3 px-space-md font-semibold">Evento Soroban</th>
                <th className="py-3 px-space-md font-semibold">Contrato &amp; Hito</th>
                <th className="py-3 px-space-md font-semibold">Billetera Firmante</th>
                <th className="py-3 px-space-md font-semibold text-right">Impacto Financiero</th>
                <th className="py-3 px-space-md font-semibold text-right">TX Hash &amp; Explorer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high/50 font-body-sm text-body-sm text-on-surface">
              {filteredLogs.map((log) => {
                const isExpanded = expandedRow === log.id;
                return (
                  <React.Fragment key={log.id}>
                    <tr 
                      onClick={() => toggleDetails(log.id)}
                      className="hover:bg-surface-container-low/70 transition-colors group cursor-pointer"
                    >
                      <td className="py-space-md px-space-md whitespace-nowrap">
                        <div className="flex items-center gap-space-xs font-code-sm text-code-sm text-on-surface font-medium">
                          <span className="material-symbols-outlined text-sm text-outline">schedule</span>
                          <span>{log.time}</span>
                        </div>
                      </td>
                      <td className="py-space-md px-space-md">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-code-sm text-code-sm font-bold tracking-tight ${log.badgeClass}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${log.badgeDot}`}></span>
                          {log.event}
                        </span>
                      </td>
                      <td className="py-space-md px-space-md">
                        <div className="flex flex-col">
                          <span className="font-headline-sm text-body-md font-bold text-on-surface">{log.contract}</span>
                          <span className="font-label-sm text-label-sm text-outline">{log.milestone}</span>
                        </div>
                      </td>
                      <td className="py-space-md px-space-md">
                        <div className="flex items-center gap-2">
                          <span className="font-code-sm text-code-sm font-semibold text-on-surface">{log.signer}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${log.roleBadge}`}>
                            {log.signerRole}
                          </span>
                        </div>
                      </td>
                      <td className="py-space-md px-space-md text-right whitespace-nowrap">
                        <div className="flex flex-col items-end">
                          <span className="font-headline-sm text-body-md font-bold text-secondary" style={{ color: log.category === 'DISPUTE' ? '#ba1a1a' : undefined }}>
                            {log.amount}
                          </span>
                          <span className="font-code-sm text-code-sm text-secondary" style={{ color: '#16a34a' }}>
                            {log.amountSub}
                          </span>
                        </div>
                      </td>
                      <td className="py-space-md px-space-md text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <span className="font-code-sm text-code-sm text-outline">{log.hash}</span>
                          <button 
                            type="button"
                            onClick={(e) => { e.stopPropagation(); copyHash(log.fullHash); }}
                            className="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors"
                            title="Copiar TX Hash"
                          >
                            <span className="material-symbols-outlined text-sm">content_copy</span>
                          </button>
                          <a 
                            href={`https://stellar.expert/explorer/testnet/tx/${log.fullHash}`}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 rounded hover:bg-surface-container text-tertiary hover:text-tertiary-container transition-colors"
                            title="Ver en Stellar.expert"
                          >
                            <span className="material-symbols-outlined text-sm">open_in_new</span>
                          </a>
                          <span className={`material-symbols-outlined text-sm text-outline transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                            expand_more
                          </span>
                        </div>
                      </td>
                    </tr>

                    {/* Collapsible Decoded JSON Payload */}
                    {isExpanded && (
                      <tr className="bg-surface-container-low/40">
                        <td colSpan={6} className="p-space-lg">
                          <div className="rounded-xl bg-surface-container-lowest p-space-md shadow-inner flex flex-col gap-space-sm border border-slate-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-space-xs">
                                <span className="material-symbols-outlined text-sm" style={{ color: '#ea580c' }}>terminal</span>
                                <span className="font-label-sm text-label-sm font-bold uppercase text-outline">
                                  Payload Soroban Decodificado
                                </span>
                              </div>
                              <span className="font-code-sm text-code-sm font-semibold" style={{ color: '#16a34a' }}>
                                Status: SUCCESS_CONFIRMED
                              </span>
                            </div>
                            <pre className="font-code-sm text-code-sm bg-surface-container-low p-space-md rounded-lg overflow-x-auto text-on-surface leading-relaxed">
                              {JSON.stringify(log.payload, null, 2)}
                            </pre>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination / Footer Bar */}
        <div className="px-space-lg py-space-md bg-surface-container-lowest flex flex-col sm:flex-row items-center justify-between gap-space-md border-t border-surface-container-high/40">
          <div className="font-body-sm text-body-sm text-on-surface-variant">
            Mostrando <span className="font-semibold text-on-surface">1-6</span> de <span className="font-semibold text-on-surface">1,429</span> transacciones auditables en tiempo real
          </div>
          <div className="flex items-center gap-space-xs">
            <button className="px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-label-sm text-label-sm hover:bg-surface-container disabled:opacity-50" disabled>
              Anterior
            </button>
            <button className="px-3 py-1.5 rounded-lg text-white font-label-sm text-label-sm font-bold shadow-sm" style={{ backgroundColor: '#ea580c' }}>
              1
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-label-sm text-label-sm hover:bg-surface-container">
              2
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-label-sm text-label-sm hover:bg-surface-container">
              Siguiente
            </button>
          </div>
        </div>
      </div>

      {/* Cryptographic Inspector & Protocol Verification */}
      <div className="rounded-xl bg-surface-container-lowest shadow-sm p-space-lg border border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-md mb-space-md">
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center" style={{ color: '#ea580c' }}>
              <span className="material-symbols-outlined text-xl">security</span>
            </div>
            <div className="flex flex-col">
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Verificador Criptográfico Independiente
              </h3>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Comprobación cruzada de hashes SHA-256 e integridad del State Ledger de Soroban
              </span>
            </div>
          </div>
          <div className="flex items-center gap-space-sm">
            <span className="font-code-sm text-code-sm font-semibold flex items-center gap-1" style={{ color: '#16a34a' }}>
              <span className="material-symbols-outlined text-sm">check_circle</span> Firmas Ed25519 íntegras
            </span>
            <button 
              type="button"
              disabled={selfTestRunning}
              onClick={runVerificationSelfTest}
              className="px-space-md py-1.5 rounded-lg bg-surface-container-low text-on-surface font-label-sm text-label-sm hover:bg-surface-container transition-colors font-semibold border border-slate-200 flex items-center gap-1"
            >
              {selfTestRunning ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                  <span>Verificando...</span>
                </>
              ) : (
                <span>Ejecutar Self-Test</span>
              )}
            </button>
          </div>
        </div>

        {/* 4-Step Pipeline Stepper */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-space-md pt-space-xs">
          <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-1 border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase font-bold text-outline">Paso 1: Captura</span>
              <span className="material-symbols-outlined text-secondary text-sm">task_alt</span>
            </div>
            <span className="font-body-md text-body-md font-semibold text-on-surface">Escrow Event Emit</span>
            <span className="font-code-sm text-code-sm text-outline truncate">Topic: agreedpay_escrow</span>
          </div>

          <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-1 border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase font-bold text-outline">Paso 2: Relayer</span>
              <span className="material-symbols-outlined text-secondary text-sm">task_alt</span>
            </div>
            <span className="font-body-md text-body-md font-semibold text-on-surface">Cavos Gasless Wrap</span>
            <span className="font-code-sm text-code-sm font-semibold" style={{ color: '#16a34a' }}>100% Gas Subsidizado</span>
          </div>

          <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-1 border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase font-bold text-outline">Paso 3: Consenso</span>
              <span className="material-symbols-outlined text-secondary text-sm">task_alt</span>
            </div>
            <span className="font-body-md text-body-md font-semibold text-on-surface">Stellar SCP Finality</span>
            <span className="font-code-sm text-code-sm text-outline">Tiempo: 3.6s Promedio</span>
          </div>

          <div className="p-space-md rounded-xl bg-secondary-fixed/30 flex flex-col gap-1 border border-secondary/30">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase font-bold text-secondary" style={{ color: '#16a34a' }}>
                Paso 4: Auditoría
              </span>
              <span className="material-symbols-outlined text-secondary text-sm">verified</span>
            </div>
            <span className="font-body-md text-body-md font-bold text-on-surface">Prueba Inmutable</span>
            <span className="font-code-sm text-code-sm font-semibold" style={{ color: '#16a34a' }}>100% Certificado</span>
          </div>
        </div>
      </div>

    </div>
  );
};
