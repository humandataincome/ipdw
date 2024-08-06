import {PackFactory} from "./";
import {CryptoUtils} from "../../utils";

// SignedPack: signatureLength(1 Byte UInt8) | signature(72 Bytes Buffer) | payload(? Bytes Buffer)

export class SignedPackFactory implements PackFactory {
    private readonly publicKey: Buffer;
    private readonly privateKey?: Buffer;

    constructor(publicKey: Buffer, privateKey?: Buffer) {
        this.publicKey = publicKey;
        this.privateKey = privateKey;
    }

    async decode(pack: Uint8Array): Promise<Uint8Array | undefined> {
        const signedPackBuffer = Buffer.from(pack);

        const signatureLength = signedPackBuffer.readUInt8(0);
        const signature = signedPackBuffer.subarray(1, 1 + signatureLength);
        const payload = signedPackBuffer.subarray(73, signedPackBuffer.length);

        const verified = await CryptoUtils.Verify(this.publicKey, signature, payload);

        if (!verified)
            return undefined;

        return new Uint8Array(payload.buffer.slice(payload.byteOffset, payload.byteOffset + payload.byteLength));
    }

    async encode(value: Uint8Array): Promise<Uint8Array> {
        if (!this.privateKey)
            throw new Error('Trying to encode a pack without proper private key');

        const payload = Buffer.from(value);

        const signature = await CryptoUtils.Sign(this.privateKey, payload);

        const signedPackBuffer = Buffer.alloc(1 + 72 + payload.length);

        signedPackBuffer.writeUInt8(signature.length, 0);
        signedPackBuffer.fill(signature, 1);
        signedPackBuffer.fill(payload, 73);

        return new Uint8Array(signedPackBuffer.buffer.slice(signedPackBuffer.byteOffset, signedPackBuffer.byteOffset + signedPackBuffer.byteLength))
    }

}
