import Transport from '@ledgerhq/hw-transport-node-hid';
import App from '@ont-dev/hw-app-hbar';
import { Ed25519PublicKey, Transaction } from '@hashgraph/sdk';

async function test() {
  const path = "44'/3030'/1'/0'/0'";
  const transactionHex = '1a0022410a130a0b08aac3baf80510e0a2ff2a1204189a8506120218041880c2d72f220308f001721c0a1a0a0b0a04189a850610ff83af5f0a0b0a0418cabe05108084af5f';
  const transaction = Transaction.fromBytes(Uint8Array.from(Buffer.from(transactionHex, 'hex')))

  const transport = await Transport.create();
  const app = new App(transport);

  const publicKeyHex = await app.getPublicKey(path);
  const publicKey = Ed25519PublicKey.fromString(publicKeyHex);
  console.log(publicKeyHex);

  transaction.signWith(publicKey, async array => {
    return app.signTransaction(path, Buffer.from(array).toString('hex'))
  });
  console.log(Buffer.from(transaction.toBytes()).toString('hex'));
}

test().catch(console.error);
