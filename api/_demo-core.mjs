import {
  Keypair,
  Address,
  Contract,
  Operation,
  nativeToScVal,
  scValToNative,
  Asset,
  Networks,
  rpc,
  TransactionBuilder,
  BASE_FEE,
} from "@stellar/stellar-sdk";

const RPC_URL = "https://soroban-testnet.stellar.org";
const NETWORK_PASSPHRASE = Networks.TESTNET;
// WASM del contrato escrow_milestones, ya auditado y subido en Stellar Testnet
// (ver DEPLOYMENT.md). Cualquier cuenta puede crear una nueva instancia
// referenciando este hash sin volver a subir el código.
const WASM_HASH_HEX = "9376506ed445239beb653d8389e77af667cd66b0486060cc1122766bd0151940";

function srv() {
  return new rpc.Server(RPC_URL, { allowHttp: false });
}

async function friendbot(pubkey) {
  const res = await fetch(`https://friendbot.stellar.org?addr=${encodeURIComponent(pubkey)}`);
  return res.ok;
}

async function buildTx(server, sourceKeypair, operations) {
  const account = await server.getAccount(sourceKeypair.publicKey());
  const builder = new TransactionBuilder(account, {
    fee: (BASE_FEE * 10).toString(),
    networkPassphrase: NETWORK_PASSPHRASE,
  });
  for (const op of operations) builder.addOperation(op);
  return builder.setTimeout(60).build();
}

async function signSendWait(server, tx, signerKeypairs, label, onStep) {
  const prepared = await server.prepareTransaction(tx);
  const signers = Array.isArray(signerKeypairs) ? signerKeypairs : [signerKeypairs];
  for (const kp of signers) prepared.sign(kp);
  const sendRes = await server.sendTransaction(prepared);
  if (sendRes.status === "ERROR" || sendRes.errorResult) {
    throw new Error(`${label}: send failed — ${JSON.stringify(sendRes.errorResult || sendRes)}`);
  }
  const hash = sendRes.hash;
  let getRes = await server.getTransaction(hash);
  let tries = 0;
  while (getRes.status === "NOT_FOUND" && tries < 12) {
    await new Promise((r) => setTimeout(r, 1000));
    getRes = await server.getTransaction(hash);
    tries++;
  }
  if (getRes.status !== "SUCCESS") {
    throw new Error(`${label}: tx not successful (${getRes.status})`);
  }
  onStep?.({ label, hash, status: "SUCCESS" });
  return { hash, result: getRes };
}

/**
 * Corre un flujo real y completo del escrow en Stellar Testnet, de punta a
 * punta, sin depender de ninguna wallet: genera cuentas nuevas, despliega una
 * instancia del contrato auditado, deposita, entrega y aprueba un hito.
 * onStep(evt) se invoca después de cada paso, para reportar progreso.
 */
export async function runLiveDemo(onStep = () => {}) {
  const server = srv();
  const steps = [];
  const report = (evt) => {
    steps.push(evt);
    onStep(evt);
  };

  report({ label: "Generando cuentas de Testnet", status: "RUNNING" });
  const client = Keypair.random();
  const freelancer = Keypair.random();
  await Promise.all([friendbot(client.publicKey()), friendbot(freelancer.publicKey())]);
  report({
    label: "Cuentas fondeadas",
    status: "SUCCESS",
    client: client.publicKey(),
    freelancer: freelancer.publicKey(),
  });

  const tokenId = Asset.native().contractId(Networks.TESTNET);
  const constructorArgs = [
    nativeToScVal(client.publicKey(), { type: "address" }),
    nativeToScVal(freelancer.publicKey(), { type: "address" }),
    nativeToScVal(tokenId, { type: "address" }),
    nativeToScVal(client.publicKey(), { type: "address" }), // dispute_resolver
    nativeToScVal(1209600n, { type: "u64" }),
    nativeToScVal(80, { type: "u32" }),
  ];
  const createOp = Operation.createCustomContract({
    address: new Address(freelancer.publicKey()),
    wasmHash: Buffer.from(WASM_HASH_HEX, "hex"),
    constructorArgs,
  });
  const deployTx = await buildTx(server, freelancer, [createOp]);
  const { result: deployResult } = await signSendWait(
    server,
    deployTx,
    freelancer,
    "Desplegar contrato",
    report
  );
  const contractId = scValToNative(deployResult.returnValue);
  const contract = new Contract(contractId);

  const depositOp = contract.call(
    "deposit_and_create_milestones",
    nativeToScVal([250_0000000n], { type: "i128" }),
    nativeToScVal(["demo-deliverable-spec"], { type: "string" })
  );
  const depositTx = await buildTx(server, client, [depositOp]);
  await signSendWait(server, depositTx, client, "Cliente deposita fondos", report);

  const submitOp = contract.call(
    "submit_milestone",
    nativeToScVal(0, { type: "u32" }),
    nativeToScVal(`demo-proof-${Date.now()}`, { type: "string" })
  );
  const submitTx = await buildTx(server, freelancer, [submitOp]);
  await signSendWait(server, submitTx, freelancer, "Freelancer entrega el hito", report);

  const approveOp = contract.call("approve_milestone", nativeToScVal(0, { type: "u32" }));
  const approveTx = await buildTx(server, client, [approveOp]);
  await signSendWait(server, approveTx, client, "Cliente aprueba y libera el pago", report);

  return {
    contractId,
    explorerUrl: `https://stellar.expert/explorer/testnet/contract/${contractId}`,
    client: client.publicKey(),
    freelancer: freelancer.publicKey(),
    steps,
  };
}
