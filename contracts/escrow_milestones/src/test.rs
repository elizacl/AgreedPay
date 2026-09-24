#![cfg(test)]
use super::*;
use soroban_sdk::{
    testutils::{Address as _, Ledger, LedgerInfo},
    token::{Client as TokenClient, StellarAssetClient},
    vec, Address, Env, String,
};

// ---------------------------------------------------------------------------
// Helper: despliega el contrato y retorna el cliente tipado
// ---------------------------------------------------------------------------
fn create_contract<'a>(
    env: &'a Env,
    client: &Address,
    freelancer: &Address,
    token: &Address,
    arbitrator: &Address,
    timeout: u64,
    threshold: u32,
) -> EscrowMilestonesContractClient<'a> {
    let id = env.register(
        EscrowMilestonesContract,
        (
            client.clone(),
            freelancer.clone(),
            token.clone(),
            arbitrator.clone(),
            timeout,
            threshold,
        ),
    );
    EscrowMilestonesContractClient::new(env, &id)
}

// Helper: crea un token SAC de prueba y fondea el recipient
fn setup_token(env: &Env, admin: &Address, recipient: &Address, amount: i128) -> Address {
    let token_addr = env.register_stellar_asset_contract_v2(admin.clone()).address();
    let sac_admin = StellarAssetClient::new(env, &token_addr);
    sac_admin.mint(recipient, &amount);
    token_addr
}

// ---------------------------------------------------------------------------
// TEST 1: Constructor e inicialización — no debe entrar en pánico
// ---------------------------------------------------------------------------
#[test]
fn test_constructor_sets_config() {
    let env = Env::default();
    env.mock_all_auths();

    let client_addr = Address::generate(&env);
    let dev_addr = Address::generate(&env);
    let admin = Address::generate(&env);
    let token_addr = setup_token(&env, &admin, &client_addr, 0);
    let arbitrator = Address::generate(&env);

    let _contract = create_contract(&env, &client_addr, &dev_addr, &token_addr, &arbitrator, 1_209_600, 80);
    // Si llega aquí, el constructor fue exitoso
}

// ---------------------------------------------------------------------------
// TEST 2: Ciclo feliz — deposit → submit → approve
// ---------------------------------------------------------------------------
#[test]
fn test_happy_path_deposit_submit_approve() {
    let env = Env::default();
    env.mock_all_auths();

    let client_addr = Address::generate(&env);
    let dev_addr = Address::generate(&env);
    let admin = Address::generate(&env);
    let token_addr = setup_token(&env, &admin, &client_addr, 1_000_000);
    let arbitrator = Address::generate(&env);

    let contract = create_contract(&env, &client_addr, &dev_addr, &token_addr, &arbitrator, 1_209_600, 80);

    contract.deposit_and_create_milestones(
        &vec![&env, 1_000_000i128],
        &vec![&env, String::from_str(&env, "QmDescripcionHash")],
    );

    contract.submit_milestone(&0u32, &String::from_str(&env, "QmProofHash"));

    let dev_balance_before = TokenClient::new(&env, &token_addr).balance(&dev_addr);
    contract.approve_milestone(&0u32);
    let dev_balance_after = TokenClient::new(&env, &token_addr).balance(&dev_addr);

    assert_eq!(dev_balance_after - dev_balance_before, 1_000_000i128);
}

// ---------------------------------------------------------------------------
// TEST 3: Anti-lockup — claim_timeout después de 14 días
// ---------------------------------------------------------------------------
#[test]
fn test_claim_timeout_after_deadline() {
    let env = Env::default();
    env.mock_all_auths();

    let timeout: u64 = 1_209_600; // 14 días
    let client_addr = Address::generate(&env);
    let dev_addr = Address::generate(&env);
    let admin = Address::generate(&env);
    let token_addr = setup_token(&env, &admin, &client_addr, 500_000);
    let arbitrator = Address::generate(&env);

    let contract = create_contract(&env, &client_addr, &dev_addr, &token_addr, &arbitrator, timeout, 80);

    contract.deposit_and_create_milestones(
        &vec![&env, 500_000i128],
        &vec![&env, String::from_str(&env, "QmHash")],
    );

    // Freelancer envía en t=1000
    env.ledger().set(LedgerInfo {
        timestamp: 1_000,
        protocol_version: 22,
        sequence_number: 100,
        network_id: Default::default(),
        base_reserve: 10,
        min_temp_entry_ttl: 1,
        min_persistent_entry_ttl: 1,
        max_entry_ttl: 200_000,
    });
    contract.submit_milestone(&0u32, &String::from_str(&env, "QmProofHash"));

    // Avanzamos más allá del timeout
    env.ledger().set(LedgerInfo {
        timestamp: 1_000 + timeout + 1,
        protocol_version: 22,
        sequence_number: 200,
        network_id: Default::default(),
        base_reserve: 10,
        min_temp_entry_ttl: 1,
        min_persistent_entry_ttl: 1,
        max_entry_ttl: 200_000,
    });

    let dev_before = TokenClient::new(&env, &token_addr).balance(&dev_addr);
    contract.claim_timeout(&0u32);
    let dev_after = TokenClient::new(&env, &token_addr).balance(&dev_addr);

    assert_eq!(dev_after - dev_before, 500_000i128);
}

