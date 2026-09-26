# AgreedPay 🛡️⚡
> **Plataforma de custodia y pagos por hitos, tokenizando contratos de servicios B2B como Real-World Assets sobre Stellar & Soroban**
> *Track 03: Real-World Assets & Compliant Rails*

**Demo en vivo:** [agreedpay.vercel.app](https://agreedpay.vercel.app) · **Contrato en Testnet:** [`CCS46B4E…FD24DN`](https://stellar.expert/explorer/testnet/contract/CCS46B4ENVJLAKUVGPIUZOLL4YLLAP5ZGCSTOGDFEAAYM6IRN5FD24DN) · **Pitch:** [guion de 2 min](docs/PITCH.md)

---

## 👥 Equipo de Desarrollo

- **Angelo Goitia**
- **Santiago Rodríguez**
- **Jack Jimenes**
- **Elizabeth Coronado**

---

## 🎯 El Problema

El mercado de exportación de servicios profesionales y talento tecnológico desde LatAm hacia clientes globales enfrenta tres barreras operativas críticas:

- **Fricción financiera:** las transferencias interbancarias vía SWIFT imponen comisiones y tipos de cambio desfavorables que consumen entre **5% y 10%** del valor del contrato.
- **Liquidación lenta:** entre **3 y 7 días hábiles** para compensar fondos, agravado por retenciones tributarias y trabas cambiarias locales.
- **Riesgo de contraparte:** el freelancer entrega sin garantía de cobro y el cliente paga sin garantía de entrega. Sin custodia real, todo depende de confianza ciega — y cuando algo sale mal, resolverlo por vía legal cuesta más que el propio hito en disputa.

## 💡 La Solución

**AgreedPay** transforma un contrato de servicios (SOW / SLA) en un **activo del mundo real (RWA) tokenizado**: un contrato inteligente en **Soroban** hace de custodio y árbitro imparcial, sin abogados ni intermediarios.

1. El acuerdo off-chain se vincula al ledger mediante el **hash SHA-256** de sus especificaciones y criterios de aceptación.
2. El pago se bloquea de forma no custodial, segregado por cada **hito** pactado.
3. Cada hito se liquida de forma atómica y transparente al cumplirse su condición — sin intermediarios que retengan fondos.

Reglas de negocio que hacen el sistema justo para ambas partes:

| Mecanismo | Qué resuelve |
| :--- | :--- |
| **Anti-lockup (14 días)** | Si el cliente desaparece o no revisa, el freelancer reclama el pago automáticamente (`claim_timeout`). Nadie queda atrapado. |
| **Umbral de avance 80% + prórroga IA** | Con avance verificado ≥80%, un agente árbitro otorga 5 días de prórroga (`grant_revision_extension`) antes de cualquier penalización. |
| **Arbitraje objetivo** | Ante incumplimiento crítico (<80%), el árbitro puede reembolsar el 100% al cliente (`resolve_dispute`) sin proceso legal. |
| **Onboarding sin fricción** | Login con Google/Apple/Passkeys y trustlines patrocinadas vía Cavos Relayer — se puede operar con **0 XLM** iniciales. |

---

## 🏗️ Arquitectura Técnica

```
┌─────────────────────────┐      ┌──────────────────────────┐      ┌───────────────────────────┐
│   Frontend (React/Vite)  │ ───► │   Soroban RPC (testnet)   │ ───► │  Contrato escrow_milestones │
│  Freighter / Wallets Kit │      │  getLedgerEntries (lectura)│      │        (Rust, #![no_std])   │
│  Cavos (gasless, opcional)│ ◄── │  simulate/send Tx (escritura)│ ◄── │   SAC token (USDC / XLM)    │
└─────────────────────────┘      └──────────────────────────┘      └───────────────────────────┘
```

- **Contrato on-chain** (`contracts/escrow_milestones`): Rust + `soroban-sdk`, `#![no_std]`, **7.167 KB** optimizado. Custodia los fondos bajo su propia dirección de contrato; ningún administrador puede moverlos fuera de las transiciones de estado autorizadas. Aritmética en enteros de 128 bits (`i128`), sin pérdidas por redondeo.
- **Token de custodia:** cualquier Stellar Asset Contract (SAC) — en producción, USDC oficial de Circle/Centre en Stellar (7 decimales); la instancia de demo usa el SAC nativo de XLM para no depender de faucets externos durante la grabación.
- **Frontend:** React 19 + Vite, lee el estado **directamente de la blockchain** con `getLedgerEntries` (sin depender de Horizon API), con polling automático para refrescar el Dashboard.
- **Billeteras:** soporte dual nativo — `@stellar/freighter-api` / `@creit-tech/stellar-wallets-kit` para usuarios Web3, y `@cavos/kit` para onboarding gasless (Web2-first).
- **Máquina de estados de cada hito:**

  ```
  Pending ──submit_milestone──► Submitted ──approve_milestone──► Approved
                                     │
                                     ├──grant_revision_extension──► RevisionRequired
                                     └──resolve_dispute / claim_timeout──► TimedOut
  ```

Documentación técnica extendida: [docs/architecture.md](docs/architecture.md) (diagramas de topología y flujos completos) y [docs/audit_report.md](docs/audit_report.md).

---

## 🚀 Cómo Ejecutar el Proyecto

### Requisitos previos
- Node.js 18+ y npm
- [Freighter Wallet](https://freighter.app) instalada en el navegador (para firmar transacciones)
- (Opcional, solo para tocar el contrato) [Stellar CLI](https://developers.stellar.org/docs/tools/developer-tools/cli) y Rust con target `wasm32-unknown-unknown`

### 1. Clonar e instalar dependencias
```bash
git clone https://github.com/elizacl/AgreedPay.git
cd AgreedPay
npm install
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env.local
# Edita .env.local si vas a apuntar a tu propia instancia del contrato
```
Como mínimo necesitas `VITE_ESCROW_CONTRACT_ID`, `VITE_USDC_SAC_CONTRACT_ID` (o el SAC del token que uses) y `VITE_STELLAR_RPC_URL` (por defecto, el RPC público de testnet).

### 3. Levantar el frontend en desarrollo
```bash
npm run dev
# http://localhost:5173
```
Conecta Freighter (red **Testnet**) desde el botón de la barra superior y fondea la cuenta con [friendbot](https://friendbot.stellar.org) si es una cuenta nueva.

### 4. Compilar para producción
```bash
npm run build      # tsc + vite build → carpeta dist/
npm run preview    # sirve el build localmente
```

### 5. (Opcional) Trabajar sobre el contrato Soroban
```bash
cd contracts/escrow_milestones
cargo test -p escrow_milestones -- --nocapture   # suite de pruebas unitarias
stellar contract build                            # compila el .wasm
cargo scout-audit -v                               # auditoría estática de seguridad
```

### 6. Desplegar el frontend (Vercel)
```bash
npx vercel deploy --prod \
  -b VITE_ESCROW_CONTRACT_ID=... \
  -b VITE_USDC_SAC_CONTRACT_ID=... \
  # ...resto de variables de .env.local
```

---

## 🌐 Despliegues

| Entorno | Detalle |
| :--- | :--- |
| **Frontend (Vercel)** | [agreedpay.vercel.app](https://agreedpay.vercel.app) |
| **Contrato — instancia de demo** | [`CCS46B4ENVJLAKUVGPIUZOLL4YLLAP5ZGCSTOGDFEAAYM6IRN5FD24DN`](https://stellar.expert/explorer/testnet/contract/CCS46B4ENVJLAKUVGPIUZOLL4YLLAP5ZGCSTOGDFEAAYM6IRN5FD24DN) — mismo WASM auditado, token de custodia = SAC nativo de XLM (para demo sin depender de faucets de USDC de terceros) |
| **Contrato — despliegue original auditado** | [`CD6QQHMFJKOJYXNFIHSRWQTATG5AW22L6FHPFM76Y4Q2EUBFAOO563QR`](https://stellar.expert/explorer/testnet/contract/CD6QQHMFJKOJYXNFIHSRWQTATG5AW22L6FHPFM76Y4Q2EUBFAOO563QR) — token de custodia = SAC USDC oficial (Circle/Centre) en Testnet. Detalle completo en [DEPLOYMENT.md](DEPLOYMENT.md) |
| **Red** | Stellar Testnet (`Test SDF Network ; September 2015`), Protocol 22 |
| **Auditoría de seguridad** | [docs/audit_report.md](docs/audit_report.md) — **0 vulnerabilidades / 36 detectores** (Scout Audit v0.3.16) |

---

## 📦 Guía de Integración y Conexión Web3

### Variables de entorno (`.env.example` / `.env.local`)
```env
VITE_ESCROW_CONTRACT_ID=<contract-id-del-escrow>
VITE_USDC_SAC_CONTRACT_ID=<sac-del-token-de-custodia>
VITE_STELLAR_NETWORK=TESTNET
VITE_STELLAR_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
VITE_STELLAR_RPC_URL="https://soroban-testnet.stellar.org"
```

### Generación de bindings TypeScript
```bash
stellar contract bindings typescript \
  --network testnet \
  --contract-id <CONTRACT_ID> \
  --output-dir src/contracts/agreedpay
```

### Métodos on-chain

| Función | Invocador autorizado | Parámetros | Descripción |
| :--- | :---: | :--- | :--- |
| `deposit_and_create_milestones` | **Cliente** | `amounts: Vec<i128>`, `hashes: Vec<String>` | Fondea el escrow y divide el acuerdo en hitos inmutables. |
| `submit_milestone` | **Freelancer** | `milestone_id: u32`, `proof_hash: String` | Registra el hash SHA-256 del entregable; marca el hito como `Submitted`. |
| `approve_milestone` | **Cliente** | `milestone_id: u32` | Aprueba la entrega y libera el 100% de los fondos del hito. |
| `claim_timeout` | **Freelancer** | `milestone_id: u32` | Anti-lockup: reclamo tras 14 días de inactividad del cliente. |
| `grant_revision_extension` | **Agente IA / Árbitro** | `milestone_id: u32`, `extension_seconds: u64` | Otorga prórroga de 5 días, hito pasa a `RevisionRequired`. |
| `resolve_dispute` | **Agente IA / Árbitro** | `milestone_id: u32`, `release_to_freelancer: bool` | Resolución final: fondos al freelancer o reembolso al cliente. |

### Hooks reactivos del frontend (`src/hooks/`)

| Hook | Acción on-chain |
| :--- | :--- |
| `useDeposit` | Bloquea fondos y crea los hitos. |
| `useSubmitMilestone` | El freelancer envía el hash SHA-256 del entregable. |
| `useApproveMilestone` | El cliente aprueba y libera el pago. |
| `useClaimTimeout` | Reclamo anti-lockup tras 14 días. |
| `useGrantRevisionExtension` | Prórroga de 5 días otorgada por el árbitro. |
| `useEscrowContractState` | Lectura reactiva del contrato (config, hitos, balances) vía `getLedgerEntries`, con auto-polling — alimenta el Dashboard con datos 100% on-chain. |

---

## 🧱 Qué se construyó durante la ventana del evento

**Día 1 (22–23 sep):** contrato `escrow_milestones` en Rust/Soroban (máquina de estados de hitos, custodia SAC, anti-lockup, prórroga IA), primer despliegue en Testnet, documento maestro de arquitectura con diagramas de topología y flujos.

**Día 2 (24 sep):** suite de pruebas unitarias del contrato, auditoría de seguridad estática con Scout Audit (**0 hallazgos críticos/medios/menores sobre 36 detectores**), documentación de despliegue.

**Día 3 (25 sep):**
- Integración del diseño de producto (Google Stitch) en el Dashboard, modales y vistas de rol (cliente/freelancer).
- Capa Web3 completa: hooks de React para cada método del contrato, cliente Soroban RPC con mitigación de `tx_bad_seq`/`tx_too_late`, soporte dual Freighter + Stellar Wallets Kit, e integración de Cavos Kit para escrow gasless.
- **Cableado del Dashboard a datos reales:** el panel mostraba hitos y montos *hardcodeados*; se conectó `useEscrowContractState` end-to-end para que cada tarjeta, hito y balance se lea en vivo del contrato vía `getLedgerEntries` — cero datos simulados.
- **Población de la instancia de demo con transacciones reales en Testnet:** nuevo despliegue del contrato, cuentas de freelancer/árbitro generadas y fondeadas, y un flujo completo ejecutado on-chain cubriendo los estados `Submitted`, `RevisionRequired` y `TimedOut`, dejando un hito en `Submitted` para aprobación en vivo durante la demo grabada.
- Identidad visual (logo) integrada en la web y en el material de pitch.
- Despliegue del frontend en Vercel (`agreedpay.vercel.app`) y guion de pitch de 2 minutos sincronizado con la demo en vivo.

---

## 📚 Documentación Técnica Adicional

- [Diagramas de Arquitectura y Flujos (docs/architecture.md)](docs/architecture.md)
- [Registro de Despliegue en Testnet (DEPLOYMENT.md)](DEPLOYMENT.md)
- [Reporte Oficial de Auditoría Scout (docs/audit_report.md)](docs/audit_report.md)
- [Guion de Pitch — 2 minutos (docs/PITCH.md)](docs/PITCH.md)
