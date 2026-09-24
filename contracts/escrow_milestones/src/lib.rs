#![no_std]
use soroban_sdk::{contract, contractimpl, token, Address, Env, String, Vec};

mod types;
use crate::types::*;

#[contract]
pub struct EscrowMilestonesContract;

#[contractimpl]
impl EscrowMilestonesContract {
    pub fn __constructor(
        env: Env,
        client: Address,
        freelancer: Address,
        token: Address,
        dispute_resolver: Address,
        timeout_duration: u64,
        progress_threshold: u32,
    ) {
        let threshold = if progress_threshold == 0 { 80u32 } else { progress_threshold };
        let config = ProjectConfig {
            client,
            freelancer,
            token,
            total_amount: 0,
            dispute_resolver,
            timeout_duration,
            progress_threshold: threshold,
        };
        env.storage().instance().set(&DataKey::Config, &config);
    }

    pub fn deposit_and_create_milestones(env: Env, amounts: Vec<i128>, hashes: Vec<String>) {
        let mut config: ProjectConfig = env.storage().instance().get(&DataKey::Config).unwrap();
        config.client.require_auth();

        let mut total_deposited: i128 = 0;
        let count = amounts.len();

        for i in 0..count {
            let amt = amounts.get(i).unwrap();
            let hsh = hashes.get(i).unwrap();
            total_deposited = total_deposited.checked_add(amt).expect("Overflow");

            let milestone = Milestone {
                id: i as u32,
                description_hash: hsh,
                amount: amt,
                status: MilestoneStatus::Pending,
                submission_timestamp: 0,
            };
            env.storage().persistent().set(&DataKey::Milestone(i as u32), &milestone);
            env.storage().persistent().extend_ttl(&DataKey::Milestone(i as u32), 17280, 100000);
        }

        config.total_amount = total_deposited;
        env.storage().instance().set(&DataKey::Config, &config);
        env.storage().instance().set(&DataKey::MilestoneCount, &count);

        let token_client = token::Client::new(&env, &config.token);
        token_client.transfer(&config.client, &env.current_contract_address(), &total_deposited);
    }

    pub fn submit_milestone(env: Env, milestone_id: u32, proof_hash: String) {
        let config: ProjectConfig = env.storage().instance().get(&DataKey::Config).unwrap();
        config.freelancer.require_auth();

        let mut m: Milestone = env.storage().persistent().get(&DataKey::Milestone(milestone_id)).unwrap();
        m.status = MilestoneStatus::Submitted;
        m.description_hash = proof_hash;
        m.submission_timestamp = env.ledger().timestamp();

        env.storage().persistent().set(&DataKey::Milestone(milestone_id), &m);
    }

    pub fn approve_milestone(env: Env, milestone_id: u32) {
        let config: ProjectConfig = env.storage().instance().get(&DataKey::Config).unwrap();
        config.client.require_auth();

        let mut m: Milestone = env.storage().persistent().get(&DataKey::Milestone(milestone_id)).unwrap();
        m.status = MilestoneStatus::Approved;
        env.storage().persistent().set(&DataKey::Milestone(milestone_id), &m);

        let token_client = token::Client::new(&env, &config.token);
        token_client.transfer(&env.current_contract_address(), &config.freelancer, &m.amount);
    }

    pub fn claim_timeout(env: Env, milestone_id: u32) {
        let config: ProjectConfig = env.storage().instance().get(&DataKey::Config).unwrap();
        config.freelancer.require_auth();

        let mut m: Milestone = env.storage().persistent().get(&DataKey::Milestone(milestone_id)).unwrap();
        let elapsed = env.ledger().timestamp().checked_sub(m.submission_timestamp).unwrap();
        assert!(elapsed >= config.timeout_duration, "Plazo no cumplido");

        m.status = MilestoneStatus::TimedOut;
        env.storage().persistent().set(&DataKey::Milestone(milestone_id), &m);

        let token_client = token::Client::new(&env, &config.token);
        token_client.transfer(&env.current_contract_address(), &config.freelancer, &m.amount);
    }

    pub fn grant_revision_extension(env: Env, milestone_id: u32, extension_seconds: u64) {
        let config: ProjectConfig = env.storage().instance().get(&DataKey::Config).unwrap();
        config.dispute_resolver.require_auth();

        let mut m: Milestone = env.storage().persistent().get(&DataKey::Milestone(milestone_id)).unwrap();
        m.status = MilestoneStatus::RevisionRequired;
        m.submission_timestamp = env.ledger().timestamp().checked_add(extension_seconds).unwrap();

        env.storage().persistent().set(&DataKey::Milestone(milestone_id), &m);
    }

    pub fn resolve_dispute(env: Env, milestone_id: u32, release_to_freelancer: bool) {
        let config: ProjectConfig = env.storage().instance().get(&DataKey::Config).unwrap();
        config.dispute_resolver.require_auth();

        let mut m: Milestone = env.storage().persistent().get(&DataKey::Milestone(milestone_id)).unwrap();
        let token_client = token::Client::new(&env, &config.token);

        if release_to_freelancer {
            token_client.transfer(&env.current_contract_address(), &config.freelancer, &m.amount);
        } else {
            token_client.transfer(&env.current_contract_address(), &config.client, &m.amount);
        }

        m.status = MilestoneStatus::TimedOut;
        env.storage().persistent().set(&DataKey::Milestone(milestone_id), &m);
    }
}

mod test;