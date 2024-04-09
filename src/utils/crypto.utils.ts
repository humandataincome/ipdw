import util from "util";
import crypto from "crypto";
import {Buffer} from "buffer";


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

        let publicKeyBuffer: Buffer;
        if (typeof window === 'object' || typeof importScripts === 'function') {
            // If is web use window.crypto.subtle because crypto-browserify doesn't support those methods
            const privateKey = await window.crypto.subtle.importKey("pkcs8", this.BufferToArrayBuffer(privateKeyBuffer), {name: "Ed25519"}, true, ['sign']);
            const intermediateJwkKey = await window.crypto.subtle.exportKey("jwk", privateKey);
            delete intermediateJwkKey.d;
            intermediateJwkKey.key_ops = ["verify"];
            const publicKey = await window.crypto.subtle.importKey("jwk", intermediateJwkKey, {name: 'Ed25519'}, true, ['verify']);
            publicKeyBuffer = Buffer.from(await window.crypto.subtle.exportKey("spki", publicKey));

        } else {
            const privateKey = crypto.createPrivateKey({key: privateKeyBuffer, format: 'der', type: 'pkcs8'});
            const publicKey = crypto.createPublicKey(privateKey);
            publicKeyBuffer = publicKey.export({format: 'der', type: 'spki'});
        }

        return [privateKeyBuffer, publicKeyBuffer];
    }

    public static BufferToArrayBuffer(buffer: Buffer): ArrayBuffer {
        const arrayBuffer = new ArrayBuffer(buffer.length);
        const view = new Uint8Array(arrayBuffer);
        for (let i = 0; i < buffer.length; ++i) {
            view[i] = buffer[i];
        }
        return arrayBuffer;
    }

    public static Uint8ArrayEquals(a: Uint8Array, b: Uint8Array): boolean {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++)
            if (a[i] !== b[i]) return false;
        return true;
    }
}
