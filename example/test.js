import Transport from '@ledgerhq/hw-transport-node-hid';
import App from '@ont-dev/hw-app-hbar';

async function test() {
  const path = "44'/3030'/1'/0'/0'";
  const transaction = '0a140a0c0894dab0f8051080d4e69f0312041896f0051202180318c0843d22020878320120721a0a180a0b0a041896f00510ff83af5f0a090a021801108084af5f';

  const transport = await Transport.create();
  const app = new App(transport);

  const publicKey = await app.getPublicKey(path);
  console.log(publicKey);

  try {
    const signature = await app.signTransaction(path, transaction);
    console.log(signature);
  } catch (error) {
    console.log(error)
  }
}

test();
