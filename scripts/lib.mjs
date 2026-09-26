import { rpc, Networks, TransactionBuilder, BASE_FEE } from "@stellar/stellar-sdk";

export const RPC_URL = "https://soroban-testnet.stellar.org";
export const NETWORK_PASSPHRASE = Networks.TESTNET;

// Hash del WASM de escrow_milestones ya auditado y subido a Stellar Testnet
// (ver DEPLOYMENT.md). No hace falta volver a compilar ni subir el contrato:
// cualquier cuenta puede desplegar una NUEVA instancia referenciando este hash.
export const WASM_HASH_HEX =
  "9376506ed445239beb653d8389e77af667cd66b0486060cc1122766bd0151940";

export function server() {
  return new rpc.Server(RPC_URL, { allowHttp: false });
}

export async function friendbot(pubkey) {
  const res = await fetch(`https://friendbot.stellar.org?addr=${encodeURIComponent(pubkey)}`);
  console.log(`  friendbot(${pubkey.slice(0, 6)}...) -> ${res.status}`);
  return res.ok;
}

export async function buildTx(srv, sourceKeypair, operations, opts = {}) {
  const account = await srv.getAccount(sourceKeypair.publicKey());
  const builder = new TransactionBuilder(account, {
    fee: opts.fee || (BASE_FEE * 10).toString(),
    networkPassphrase: NETWORK_PASSPHRASE,
  });
  for (const op of operations) builder.addOperation(op);
  return builder.setTimeout(180).build();
}

export async function signSendWait(srv, tx, signerKeypairs, label = "", opts = {}) {
  const prepared = opts.classic ? tx : await srv.prepareTransaction(tx);
  const signers = Array.isArray(signerKeypairs) ? signerKeypairs : [signerKeypairs];
  for (const kp of signers) prepared.sign(kp);
  const sendRes = await srv.sendTransaction(prepared);
  if (sendRes.status === "ERROR" || sendRes.errorResult) {
    console.error(label, "SEND ERROR", JSON.stringify(sendRes, null, 2));
    throw new Error(`${label}: send failed`);
  }
  const hash = sendRes.hash;
  let getRes = await srv.getTransaction(hash);
  let tries = 0;
  while (getRes.status === "NOT_FOUND" && tries < 30) {
    await new Promise((r) => setTimeout(r, 1500));
    getRes = await srv.getTransaction(hash);
    tries++;
  }
  console.log(`  ${label} -> ${hash} [${getRes.status}]`);
  if (getRes.status !== "SUCCESS") {
    console.error(label, "FAILED", JSON.stringify(getRes, null, 2).slice(0, 1500));
    throw new Error(`${label}: tx not successful (${getRes.status})`);
  }
  return { hash, result: getRes };
}
