import {Buffer} from "buffer";
import {BlockFactory} from "./";
import {CryptoUtils} from "../../utils";

// SignedBlock: signatureLength(1 Byte UInt8) | signature(72 Bytes Buffer) | payload(? Bytes Buffer)

export class SignedBlockFactory implements BlockFactory {
    private readonly publicKey: Buffer;
    private readonly privateKey?: Buffer;

    constructor(publicKey: Buffer, privateKey?: Buffer) {
        this.publicKey = publicKey;
        this.privateKey = privateKey;
    }

    async decode(block: Uint8Array): Promise<Uint8Array | undefined> {
        const signedBlockBuffer = Buffer.from(block);

        const signatureLength = signedBlockBuffer.readUInt8(0);
        const signature = signedBlockBuffer.subarray(1, 1 + signatureLength);
        const payload = signedBlockBuffer.subarray(73, signedBlockBuffer.length);

        const verified = await CryptoUtils.Verify(this.publicKey, signature, payload);

        if (!verified)
            return undefined;

        return new Uint8Array(payload.buffer.slice(payload.byteOffset, payload.byteOffset + payload.byteLength));
    }

    async encode(value: Uint8Array): Promise<Uint8Array> {
        if (!this.privateKey)
            throw new Error('Trying to encode a block without proper private key');

        const payload = Buffer.from(value);

        const signature = await CryptoUtils.Sign(this.privateKey, payload);

        const signedBlockBuffer = Buffer.alloc(1 + 72 + payload.length);

        signedBlockBuffer.writeUInt8(signature.length, 0);
        signedBlockBuffer.fill(signature, 1);
        signedBlockBuffer.fill(payload, 73);

        return new Uint8Array(signedBlockBuffer.buffer.slice(signedBlockBuffer.byteOffset, signedBlockBuffer.byteOffset + signedBlockBuffer.byteLength))
    }

}