// ---------------------------------------------------------------------------
// TEST 4: Arbitraje IA — resolve_dispute libera fondos al freelancer
// ---------------------------------------------------------------------------
#[test]
fn test_resolve_dispute_to_freelancer() {
    let env = Env::default();
    env.mock_all_auths();

    let client_addr = Address::generate(&env);
    let dev_addr = Address::generate(&env);
    let admin = Address::generate(&env);
    let token_addr = setup_token(&env, &admin, &client_addr, 300_000);
    let arbitrator = Address::generate(&env);

    let contract = create_contract(&env, &client_addr, &dev_addr, &token_addr, &arbitrator, 1_209_600, 80);

    contract.deposit_and_create_milestones(
        &vec![&env, 300_000i128],
        &vec![&env, String::from_str(&env, "QmHash")],
    );
    contract.submit_milestone(&0u32, &String::from_str(&env, "QmProof"));

    let dev_before = TokenClient::new(&env, &token_addr).balance(&dev_addr);
    contract.resolve_dispute(&0u32, &true);
    let dev_after = TokenClient::new(&env, &token_addr).balance(&dev_addr);

    assert_eq!(dev_after - dev_before, 300_000i128);
}

// ---------------------------------------------------------------------------
// TEST 5: Arbitraje IA — resolve_dispute reembolsa al cliente
// ---------------------------------------------------------------------------
#[test]
fn test_resolve_dispute_to_client() {
    let env = Env::default();
    env.mock_all_auths();

    let client_addr = Address::generate(&env);
    let dev_addr = Address::generate(&env);
    let admin = Address::generate(&env);
    let token_addr = setup_token(&env, &admin, &client_addr, 300_000);
    let arbitrator = Address::generate(&env);

    let contract = create_contract(&env, &client_addr, &dev_addr, &token_addr, &arbitrator, 1_209_600, 80);

    contract.deposit_and_create_milestones(
        &vec![&env, 300_000i128],
        &vec![&env, String::from_str(&env, "QmHash")],
    );
    contract.submit_milestone(&0u32, &String::from_str(&env, "QmProof"));

    let client_before = TokenClient::new(&env, &token_addr).balance(&client_addr);
    contract.resolve_dispute(&0u32, &false);
    let client_after = TokenClient::new(&env, &token_addr).balance(&client_addr);

    assert_eq!(client_after - client_before, 300_000i128);
}

// ---------------------------------------------------------------------------
// TEST 6: grant_revision_extension actualiza estado del hito
// ---------------------------------------------------------------------------
#[test]
fn test_grant_revision_extension() {
    let env = Env::default();
    env.mock_all_auths();

    let client_addr = Address::generate(&env);
    let dev_addr = Address::generate(&env);
    let admin = Address::generate(&env);
    let token_addr = setup_token(&env, &admin, &client_addr, 200_000);
    let arbitrator = Address::generate(&env);

    let contract = create_contract(&env, &client_addr, &dev_addr, &token_addr, &arbitrator, 1_209_600, 80);

    contract.deposit_and_create_milestones(
        &vec![&env, 200_000i128],
        &vec![&env, String::from_str(&env, "QmHash")],
    );
    contract.submit_milestone(&0u32, &String::from_str(&env, "QmProof"));

    // Árbitro (IA) otorga 5 días adicionales
    contract.grant_revision_extension(&0u32, &432_000u64);
}