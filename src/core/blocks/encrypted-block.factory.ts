import {Buffer} from "buffer";
import crypto from "crypto";
import {BlockFactory} from "./";

// EncryptedBlock: ivSalt(4 Bytes Buffer) | payload(? Bytes Buffer)

export class EncryptedBlockFactory implements BlockFactory {
    private readonly key: Buffer;

    constructor(key: Buffer) {
        this.key = key;
    }

    async decode(block: Uint8Array): Promise<Uint8Array | undefined> {
        const encryptedBlockBuffer = Buffer.from(block);

        const ivSalt = encryptedBlockBuffer.subarray(0, 4);
        const payload = encryptedBlockBuffer.subarray(4, encryptedBlockBuffer.length);

        const iv = crypto.createHash('sha256').update(this.key).update(ivSalt.toString()).digest().subarray(16);

        const decipher = crypto.createDecipheriv('aes-256-cbc', this.key, iv);
        const decryptedPayloadBuffer = Buffer.concat([decipher.update(payload), decipher.final()]);
        return new Uint8Array(decryptedPayloadBuffer.buffer.slice(decryptedPayloadBuffer.byteOffset, decryptedPayloadBuffer.byteOffset + decryptedPayloadBuffer.byteLength));
    }

    async encode(value: Uint8Array): Promise<Uint8Array> {
        const ivSalt = crypto.randomBytes(4);
        const iv = crypto.createHash('sha256').update(this.key).update(ivSalt.toString()).digest().subarray(16);

        const cipher = crypto.createCipheriv('aes-256-cbc', this.key, iv);
        const payload = Buffer.concat([cipher.update(Buffer.from(value)), cipher.final()]);
        const encryptedBlockBuffer = Buffer.alloc(4 + payload.length);

        encryptedBlockBuffer.fill(ivSalt, 0);
        encryptedBlockBuffer.fill(payload, 4);

        return new Uint8Array(encryptedBlockBuffer.buffer.slice(encryptedBlockBuffer.byteOffset, encryptedBlockBuffer.byteOffset + encryptedBlockBuffer.byteLength));
    }

}
