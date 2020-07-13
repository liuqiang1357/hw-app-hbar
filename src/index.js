const { splitPath } = require('./util');

const CLA = 0xe0;
const INS = {
    getPublicKey: 0x02,
    signTransaction: 0x04,
};

class Hedera {
    constructor(transport, scrambleKey = "w0w") {
        this.transport = transport;
        transport.decorateAppAPIMethods(
            this,
            [
                "getPublicKey",
                "signTransaction",
            ],
            scrambleKey
        );
    }

    getPublicKey(path) {
        const P1 = 0x00;
        const P2 = 0x00;

        const payload = Buffer.alloc(4);
        payload.writeInt32LE(this.getKeyIndex(path));

        return this.transport
            .send(CLA, INS.getPublicKey, P1, P2, payload)
            .then(response => {
                const publicKey = response.slice(0, -2).toString("hex");
                return publicKey;
            });
    }

    signTransaction(path, txnHex) {
        const P1 = 0x00;
        const P2 = 0x00;

        const indexBytes = Buffer.alloc(4);
        indexBytes.writeInt32LE(this.getKeyIndex(path));

        const txnBytes = Buffer.from(txnHex, 'hex');

        const payload = Buffer.concat([indexBytes, txnBytes])

        return this.transport
            .send(CLA, INS.signTransaction, P1, P2, payload)
            .then(response => {
                const signature = response.slice(0, -2).toString("hex");
                return signature;
            })
    }

    getKeyIndex(path) {
        const paths = splitPath(path);
        if (paths.length !== 5 
            || paths[0] !== 44 + 0x80000000
            || paths[1] !== 3030 + 0x80000000
            || paths[2] < 0x80000000
            || paths[3] !== 0x80000000 
            || paths[4] !== 0x80000000) {
            throw Error("Path format should be: 44'/3030'/n'/0'/0'");
        }
        return paths[2] & 0x7fffffff;
    }
}

module.exports = Hedera;