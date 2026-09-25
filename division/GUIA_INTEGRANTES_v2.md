# 📋 Guía de Asignación por Integrantes — AgreedPay (Track 03: RWA)
### Versión 2.0: Con Integración de Cavos (`@cavos/kit`) — Account Abstraction, Passkeys & Gasless Escrow

Documento operativo interno del equipo. Cada integrante debe marcar sus tareas con `[x]` conforme las complete y hacer commit del progreso a su rama correspondiente.

--------------------------------------------------------------------------------

#### 📌 Reglas Generales de Colaboración
* **Entorno de Red:** Stellar Testnet & Soroban RPC.
* **Stack Web3 & Autenticación:** 
  * **Modo Web2 / Frictionless (Principal):** Cavos Kit (`@cavos/kit`) para inicio de sesión social (Google/Apple), Passkeys (WebAuthn) y transacciones patrocinadas sin gas (*Gasless Escrow*).
  * **Modo Web3 Nativo (Soporte Dual):** Stellar Wallets Kit con Freighter para usuarios cripto experimentados.
* **Control de Versiones:** Todos los integrantes deben registrar commits individuales verificables en GitHub (coautoría obligatoria).
* **Manejo de Ramas:** `feature/contrato`, `feature/web3-core`, `feature/frontend`, `feature/backend-docs`.
* **Regla de Seguridad:** Nunca subir `.env.local` al repositorio. Solo se sube `.env.example` como plantilla pública.

--------------------------------------------------------------------------------

#### 🧩 Protocolo de Integración (obligatorio antes del PR)
* **Rama de integración:** `feature/frontend` debe incorporar `main` y publicar un PR hacia `main`; no se deben copiar archivos manualmente entre ramas.
* **Fuente de verdad on-chain:** `contracts/escrow_milestones/src/lib.rs`. Los métodos disponibles son `deposit_and_create_milestones`, `submit_milestone`, `approve_milestone`, `claim_timeout`, `grant_revision_extension` y `resolve_dispute`.
* **Límite actual del ABI:** no existe `dispute_milestone` ni una factory para crear un contrato nuevo por formulario. La UI debe etiquetar la creación como fondeo del escrow configurado; una nueva versión del contrato es necesaria para soportar ambos flujos.
* **Contrato TypeScript:** el frontend consume exclusivamente los hooks de `src/hooks/`; no se permiten simulaciones de transacciones ni clientes RPC duplicados en componentes.
* **Configuración única:** Vite expone variables `VITE_*`; el SAC se configura con `VITE_USDC_SAC_CONTRACT_ID`. Nunca usar `process.env` en el código que se ejecuta en navegador.
* **Criterio de aceptación:** `npm ci`, `npm run build` y `cargo test` deben finalizar correctamente antes de abrir o aprobar el PR.

--------------------------------------------------------------------------------

#### 🦀 Integrante 1: Smart Contracts Lead (Rust / Soroban)
* **Rol:** Desarrollo, compilación, auditoría y despliegue del contrato inteligente on-chain.
* **Rama de trabajo:** `feature/contrato`
* **Estado Cavos:** **FINALIZADO / SIN CAMBIOS EN CÓDIGO RUST.** El contrato inteligente desplegado en Testnet (`CD6QQHMFJKOJYXNFIHSRWQTATG5AW22L6FHPFM76Y4Q2EUBFAOO563QR`) utiliza `require_auth()` nativo de Soroban, el cual valida firmas de direcciones `G...` que Cavos genera de forma nativa e inmutable.

##### Checklist de Tareas
* [x] Configurar `Cargo.toml` con `#![no_std]`, `soroban-sdk = "22.0.0"`, `opt-level = "z"` y `lto = true`.
* [x] En `types.rs`, definir `MilestoneStatus`, `Milestone`, `ProjectConfig` (con `progress_threshold` y `dispute_resolver`) y `DataKey`.
* [x] En `lib.rs`, implementar `__constructor`, `deposit_and_create_milestones`, `submit_milestone`, `approve_milestone`, `claim_timeout`, `grant_revision_extension` y `resolve_dispute`.
* [x] Redactar suite de pruebas en `test.rs`.
* [x] Desplegar en Testnet con Stellar CLI y registrar el Contract ID oficial: `CD6QQHMFJKOJYXNFIHSRWQTATG5AW22L6FHPFM76Y4Q2EUBFAOO563QR`.

--------------------------------------------------------------------------------

#### ⚡ Integrante 2: Web3 Core & Integration Lead (TypeScript / SDK)
* **Rol:** Capa de comunicación entre el frontend, autenticación con Cavos/Freighter y el entorno Soroban RPC.
* **Rama de trabajo:** `feature/web3-core`

##### Checklist de Tareas Ejecutables
* [ ] Instalar la dependencia oficial de Cavos: `npm install @cavos/kit`.
* [ ] Configurar el cliente modular de Cavos para Stellar Testnet:
  ```typescript
  import { Cavos } from "@cavos/kit";

  export const connectCavosWallet = async (userId: string, email?: string) => {
    const session = await Cavos.connect({
      chains: ["stellar"],
      defaultChain: "stellar",
      network: "testnet",
      identity: { userId, email },
      appSalt: "agreedpay-rwa-v1",
      appId: process.env.VITE_CAVOS_APP_ID,
    });
    return session.wallet("stellar");
  };
  ```
