use soroban_sdk::{contracttype, Address, String};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum MilestoneStatus {
    Pending,          // Fondeado por el cliente
    Submitted,        // Entregable cargado con prueba SHA-256
    Approved,         // Aprobado; fondos liberados en USDC
    Disputed,         // Conflicto abierto en proceso de arbitraje
    RevisionRequired, // Avance >= progress_threshold: prórroga de 5 días otorgada por IA
    TimedOut,         // Liberado o reembolsado por inactividad/resolución
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct Milestone {
    pub id: u32,
    pub description_hash: String,
    pub amount: i128,
    pub status: MilestoneStatus,
    pub submission_timestamp: u64,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct ProjectConfig {
    pub client: Address,
    pub freelancer: Address,
    pub token: Address,            // Dirección SAC USDC en Testnet
    pub total_amount: i128,
    pub dispute_resolver: Address, // Agente de IA o mediador
    pub timeout_duration: u64,     // 14 días (1,209,600 segundos)
    pub progress_threshold: u32,   // Umbral de avance (default 80%)
}

#[contracttype]
pub enum DataKey {
    Config,
    Milestone(u32),
    MilestoneCount,
}
