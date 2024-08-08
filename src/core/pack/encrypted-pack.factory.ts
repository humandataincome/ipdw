import crypto from "crypto";
import {PackFactory} from "./";

// EncryptedPack: ivSalt(4 Bytes Buffer) | payload(? Bytes Buffer)

export class EncryptedPackFactory implements PackFactory {
    private readonly key: Buffer;

    constructor(key: Buffer) {
        this.key = key;
    }

    async decode(pack: Uint8Array): Promise<Uint8Array | undefined> {
        const encryptedPackBuffer = Buffer.from(pack);

        const ivSalt = encryptedPackBuffer.subarray(0, 4);
        const payload = encryptedPackBuffer.subarray(4, encryptedPackBuffer.length);

        const iv = crypto.createHash('sha256').update(this.key).update(ivSalt.toString()).digest().subarray(16);

        const decipher = crypto.createDecipheriv('aes-256-cbc', this.key, iv);
        const decryptedPayloadBuffer = Buffer.concat([decipher.update(payload), decipher.final()]);
        return new Uint8Array(decryptedPayloadBuffer.buffer.slice(decryptedPayloadBuffer.byteOffset, decryptedPayloadBuffer.byteOffset + decryptedPayloadBuffer.byteLength));
    }

    async encode(value: Uint8Array): Promise<Uint8Array> {
        const ivSalt = crypto.createHash('sha256').update(this.key).update(value).digest().subarray(0, 4);

        const iv = crypto.createHash('sha256').update(this.key).update(ivSalt.toString()).digest().subarray(16);

        const cipher = crypto.createCipheriv('aes-256-cbc', this.key, iv);
        const payload = Buffer.concat([cipher.update(Buffer.from(value)), cipher.final()]);
        const encryptedPackBuffer = Buffer.alloc(4 + payload.length);

        encryptedPackBuffer.fill(ivSalt, 0);
        encryptedPackBuffer.fill(payload, 4);

        return new Uint8Array(encryptedPackBuffer.buffer.slice(encryptedPackBuffer.byteOffset, encryptedPackBuffer.byteOffset + encryptedPackBuffer.byteLength));
    }

}
