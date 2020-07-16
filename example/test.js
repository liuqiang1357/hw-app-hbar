import Transport from '@ledgerhq/hw-transport-node-hid';
import App from '@ont-dev/hw-app-hbar';
import { Ed25519PublicKey, Transaction } from '@hashgraph/sdk';

async function signTransaction(app, path, transactionHex) {
  const publicKeyHex = await app.getPublicKey(path);
  const publicKey = Ed25519PublicKey.fromString(publicKeyHex);
  console.log('publicKeyHex:', publicKeyHex);

  const transaction = Transaction.fromBytes(Buffer.from(transactionHex, 'hex'));
  await transaction.signWith(publicKey, async array => {
    const signatureHex = await app.signTransaction(path, Buffer.from(array).toString('hex'));
    return Buffer.from(signatureHex, 'hex');
  });
  const signedTransactionHex = Buffer.from(transaction.toBytes()).toString('hex');
  console.log('signedTransactionHex:', signedTransactionHex);

  return signedTransactionHex;
}

async function test() {
  const path0 = "44'/3030'/0'/0'/0'";
  const path1 = "44'/3030'/1'/0'/0'";
  const path2 = "44'/3030'/2'/0'/0'";
  const path3 = "44'/3030'/3'/0'/0'";
  let transactionHex = '1a0022410a130a0b08aac3baf80510e0a2ff2a1204189a8506120218041880c2d72f220308f001721c0a1a0a0b0a04189a850610ff83af5f0a0b0a0418cabe05108084af5f';

  const transport = await Transport.create();
  const app = new App(transport);

  transactionHex = await signTransaction(app, path0, transactionHex);
  transactionHex = await signTransaction(app, path1, transactionHex);
  transactionHex = await signTransaction(app, path2, transactionHex);
  transactionHex = await signTransaction(app, path3, transactionHex);
  console.log('result:', transactionHex);
}

test().catch(console.error);
