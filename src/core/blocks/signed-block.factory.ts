import {Buffer} from "buffer";
import crypto from "crypto";
import {BlockFactory} from "./";

// SignedBlock: signature(64 Bytes Buffer) | payload(? Bytes Buffer)

export class SignedBlockFactory implements BlockFactory {
    private readonly publicKey: crypto.KeyObject;
    private readonly privateKey?: crypto.KeyObject;

    constructor(publicKey: Buffer, privateKey?: Buffer) {
        this.publicKey = crypto.createPublicKey({key: publicKey, format: 'der', type: 'spki'});
        if (privateKey)
            this.privateKey = crypto.createPrivateKey({key: privateKey, format: 'der', type: 'pkcs8'});
    }

    async decode(block: Uint8Array): Promise<Uint8Array | undefined> {
        const signedBlockBuffer = Buffer.from(block);

        const signature = signedBlockBuffer.subarray(0, 64)
        const payload = signedBlockBuffer.subarray(64, signedBlockBuffer.length);

        const verified = crypto.verify(null, payload, this.publicKey, signature);

        if (!verified)
            return undefined;

        return new Uint8Array(payload.buffer.slice(payload.byteOffset, payload.byteOffset + payload.byteLength));
    }

    async encode(value: Uint8Array): Promise<Uint8Array> {
        if (!this.privateKey)
            throw new Error('Trying to encode a block without proper private key');

        const payload = Buffer.from(value);
        const signature = crypto.sign(null, payload, this.privateKey);

        const signedBlockBuffer = Buffer.alloc(64 + payload.length);

        signedBlockBuffer.fill(signature, 0);
        signedBlockBuffer.fill(payload, 64);

        return new Uint8Array(signedBlockBuffer.buffer.slice(signedBlockBuffer.byteOffset, signedBlockBuffer.byteOffset + signedBlockBuffer.byteLength))
    }

}
