import * as crypto from 'crypto';
import forge from "node-forge";
import {KeyPair} from "./keypair";

/*
    Asymmetric encryption wrapper
 */

export class E2EManager {
    public static generateKeyPair(seed?: string): KeyPair {
        let privateKey, publicKey;

        const rng = forge.random.createInstance();

        if (seed) {
            const md = forge.md.sha256.create();
            md.update(seed);
            const seedHash = md.digest().toHex();
            rng.seedFileSync = () => seedHash
        }

        const keyPair = forge.pki.rsa.generateKeyPair({bits: 2048, e: 0x10001, prng: rng});

        privateKey = forge.pki.privateKeyToPem(keyPair.privateKey);
        publicKey = forge.pki.publicKeyToPem(keyPair.publicKey);

        return new KeyPair(privateKey, publicKey);
    }

    public static decrypt(encrypted: string, privateKey: string): string {
        try {
            const keyPair = new KeyPair('', privateKey).deflate();
            return crypto.privateDecrypt(Buffer.from(keyPair.privateKey), Buffer.from(encrypted, 'base64')).toString('utf8');
        } catch (e) {
            throw new Error('Invalid encryption');
        }
    }

    public static encrypt(decrypted: string, publicKey: string): string {
        try {
            const keyPair = new KeyPair(publicKey, '').deflate();
            return crypto.publicEncrypt(Buffer.from(keyPair.publicKey), Buffer.from(decrypted, 'utf8')).toString('base64');
        } catch (e) {
            throw new Error('Invalid encryption');
        }
    }

    public static test(keyPair: KeyPair): boolean {
        try {
            return this.decrypt(this.encrypt('test', keyPair.publicKey), keyPair.privateKey) == 'test';
        } catch (e) {
            return false;
        }
    }
}
