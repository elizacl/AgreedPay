# AgreedPay 🛡️⚡
> **Plataforma de custodia y pagos por hitos en USDC (RWA) sobre Stellar & Soroban**  
> *Track 03: Real-World Assets & Compliant Rails*

---

## 👥 Equipo de Desarrollo

- **Angelo Goitia**
- **Santiago Rodríguez**
- **Jack Jimenes**
- **Elizabeth Coronado**

---

## 🚀 Despliegue Oficial en Stellar Testnet

El contrato inteligente principal de AgreedPay (`escrow_milestones`) se encuentra **compilado, auditado y desplegado en vivo** en la red Stellar Testnet, listo para ser consumido por la dApp y las billeteras Web3.

| Parámetro | Valor Oficial |
| :--- | :--- |
| **Contract ID** | [`CD6QQHMFJKOJYXNFIHSRWQTATG5AW22L6FHPFM76Y4Q2EUBFAOO563QR`](https://stellar.expert/explorer/testnet/contract/CD6QQHMFJKOJYXNFIHSRWQTATG5AW22L6FHPFM76Y4Q2EUBFAOO563QR) |
| **WASM Hash** | `9376506ed445239beb653d8389e77af667cd66b0486060cc1122766bd0151940` |
| **Token de Pago (SAC USDC)** | `CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA` |
| **Red** | Stellar Testnet (`Test SDF Network ; September 2015`) |
| **Soroban RPC URL** | `https://soroban-testnet.stellar.org` |
| **Stellar Lab** | [Ver y probar en Stellar Lab](https://lab.stellar.org/r/testnet/contract/CD6QQHMFJKOJYXNFIHSRWQTATG5AW22L6FHPFM76Y4Q2EUBFAOO563QR) |
| **Reporte de Auditoría** | [docs/audit_report.md](docs/audit_report.md) *(0 vulnerabilidades / 36 detectores)* |

---

## 📦 Guía de Integración y Conexión Web3

Esta sección detalla cómo interactuar, configurar y consumir el contrato inteligente de AgreedPay desde cualquier cliente Web3 o aplicación frontend:

### 1. Variables de Entorno (`.env.example` / `.env.local`)
Configurar las siguientes variables en la aplicación cliente (React / Vite / Next.js):

```env
# Contrato principal AgreedPay
VITE_ESCROW_CONTRACT_ID=CD6QQHMFJKOJYXNFIHSRWQTATG5AW22L6FHPFM76Y4Q2EUBFAOO563QR

# SAC USDC oficial en Testnet (7 decimales)
VITE_USDC_SAC_CONTRACT_ID=CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA

# Configuración de Red Stellar
VITE_STELLAR_NETWORK=TESTNET
VITE_STELLAR_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
VITE_STELLAR_RPC_URL="https://soroban-testnet.stellar.org"
```

---

### 2. Generación Automática de Bindings TypeScript

Para generar clientes tipados en TypeScript directamente desde el contrato desplegado:

```bash
stellar contract bindings typescript \
  --network testnet \
  --contract-id CD6QQHMFJKOJYXNFIHSRWQTATG5AW22L6FHPFM76Y4Q2EUBFAOO563QR \
  --output-dir src/contracts/agreedpay
```

Esto generará automáticamente las funciones tipadas listas para usar con `@stellar/stellar-sdk` y `@creit-tech/stellar-wallets-kit`.

---

### 3. Métodos On-Chain Disponibles

| Función | Invocador Autorizado | Parámetros | Descripción |
| :--- | :---: | :--- | :--- |
| `deposit_and_create_milestones` | **Cliente** | `amounts: Vec<i128>`, `hashes: Vec<String>` | Fondea en SAC USDC y divide el acuerdo en hitos inmutables. |
| `submit_milestone` | **Freelancer** | `milestone_id: u32`, `proof_hash: String` | Registra el hash SHA-256 del entregable y marca el hito como `Submitted`. |
| `approve_milestone` | **Cliente** | `milestone_id: u32` | Aprueba la entrega y libera el 100% de USDC del hito al freelancer. |
| `claim_timeout` | **Freelancer** | `milestone_id: u32` | **Anti-Lockup:** Reclamo de fondos tras 14 días (1,209,600 s) de inactividad del cliente. |
| `grant_revision_extension` | **Agente IA / Árbitro** | `milestone_id: u32`, `extension_seconds: u64` | Otorga prórroga de 5 días (432,000 s) al freelancer cambiando a estado `RevisionRequired`. |
| `resolve_dispute` | **Agente IA / Árbitro** | `milestone_id: u32`, `release_to_freelancer: bool` | Resolución final de disputa: fondos al freelancer (`true`) o reembolso al cliente (`false`). |

---

### 4. Mapeo de Estados para la Interfaz de Usuario (UI/UX)

El contrato utiliza el enum `MilestoneStatus`. En la interfaz gráfica se representan mediante los siguientes estados:

```typescript
export enum MilestoneStatus {
  Pending = 'Pending',                     // 🟡 Fondo en custodia, esperando entrega
  Submitted = 'Submitted',                 // 🔵 Entregable enviado (inicia cuenta regresiva de 14 días)
  Approved = 'Approved',                   // 🟢 Aprobado por el cliente, fondos liberados
  Disputed = 'Disputed',                   // 🔴 Conflicto abierto en arbitraje
  RevisionRequired = 'RevisionRequired',   // 🟠 Prórroga IA activa (cuenta regresiva de 5 días)
  TimedOut = 'TimedOut',                   // ⚪ Concluido por timeout anti-lockup o reembolso
}
```

---

### 5. Pruebas Locales y Auditoría del Contrato

Para compilar, auditar o correr las pruebas unitarias del contrato localmente:

```powershell
# 1. Ubicarse en la carpeta del contrato
cd contracts/escrow_milestones

# 2. Ejecutar la suite completa de 6 pruebas unitarias
$env:CARGO_INCREMENTAL = "0"
$env:CARGO_TARGET_DIR = "C:\Users\eliza\cargo_targets\escrow_milestones"
cargo test -p escrow_milestones -- --nocapture

# 3. Compilar el archivo WebAssembly (.wasm)
stellar contract build

# 4. Ejecutar auditoría estática de seguridad (Scout Soroban)
cargo scout-audit -v
```

---

---

## ⚡ Capa Web3 Core & Abstracción de Cuentas (SDK & Hooks)

AgreedPay implementa una arquitectura Web3 de última generación diseñada para eliminar la fricción de incorporación (onboarding) en empresas e inversionistas tradicionales:

### 1. Autenticación y Transacciones sin Gas (Gasless Escrow) con Cavos Kit
A través de `@cavos/kit` (`src/lib/cavos.ts`), AgreedPay ofrece una experiencia **Frictionless**:
* **Onboarding Instantáneo:** Inicio de sesión con Google / Apple / Passkeys (WebAuthn) sin necesidad de gestionar frases semilla (`seed phrases`).
* **Gasless Escrow (0 XLM Requerido):** Las empresas operan exclusivamente en **USDC**. El `StellarRelayer` de Cavos patrocina las comisiones de red (`fee-bump`) y el consumo de recursos (CPU, memoria y escrituras en ledger).
* **Patrocinio de Reservas:** Las trustlines para USDC son patrocinadas on-chain (`beginSponsoringFutureReserves`), permitiendo operar a cuentas con saldo de `0 XLM`.
* **Firma Transparente de `require_auth()`:** Los métodos `executeGaslessContractCall` y `signGaslessXdr` firman de forma transparente las autorizaciones `SorobanAuthorizationEntry` que exige el contrato inteligente.

```typescript
import { connectCavosWallet, ensureGaslessUsdcTrustline } from "@/lib/cavos";

// 1. Conectar sin requerir XLM ni extensiones
const wallet = await connectCavosWallet("cliente@empresa.com");

// 2. Garantizar trustline USDC patrocinada por el Relayer
await ensureGaslessUsdcTrustline();
```

---

### 2. Soporte Dual de Billeteras (Freighter & Stellar Wallets Kit)
Para usuarios Web3 nativos y desarrolladores Web3, AgreedPay mantiene soporte directo mediante `@stellar/freighter-api` y `@creit-tech/stellar-wallets-kit` (`src/lib/soroban.ts`):

```typescript
import { connectWallet, signTransactionWithWallet } from "@/lib/soroban";

// Conectar mediante modal unificado o Freighter directo
const { address, walletType } = await connectWallet("freighter"); // o 'stellar-wallets-kit' | 'cavos'
```

---

### 3. Orquestación Soroban RPC & Lectura con `getLedgerEntries`
En `src/lib/soroban.ts` se implementa el ciclo completo de orquestación y mitigación defensiva de errores:

* **Mitigación `tx_bad_seq`:** Re-consulta fresca de secuencia con `getAccount()` antes de cada armado.
* **Mitigación `tx_too_late`:** Timeout defensivo de 180 segundos en `TransactionBuilder`.
* **Ciclo de Invocación:** `simulateTransaction()` ➔ `assembleTransaction()` ➔ Firma ➔ `sendTransaction()` ➔ Polling con `pollTransaction()` hasta `SUCCESS`.
* **Lectura Directa sin Horizon (`getLedgerEntries`):**
  * `getContractConfig()`: Consulta la configuración (`ProjectConfig`) del almacenamiento de instancia.
  * `getMilestoneCount()`: Consulta el total de hitos registrados.
  * `getMilestone(id)` & `getAllMilestones()`: Consulta eficiente en un solo lote (batch) de los hitos desde el almacenamiento persistente.
  * `getUsdcBalance(address)`: Lectura del balance SAC USDC con precisión garantizada de 7 decimales (`BigInt`).

---

### 4. Hooks Reactivos para el Frontend (`src/hooks/`)

Todos los hooks exportados en `src/hooks/index.ts` exponen `{ execute, isLoading, isSuccess, isError, error, txHash, ledger, reset }` y soportan de forma transparente tanto Cavos (Gasless) como Freighter:

| Hook | Archivo | Acción On-Chain |
| :--- | :--- | :--- |
| `useDeposit` | [`src/hooks/useDeposit.ts`](src/hooks/useDeposit.ts) | Bloquea USDC y divide el acuerdo en hitos con `progress_threshold` (default 80%). |
| `useSubmitMilestone` | [`src/hooks/useSubmitMilestone.ts`](src/hooks/useSubmitMilestone.ts) | El freelancer envía el hash SHA-256 del entregable on-chain. |
| `useApproveMilestone` | [`src/hooks/useApproveMilestone.ts`](src/hooks/useApproveMilestone.ts) | El cliente aprueba y libera el 100% del pago en USDC. |
| `useClaimTimeout` | [`src/hooks/useClaimTimeout.ts`](src/hooks/useClaimTimeout.ts) | **Anti-Lockup:** Reclamo de fondos tras 14 días de inactividad del cliente. |
| `useGrantRevisionExtension` | [`src/hooks/useGrantRevisionExtension.ts`](src/hooks/useGrantRevisionExtension.ts) | Prórroga de 5 días otorgada por el Agente IA/árbitro (`RevisionRequired`). |
| `useEscrowContractState` | [`src/hooks/useEscrowContractState.ts`](src/hooks/useEscrowContractState.ts) | Lectura reactiva del contrato, lista de hitos y saldos bloqueados con auto-polling. |

#### Ejemplo de uso en componente React:
```tsx
import { useDeposit, useEscrowContractState } from "@/hooks";

export function AgreementView({ contractId, userAddress }) {
  const { state, lockedBalance, isLoading: isReading } = useEscrowContractState({ contractId });
  const { execute: deposit, isLoading: isDepositing, txHash } = useDeposit();

  const handleCreateAndFund = async () => {
    await deposit({
      milestones: [
        { amount: "1500", descriptionHash: "sha256_hito_1" },
        { amount: "1500", descriptionHash: "sha256_hito_2" },
      ],
      signerAddress: userAddress,
      walletType: "cavos", // ← Transacción patrocinada sin gas
    });
  };

  return (
    <div>
      <h3>Total en Custodia: {lockedBalance?.formatted} USDC</h3>
      <button onClick={handleCreateAndFund} disabled={isDepositing}>
        {isDepositing ? "Procesando depósito sin gas..." : "Fondear Contrato"}
      </button>
    </div>
  );
}
```

---

## 📚 Documentación Técnica Adicional

- [Diagramas de Arquitectura y Flujos (docs/architecture.md)](docs/architecture.md)
- [Registro de Despliegue en Testnet (DEPLOYMENT.md)](DEPLOYMENT.md)
- [Reporte Oficial de Auditoría Scout (docs/audit_report.md)](docs/audit_report.md)

