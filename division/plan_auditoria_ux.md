# 🛡️ Plan Unificado — Auditoría UX + Progressive Disclosure Web2-First

> **Filosofía central:** Interfaz "Web2-First" limpia para público no-crypto, con **Divulgación Progresiva** de la transparencia Web3 a un clic de distancia.
> Esta es la **mayor ventaja competitiva** de AgreedPay en el Track 03 (RWA).

---

## 📐 Arquitectura de 2 Capas

### Capa 1: Experiencia Humana y Comercial (Por Defecto)

| Antes (Técnico/Crypto) | Después (Negocio/Humano) |
|---|---|
| `stellar:contract:CA32...88A1` | Contrato #4092 |
| `GA78XKDL...K32P` | **Acme Corp** (Bryan M.) |
| `85000` (7 decimales internos) | **$85,000.00 USDC** |
| `Submitted` | 📋 **Trabajo Entregado** |
| `Approved` | ✅ **Aprobado & Pagado** |
| `Pending` | ⏳ **En Custodia** |
| Badge "Stellar Testnet" en header | Indicador discreto en sidebar footer |
| Badge "⚡ Transacción Sin Gas" en header | Tooltip al pasar sobre un botón de acción |
| `Custodia Multifirma 2/3` | 🔒 **Custodia Segura** (expandible) |
| `Timeout Soroban 79% restante` | **11 días para revisión** |

### Capa 2: Verificación On-Chain (A un clic)

Para cada hito o transacción visible, se agrega un botón discreto:

```
┌─────────────────────────────────────────────┐
│  ✅ Hito 2: Frontend React & APIs          │
│  Aprobado & Pagado — $20,000 USDC          │
│                                             │
│  📅 28 Oct 2024    🔗 Verificar en Blockchain│
│                         └── Abre stellar.expert
└─────────────────────────────────────────────┘
```

- **Dirección truncada** en esquina superior: `GABC...XYZ`
- **Botón "🔗 Verificar en Blockchain"** junto a cada hito liberado/depositado
- **Redirección a Explorer**: `https://stellar.expert/explorer/testnet/tx/${txHash}`
- **Hash del entregable**: Oculto por defecto, visible al expandir "Detalles técnicos"

---

## 🚨 Problemas Identificados (Auditoría + Progressive Disclosure)

### Hallazgos Originales de la Auditoría

| # | Problema | Prioridad | Tipo |
|---|---|---|---|
| 1 | Botón "+Crear Acuerdo" **duplicado** (Navbar + RoleTabs) | 🔴 Alta | Redundancia |
| 2 | Tab "Milestones" **idéntica** a "Escrow Overview" | 🔴 Alta | Confusión |
| 3 | Navegación **doble** Navbar + Sidebar | 🟡 Media | Saturación |
| 4 | 3 pestañas **casi vacías** (Treasury, API, Dispute) | 🟡 Media | Contenido pobre |
| 5 | Header con **9 elementos** compitiendo | 🟡 Media | Saturación |
| 6 | Error de Freighter **sin feedback visual** | 🔴 Alta | UX rota |
| 7 | **Sin estado vacío** para usuarios nuevos | 🔴 Alta | Flujo roto |

### Hallazgos Nuevos (Progressive Disclosure)

| # | Problema | Prioridad | Tipo |
|---|---|---|---|
| 8 | Terminología **crypto-first** en toda la UI | 🔴 Alta | Barrera de entrada |
| 9 | **No hay botón** "Verificar en Blockchain" junto a hitos | 🟡 Media | Transparencia faltante |
| 10 | **Hashes visibles** por defecto (no colapsados) | 🟡 Media | Ruido visual |
| 11 | **Badges técnicos** prominentes (Stellar Testnet, Gasless) | 🟡 Media | Público incorrecto |
| 12 | **Estados en inglés técnico** (Submitted, Approved, Pending) | 🔴 Alta | Lenguaje no-business |

---

## 📋 Plan de Implementación — 5 Fases

### FASE 1: Limpieza de Redundancias ⏱️ ~25min

