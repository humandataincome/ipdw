import {Buffer} from "buffer";
import {CryptoUtils} from "../src";

async function main(): Promise<void> {
    const [privateKey, publicKey] = await CryptoUtils.DeriveKeyPair(Buffer.from('password', 'utf8'), Buffer.from('53DAFv6x', 'utf8'));

    const payload = Buffer.from('hello', 'utf8');
    const signature = await CryptoUtils.Sign(privateKey, payload);
    console.log('signature', signature);
    const verified  = await CryptoUtils.Verify(publicKey, signature, payload);
    console.log('verified', verified);
    const notPayload = Buffer.from('hello1', 'utf8');
    const notVerified  = await CryptoUtils.Verify(publicKey, signature, notPayload);
    console.log('notVerified', notVerified);
}

(async () => {
    await main();
})();
