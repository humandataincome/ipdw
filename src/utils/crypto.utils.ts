import util from "util";
import crypto from "crypto";
import {Buffer} from "buffer";
import elliptic from "elliptic";

const ec = new elliptic.ec('secp256k1');

export class CryptoUtils {
    public static async DeriveKey(seed: Buffer, salt: Buffer): Promise<Buffer> {
        return await util.promisify(crypto.pbkdf2)(seed, salt, 100100, 32, 'sha256');
    }

    public static async GetKeyPair(privateKey: Buffer): Promise<[Buffer, Buffer]> {
        const keyPair = ec.keyFromPrivate(privateKey);
        return [Buffer.from(keyPair.getPrivate('hex'), 'hex'), Buffer.from(keyPair.getPublic('hex'), 'hex')];
    }

    public static async DeriveKeyPair(seed: Buffer, salt: Buffer): Promise<[Buffer, Buffer]> {
        const keyBuffer = await util.promisify(crypto.pbkdf2)(seed, salt, 100100, 32, 'sha256');
        return this.GetKeyPair(keyBuffer);
    }

    public static async Verify(publicKey: Buffer, signature: Buffer, payload: Buffer): Promise<boolean> {
        const hash = crypto.createHash('sha256').update(payload).digest();
        const key = ec.keyFromPublic(publicKey.toString('hex'), 'hex');
        return key.verify(hash, signature);
    }

    public static async Sign(privateKey: Buffer, payload: Buffer): Promise<Buffer> {
        const hash = crypto.createHash('sha256').update(payload).digest();
        const key = ec.keyFromPrivate(privateKey.toString('hex'), 'hex');
        return Buffer.from(key.sign(hash).toDER());
    }

    public static Uint8ArrayEquals(a: Uint8Array, b: Uint8Array): boolean {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++)
            if (a[i] !== b[i]) return false;
        return true;
    }
}