* [ ] Mantener el soporte dual con `@creit-tech/stellar-wallets-kit` y `@stellar/freighter-api` para usuarios con billeteras de extensión.
* [ ] Implementar wrapper defensivo para invocación de Soroban via Cavos / Freighter:
  * Utilizar `wallet.invokeContract` o `wallet.signXdr` para firmar de forma transparente las entradas de `require_auth()` del contrato `CD6QQ...`.
  * Habilitar el patrocinio de gas (*Gasless Escrow*) a través del relayer de Cavos para las llamadas `deposit_and_create_milestones`, `submit_milestone` y `approve_milestone`.
* [ ] Crear helpers de lectura mediante Soroban RPC (`getLedgerEntries`) para consultar estados del contrato e inventario de SAC USDC de 7 decimales.
* [ ] Construir hooks reactivos listos para el frontend: `useDeposit`, `useSubmitMilestone`, `useApproveMilestone`, `useClaimTimeout`, `useGrantRevisionExtension`.
* [ ] Entregar a Integrante 3 los hooks y helpers con soporte transparente para Cavos y Freighter.

--------------------------------------------------------------------------------

#### 🎨 Integrante 3: Frontend & UI/UX Lead (React / Vite / Tailwind)
* **Rol:** Construcción de la dApp, experiencia de usuario y visualización de hitos RWA.
* **Rama de trabajo:** `feature/frontend`

##### Checklist de Tareas Ejecutables
* [ ] Envolver la aplicación en el proveedor de Cavos (`<CavosProvider>`) en `src/main.tsx` o `src/App.tsx`.
* [ ] Crear el modal/botón de inicio de sesión unificado en la `Navbar`:
  * **Opción A (Frictionless / Recomendada):** "Iniciar sesión con Google / Apple / Passkey" (a través de Cavos).
  * **Opción B (Web3 Cripto):** "Conectar Freighter Wallet".
* [ ] Mostrar la dirección truncada del usuario (`GABC...XYZ`) independientemente de si proviene de Cavos o Freighter.
* [ ] Diseñar badges explicativos de "Transacción Patrocinada / Sin Gas" en la interfaz para resaltar la abstracción de cuentas ante los clientes empresarios.
* [ ] Conectar los formularios del modal de creación de contrato (`CreateAgreementModal`) con el hook `useDeposit`, incluyendo el control slider para `progress_threshold` (default 80%).
* [ ] Construir `ClientDash` y `DevDash` conectando los botones de acción (`approve_milestone`, `submit_milestone`, `claim_timeout`).
* [ ] Desplegar la dApp en Vercel y entregar la URL pública al Integrante 4.

--------------------------------------------------------------------------------

#### 🗄️ Integrante 4: Backend, QA & Video Lead (Supabase / Markdown / Pitch)
* **Rol:** Persistencia off-chain, documentación de arquitectura, QA end-to-end y producción del Video Demo/Pitch.
* **Rama de trabajo:** `feature/backend-docs`

##### Checklist de Tareas Ejecutables
* [ ] Actualizar el documento del Checkpoint Intermedio (`docs/architecture.md`) y `README.md` incorporando:
  * Diagrama de arquitectura con la capa de **Cavos Kit (Account Abstraction & Sponsored Relayer)**.
  * Explicación del modelo de identidad dual (Google/Passkeys vs Freighter) y custodia de fondos.
* [ ] Configurar las tablas de metadatos off-chain en Supabase (`projects`, `milestones`).
* [ ] Realizar QA End-to-End del flujo completo:
  1. Login con Google/Passkey via Cavos.
  2. Creación y fondeo del contrato en SAC USDC en Testnet.
  3. Entrega de hito por el freelancer.
  4. Aprobación y verificación de transacción confirmada en Stellar Expert.
* [ ] **Producción del Video Demo (~3 minutos) y Guión del Pitch:**
  * **Argumento Principal (Punto de Venta para el Jurado en Track 03 RWA):** Destacar que las empresas Web2 tradicionales pueden usar AgreedPay **sin crear frases semilla ni comprar XLM para gas**, gracias al onboarding de 5 segundos con Google/Passkey y las transacciones patrocinadas de Cavos.
  * Grabar el flujo real en Vercel y subir el video a YouTube/Loom.
* [ ] Asegurar que los 4 integrantes figuren con commits activos en GitHub.

--------------------------------------------------------------------------------

#### 🗓️ Tabla de Sincronización del Equipo
| Fecha | Hito de Coordinación | Responsable de Verificar |
| ------ | ------ | ------ |
| **24 Sept** | Contrato en Testnet (`CD6QQ...`) y setup de `@cavos/kit` | Integrantes 1 y 2 |
| **24 Sept** | Interfaz UI en Vercel con login Cavos + Freighter | Integrante 3 |
| **25 Sept 23:59** | **Cierre Definitivo** — README, `docs/architecture.md` y Video Demo | Integrante 4 |
| **26 Sept** | **Demo Day (PUCP)** — Presentation & Pitch con demo sin gas | Todo el Equipo |
