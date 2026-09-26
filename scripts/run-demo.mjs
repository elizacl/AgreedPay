/**
 * Demo automática y autocontenida de AgreedPay en Stellar Testnet.
 *
 * No requiere Freighter, ni ninguna wallet conectada, ni que el autor original
 * del repo esté presente: genera y fondea (via friendbot) 3 cuentas nuevas de
 * testnet (cliente, freelancer, árbitro), despliega una instancia nueva del
 * contrato ya auditado, y ejecuta un flujo real de principio a fin:
 *
 *   1. Cliente deposita y crea 3 hitos (deposit_and_create_milestones)
 *   2. Freelancer entrega los 3 hitos (submit_milestone x3)
 *   3. Cliente aprueba el hito #0 -> pago liberado (approve_milestone)
 *   4. Árbitro otorga prórroga de revisión al hito #1 (grant_revision_extension)
 *   5. Árbitro resuelve disputa del hito #2, reembolso al cliente (resolve_dispute)
 *
 * Al terminar, escribe un `.env.local` apuntando al contrato recién creado,
 * así que después de correr esto ya puedes hacer `npm run dev` y ver el
 * Dashboard mostrando datos 100% reales y verificables en Stellar Expert.
 *
 * Uso:
 *   npm install
 *   node scripts/run-demo.mjs
 */
import { Keypair, Address, Contract, Operation, nativeToScVal, scValToNative, Asset, Networks } from "@stellar/stellar-sdk";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { server, buildTx, signSendWait, friendbot, WASM_HASH_HEX } from "./lib.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

function step(title) {
  console.log(`\n=== ${title} ===`);
}

async function main() {
  const srv = server();

  step("1/6 · Generando y fondeando cuentas de testnet");
  const client = Keypair.random();
  const freelancer = Keypair.random();
  const arbitrator = Keypair.random();
  console.log("  cliente:    ", client.publicKey());
  console.log("  freelancer: ", freelancer.publicKey());
  console.log("  árbitro:    ", arbitrator.publicKey());
  await Promise.all([
    friendbot(client.publicKey()),
    friendbot(freelancer.publicKey()),
    friendbot(arbitrator.publicKey()),
  ]);

  step("2/6 · Desplegando nueva instancia del contrato (token = XLM nativo)");
  const tokenId = Asset.native().contractId(Networks.TESTNET);
  console.log("  token SAC (XLM nativo):", tokenId);

  const constructorArgs = [
    nativeToScVal(client.publicKey(), { type: "address" }),
    nativeToScVal(freelancer.publicKey(), { type: "address" }),
    nativeToScVal(tokenId, { type: "address" }),
    nativeToScVal(arbitrator.publicKey(), { type: "address" }),
    nativeToScVal(1209600n, { type: "u64" }), // 14 días anti-lockup
    nativeToScVal(80, { type: "u32" }), // 80% umbral de revisión
  ];
  const createOp = Operation.createCustomContract({
    address: new Address(freelancer.publicKey()),
    wasmHash: Buffer.from(WASM_HASH_HEX, "hex"),
    constructorArgs,
  });
  const deployTx = await buildTx(srv, freelancer, [createOp]);
  const { result: deployResult } = await signSendWait(srv, deployTx, freelancer, "deploy contract");
  const contractId = scValToNative(deployResult.returnValue);
  console.log("  contractId:", contractId);
  const contract = new Contract(contractId);

  step("3/6 · Cliente deposita y crea 3 hitos");
  const amountsScVal = nativeToScVal([333_0000000n, 333_0000000n, 334_0000000n], { type: "i128" });
  const hashesScVal = nativeToScVal(
    ["deliverable-spec-0", "deliverable-spec-1", "deliverable-spec-2"],
    { type: "string" }
  );
  const depositOp = contract.call("deposit_and_create_milestones", amountsScVal, hashesScVal);
  const depositTx = await buildTx(srv, client, [depositOp]);
  await signSendWait(srv, depositTx, client, "deposit_and_create_milestones");

  step("4/6 · Freelancer entrega los 3 hitos");
  for (let i = 0; i < 3; i++) {
    const proofHash = `deliverable-proof-${i}-${Date.now()}`;
    const op = contract.call(
      "submit_milestone",
      nativeToScVal(i, { type: "u32" }),
      nativeToScVal(proofHash, { type: "string" })
    );
    const tx = await buildTx(srv, freelancer, [op]);
    await signSendWait(srv, tx, freelancer, `submit_milestone(${i})`);
  }

  step("5/6 · Cliente aprueba el hito #0 -> libera el pago");
  const approveOp = contract.call("approve_milestone", nativeToScVal(0, { type: "u32" }));
  const approveTx = await buildTx(srv, client, [approveOp]);
  await signSendWait(srv, approveTx, client, "approve_milestone(0)");

  step("6/6 · Árbitro resuelve los hitos #1 y #2");
  const revisionOp = contract.call(
    "grant_revision_extension",
    nativeToScVal(1, { type: "u32" }),
    nativeToScVal(432000n, { type: "u64" }) // 5 días
  );
  const revisionTx = await buildTx(srv, arbitrator, [revisionOp]);
  await signSendWait(srv, revisionTx, arbitrator, "grant_revision_extension(1)");

  const disputeOp = contract.call(
    "resolve_dispute",
    nativeToScVal(2, { type: "u32" }),
    nativeToScVal(false, { type: "bool" }) // reembolso al cliente
  );
  const disputeTx = await buildTx(srv, arbitrator, [disputeOp]);
  await signSendWait(srv, disputeTx, arbitrator, "resolve_dispute(2, release_to_freelancer=false)");

  // --- Escribe .env.local para que `npm run dev` ya muestre este contrato ---
  const envPath = path.join(repoRoot, ".env.local");
  const envContent = `# Generado automáticamente por scripts/run-demo.mjs — ${new Date().toISOString()}
VITE_ESCROW_CONTRACT_ID=${contractId}
PUBLIC_ESCROW_CONTRACT_ID=${contractId}
VITE_USDC_SAC_CONTRACT_ID=${tokenId}
PUBLIC_USDC_SAC_CONTRACT_ID=${tokenId}
VITE_STELLAR_NETWORK=TESTNET
VITE_STELLAR_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
PUBLIC_STELLAR_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
VITE_STELLAR_RPC_URL="https://soroban-testnet.stellar.org"
VITE_SOROBAN_RPC_URL="https://soroban-testnet.stellar.org"
PUBLIC_STELLAR_RPC_URL="https://soroban-testnet.stellar.org"
`;
  fs.writeFileSync(envPath, envContent);

  console.log(`\n✅ Listo. Contrato desplegado y poblado con transacciones reales en Testnet.`);
  console.log(`   Contract ID: ${contractId}`);
  console.log(`   Explorer:    https://stellar.expert/explorer/testnet/contract/${contractId}`);
  console.log(`   .env.local escrito en: ${envPath}`);
  console.log(`\n   Siguiente paso: npm run dev  (el Dashboard ya va a leer este contrato en vivo)\n`);
}

main().catch((err) => {
  console.error("\n❌ Error ejecutando la demo:", err);
  process.exit(1);
});
