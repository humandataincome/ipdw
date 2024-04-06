import util from "util";
import crypto from "crypto";

export class CryptoUtils {
    public static async DeriveKey(seed: Buffer, salt: Buffer): Promise<Buffer> {
        return await util.promisify(crypto.pbkdf2)(seed, salt, 100100, 32, 'sha256');
    }

    public static async DeriveKeyPair(seed: Buffer, salt: Buffer): Promise<[Buffer, Buffer]> {
        const keyBuffer = await util.promisify(crypto.pbkdf2)(seed, salt, 100100, 32, 'sha256');

        keyBuffer[0] &= 248;
        keyBuffer[31] &= 127;
        keyBuffer[31] |= 64;
        const privateKeyBuffer = Buffer.concat([Buffer.from('302e020100300506032b657004220420', 'hex'), keyBuffer]);
        const privateKey = crypto.createPrivateKey({key: privateKeyBuffer, format: 'der', type: 'pkcs8'});
        const publicKey = crypto.createPublicKey(privateKey);
        const publicKeyBuffer = publicKey.export({format: 'der', type: 'spki'});
        return [privateKeyBuffer, publicKeyBuffer];
    }

    public static Uint8ArrayEquals(a: Uint8Array, b: Uint8Array): boolean {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++)
            if (a[i] !== b[i]) return false;
        return true;
    }
}