| # | Tarea | Archivo(s) | Detalle |
|---|---|---|---|
| 1.1 | Eliminar botón "+Crear Nuevo Acuerdo" de RoleTabs | [`RoleTabs.tsx`](file:///c:/Users/bryan/Desktop/UNMSM/Hack/AgreedPay/src/components/dashboard/RoleTabs.tsx) | Dejar solo el del Navbar |
| 1.2 | Eliminar navLinks del Navbar (5 tabs duplicadas del sidebar) | [`Navbar.tsx`](file:///c:/Users/bryan/Desktop/UNMSM/Hack/AgreedPay/src/components/layout/Navbar.tsx) | Header solo: Logo + Crear + Wallet |
| 1.3 | Eliminar tab "Milestones" (duplicada de Escrow Overview) | [`Sidebar.tsx`](file:///c:/Users/bryan/Desktop/UNMSM/Hack/AgreedPay/src/components/layout/Sidebar.tsx), [`App.tsx`](file:///c:/Users/bryan/Desktop/UNMSM/Hack/AgreedPay/src/App.tsx) | Quitar de sidebar y mobile nav |
| 1.4 | Eliminar tabs "Treasury Vault" y "API & Webhooks" del sidebar | [`Sidebar.tsx`](file:///c:/Users/bryan/Desktop/UNMSM/Hack/AgreedPay/src/components/layout/Sidebar.tsx), [`App.tsx`](file:///c:/Users/bryan/Desktop/UNMSM/Hack/AgreedPay/src/App.tsx) | Mover Treasury info a Active Contracts |
| 1.5 | Mover badges técnicos al sidebar footer | [`Navbar.tsx`](file:///c:/Users/bryan/Desktop/UNMSM/Hack/AgreedPay/src/components/layout/Navbar.tsx) → [`Sidebar.tsx`](file:///c:/Users/bryan/Desktop/UNMSM/Hack/AgreedPay/src/components/layout/Sidebar.tsx) | Stellar Testnet, Gasless, Settlement Pool |

**Resultado Fase 1:**

```diff
- Navbar: [Logo] [5 tabs] [Stellar] [⚡Gas] [Pool] [+Crear] [Wallet]
+ Navbar: [Logo AgreedPay] ←espacio→ [+ Crear Acuerdo] [Conectar]

- Sidebar: 7 tabs (Escrow, Active, Milestones, Dispute, Audit, Treasury, API)
+ Sidebar: 4 tabs (Escrow Overview, Contratos Activos, Disputas, Actividad)
+          Network Status: ● Stellar Testnet · ⚡ Gasless · Relay Online
```

---

### FASE 2: Lenguaje Web2-First (Progressive Disclosure) ⏱️ ~35min

| # | Tarea | Archivo(s) | Detalle |
|---|---|---|---|
| 2.1 | Renombrar tabs al español de negocios | [`Sidebar.tsx`](file:///c:/Users/bryan/Desktop/UNMSM/Hack/AgreedPay/src/components/layout/Sidebar.tsx) | "Escrow Overview" → "Mis Contratos", "Active Contracts" → "Todos los Acuerdos", etc. |
| 2.2 | Reemplazar estados técnicos por lenguaje de negocios | [`MilestoneStepper.tsx`](file:///c:/Users/bryan/Desktop/UNMSM/Hack/AgreedPay/src/components/dashboard/MilestoneStepper.tsx) | `Submitted` → "Trabajo Entregado", `Approved` → "Aprobado & Pagado", `Pending` → "En Custodia" |
| 2.3 | Ocultar badges crypto del header de RoleTabs | [`RoleTabs.tsx`](file:///c:/Users/bryan/Desktop/UNMSM/Hack/AgreedPay/src/components/dashboard/RoleTabs.tsx) | `stellar:contract:CA32...88A1` y `Custodia Multifirma 2/3` → Colapsar en un botón "🔗 Detalles técnicos" |
| 2.4 | Humanizar KPI labels | [`ContractMetrics.tsx`](file:///c:/Users/bryan/Desktop/UNMSM/Hack/AgreedPay/src/components/dashboard/ContractMetrics.tsx) | "Cláusula Anti-Lockup" → "Plazo de Revisión", "Timeout Soroban" → "Tiempo restante" |
| 2.5 | Mostrar identidad humana por defecto | [`Navbar.tsx`](file:///c:/Users/bryan/Desktop/UNMSM/Hack/AgreedPay/src/components/layout/Navbar.tsx) | Mostrar nombre/email del usuario en vez de `GABC...XYZ` como primario; wallet truncada como secundario |

**Mapeo de renombramientos de Sidebar:**

```diff
- SETTLEMENT OPS
-   Escrow Overview
-   Active Contracts
-   Milestones
-   Dispute Center
-   Audit & Logs
- CONFIGURATION
-   Treasury Vault
-   API & Webhooks

+ MIS OPERACIONES
+   Panel Principal
+   Todos los Acuerdos
+   Centro de Disputas
+   Actividad y Registros
```

---

### FASE 3: Botones "Verificar en Blockchain" ⏱️ ~30min

| # | Tarea | Archivo(s) | Detalle |
|---|---|---|---|
| 3.1 | Agregar botón "🔗 Verificar en Blockchain" a cada hito completado | [`MilestoneStepper.tsx`](file:///c:/Users/bryan/Desktop/UNMSM/Hack/AgreedPay/src/components/dashboard/MilestoneStepper.tsx) | Solo visible en hitos `Approved` o `Submitted`. Abre `stellar.expert/explorer/testnet/tx/${txHash}` en nueva pestaña |
| 3.2 | Agregar sección colapsable "Detalles técnicos" a cada hito | [`MilestoneStepper.tsx`](file:///c:/Users/bryan/Desktop/UNMSM/Hack/AgreedPay/src/components/dashboard/MilestoneStepper.tsx) | Muestra: Hash SHA-256, dirección del contrato, ledger sequence. Colapsado por defecto |
| 3.3 | Agregar ícono "🔗" a cada fila de la tabla de Active Contracts | [`ActiveContractsView.tsx`](file:///c:/Users/bryan/Desktop/UNMSM/Hack/AgreedPay/src/components/dashboard/ActiveContractsView.tsx) | Link discreto a stellar.expert para cada contrato |
| 3.4 | Colapsar hash en DeliverablesPanel | [`DeliverablesPanel.tsx`](file:///c:/Users/bryan/Desktop/UNMSM/Hack/AgreedPay/src/components/dashboard/DeliverablesPanel.tsx) | Hash visible solo al expandir "Ver comprobante técnico" |

**Ejemplo visual del botón:**

```
┌────────────────────────────────────────────────────┐
│  ✅ Hito 1: Arquitectura y Diseño UI/UX           │
│  Aprobado & Pagado · $15,000 USDC · 12 Oct 2024   │
│                                                    │
│  [📄 Ver entregable]    [🔗 Verificar en Blockchain]│
│                              ↓                     │
│              stellar.expert/explorer/testnet/tx/... │
│                                                    │
│  ▶ Detalles técnicos (colapsado)                   │
│    Hash: 0x48abc190...                             │
│    Contrato: CA32...88A1                           │
│    Ledger: 54,198,024                              │
└────────────────────────────────────────────────────┘
```

---

### FASE 4: Welcome Screen + Empty States ⏱️ ~40min

| # | Tarea | Archivo(s) | Detalle |
|---|---|---|---|
| 4.1 | Crear componente `WelcomeScreen.tsx` | Nuevo archivo en `components/` | Pantalla limpia para usuarios no conectados |
| 4.2 | Condicionar dashboard a `session.isConnected` | [`App.tsx`](file:///c:/Users/bryan/Desktop/UNMSM/Hack/AgreedPay/src/App.tsx) | Si no conectado → WelcomeScreen; si conectado → Dashboard |
| 4.3 | Crear `EmptyContractsState.tsx` | Nuevo archivo en `components/dashboard/` | Para usuarios conectados sin contratos activos |
| 4.4 | Ocultar Sidebar cuando no está conectado | [`App.tsx`](file:///c:/Users/bryan/Desktop/UNMSM/Hack/AgreedPay/src/App.tsx) | Solo mostrar Navbar (Logo + Conectar) en WelcomeScreen |

**Diseño conceptual del WelcomeScreen:**

```
┌─────────────────────────────────────────────────────────────┐
│  [A] AgreedPay                          [Conectar Billetera]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              🛡️                                             │
│                                                             │
│     Custodia Inteligente para                               │
│     Acuerdos Profesionales                                  │
│                                                             │
│     Protege tus pagos por hitos con custodia                │
│     programable. Sin comisiones de gas.                     │
│     Sin intermediarios bancarios.                           │
│                                                             │
│     [🔐 Conectar con Google]  [🔗 Conectar Wallet]          │
│                                                             │
│     ── Cómo funciona ──                                     │
│                                                             │
│     1. Crea un acuerdo    2. Define hitos    3. Libera pagos│
│        📝                    🎯                  💰          │
│                                                             │
│     ── Respaldado por ──                                    │
│     [Stellar] [USDC] [Soroban] [Cavos]                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### FASE 5: Manejo de Errores y Polish ⏱️ ~20min

| # | Tarea | Archivo(s) | Detalle |
|---|---|---|---|
| 5.1 | Try/catch en `handleConnect` + toast visual | [`App.tsx`](file:///c:/Users/bryan/Desktop/UNMSM/Hack/AgreedPay/src/App.tsx) | Si Freighter no instalado: banner con link a freighter.app |
| 5.2 | Toast de confirmación al conectar exitosamente | [`App.tsx`](file:///c:/Users/bryan/Desktop/UNMSM/Hack/AgreedPay/src/App.tsx) | "✅ Billetera conectada como GABC...XYZ" |
| 5.3 | Tooltips "Gasless" en botones de acción | [`MilestoneStepper.tsx`](file:///c:/Users/bryan/Desktop/UNMSM/Hack/AgreedPay/src/components/dashboard/MilestoneStepper.tsx) | Al hover sobre "Aprobar" → tooltip: "⚡ Sin comisiones de gas" |
| 5.4 | Renombrar título del tab del navegador | [`index.html`](file:///c:/Users/bryan/Desktop/UNMSM/Hack/AgreedPay/index.html) | "AgreedPay — Custodia Inteligente para Acuerdos Profesionales" |

---

## 📊 Resumen del Plan

| Fase | Enfoque | Tiempo | Archivos principales |
|---|---|---|---|
| **Fase 1** | Eliminar redundancias | ~25min | Navbar, Sidebar, RoleTabs, App |
| **Fase 2** | Lenguaje Web2-First | ~35min | Sidebar, MilestoneStepper, ContractMetrics, RoleTabs |
| **Fase 3** | Botones "Verificar en Blockchain" | ~30min | MilestoneStepper, ActiveContractsView, DeliverablesPanel |
| **Fase 4** | Welcome Screen + Empty States | ~40min | WelcomeScreen (nuevo), EmptyContractsState (nuevo), App |
| **Fase 5** | Errores y polish | ~20min | App, MilestoneStepper, index.html |
| | **Total estimado** | **~2.5 horas** | |

---

## 🎯 Impacto en el Track 03 (RWA)

> [!IMPORTANT]
> **Lo que el jurado verá:**
> 1. Una app que **parece fintech** (no crypto) → Barrera de entrada mínima
> 2. Botón "Verificar en Blockchain" que demuestra **transparencia real** → Diferenciador vs PayPal/Escrow.com
> 3. Welcome Screen profesional → Primera impresión de **producto terminado**
> 4. Estados en español de negocios → Demuestra que entienden al **usuario final (RWA)**
> 5. Error handling elegante → Demuestra **madurez del producto**

> [!TIP]
> La combinación de "Capa Humana" + "Capa de Verificación a un clic" es exactamente lo que distingue a un proyecto blockchain de hackathon que **entiende UX** de uno que solo muestra hashes y direcciones.

¿Aprobamos este plan para proceder con la implementación?
