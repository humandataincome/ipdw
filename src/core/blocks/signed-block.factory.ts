import {Buffer} from "buffer";
import crypto from "crypto";
import {BlockFactory} from "./";
import {CryptoUtils} from "../../utils";

// SignedBlock: signature(64 Bytes Buffer) | payload(? Bytes Buffer)

export class SignedBlockFactory implements BlockFactory {
    private readonly publicKey: crypto.KeyObject | CryptoKey;
    private readonly privateKey?: crypto.KeyObject | CryptoKey;

    constructor(publicKey: crypto.KeyObject | CryptoKey, privateKey?: crypto.KeyObject | CryptoKey) {
        this.publicKey = publicKey;
        this.privateKey = privateKey;
    }

    public static async create(publicKeyBuffer: Buffer, privateKeyBuffer?: Buffer): Promise<SignedBlockFactory> {
        let publicKey: crypto.KeyObject | CryptoKey;
        let privateKey: crypto.KeyObject | CryptoKey | undefined;
        if (typeof window === 'object' || typeof importScripts === 'function') {
            // If is web use window.crypto.subtle because crypto-browserify doesn't support those methods
            publicKey = await window.crypto.subtle.importKey('spki', CryptoUtils.BufferToArrayBuffer(publicKeyBuffer), {name: 'Ed25519'}, false, ['verify']);
            if (privateKeyBuffer)
                privateKey = await window.crypto.subtle.importKey("pkcs8", CryptoUtils.BufferToArrayBuffer(privateKeyBuffer), {name: 'Ed25519'}, false, ['sign']);
        } else {
            publicKey = crypto.createPublicKey({key: publicKeyBuffer, format: 'der', type: 'spki'});
            if (privateKeyBuffer)
                privateKey = crypto.createPrivateKey({key: privateKeyBuffer, format: 'der', type: 'pkcs8'});
        }

        return new SignedBlockFactory(publicKey, privateKey);
    }

    async decode(block: Uint8Array): Promise<Uint8Array | undefined> {
        const signedBlockBuffer = Buffer.from(block);

        const signature = signedBlockBuffer.subarray(0, 64)
        const payload = signedBlockBuffer.subarray(64, signedBlockBuffer.length);

        let verified: boolean;
        if (typeof window === 'object' || typeof importScripts === 'function') {
            // If is web use window.crypto.subtle because crypto-browserify doesn't support those methods
            verified = await window.crypto.subtle.verify({name: 'Ed25519'}, this.publicKey as CryptoKey, CryptoUtils.BufferToArrayBuffer(signature), CryptoUtils.BufferToArrayBuffer(payload));
        } else {
            verified = crypto.verify(null, payload, this.publicKey as crypto.KeyObject, signature);
        }

        if (!verified)
            return undefined;

        return new Uint8Array(payload.buffer.slice(payload.byteOffset, payload.byteOffset + payload.byteLength));
    }

    async encode(value: Uint8Array): Promise<Uint8Array> {
        if (!this.privateKey)
            throw new Error('Trying to encode a block without proper private key');

        const payload = Buffer.from(value);

        let signature: Buffer;
        if (typeof window === 'object' || typeof importScripts === 'function') {
            // If is web use window.crypto.subtle because crypto-browserify doesn't support those methods
            signature = Buffer.from(await window.crypto.subtle.sign({name: 'Ed25519'}, this.privateKey as CryptoKey, CryptoUtils.BufferToArrayBuffer(payload)));
        } else {
            signature = crypto.sign(null, payload, this.privateKey as crypto.KeyObject);
        }

        const signedBlockBuffer = Buffer.alloc(64 + payload.length);

        signedBlockBuffer.fill(signature, 0);
        signedBlockBuffer.fill(payload, 64);

        return new Uint8Array(signedBlockBuffer.buffer.slice(signedBlockBuffer.byteOffset, signedBlockBuffer.byteOffset + signedBlockBuffer.byteLength))
    }

}
