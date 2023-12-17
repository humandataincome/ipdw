import crypto from "crypto";
import * as util from "util";
import {BlockStorage, CombinedBlockFactory, EncryptedBlockFactory, MapSharded, P2PSyncProvider, SignedBlockFactory, StorageProvider} from "../core";

const SEED_MESSAGE: string = `**Important Security Notice: Please read carefully before proceeding**

Login to InterPlanetary Data Wallet - Version: 1.0.0 - Accessing Wallet Section: {{section}}

By signing this message, you are granting access to your InterPlanetary Data Wallet section. Please take note of the following:
1. **Verify URL:** Ensure that you're on a trusted website before signing this message. Phishing sites may attempt to deceive you into signing messages for malicious purposes.
2. **Keep Private:** Do not share the content of this message with anyone. This message is unique to your account and should only be used for logging in to your designated wallet section.
3. **No Expiry:** The resulting signature does not expire and will provide access to the specified wallet section indefinitely. Keep it secure.
4. **Personal Responsibility:** You are solely responsible for any actions taken using your wallet after signing this message. Be cautious and only proceed if you understand the implications.

By signing this message, you acknowledge that you have read and understood the above warnings. If you do not agree or are unsure about any aspect, DO NOT proceed with signing.`;

const OWNERSHIP_MESSAGE: string = `InterPlanetary Data Wallet Address: {{ipdwAddress}} 
has the authorization to write as
Ethereum Address: {{address}} 
on its
Section: {{section}}`;

const SALT = Buffer.from('1Qmzz2vn');

export class IPDW {
    public storage: MapSharded;

    constructor(blockStorage: BlockStorage) {
        this.storage = new MapSharded(blockStorage);
    }

    public static async create(signer: (msg: string) => Promise<string> | string, address: string, storageProvider: StorageProvider, section: string = 'Global'): Promise<IPDW> {
        const seedSignature = await signer(SEED_MESSAGE.replace('{{section}}', section));
        const keyBuffer = await util.promisify(crypto.pbkdf2)(seedSignature, SALT, 100100, 32, 'sha256');

        keyBuffer[0] &= 248;
        keyBuffer[31] &= 127;
        keyBuffer[31] |= 64;

        const privateKeyBuffer = Buffer.concat([Buffer.from('302e020100300506032b657004220420', 'hex'), keyBuffer]);
        const privateKey = crypto.createPrivateKey({key: privateKeyBuffer, format: 'der', type: 'pkcs8'});
        const publicKey = crypto.createPublicKey(privateKey);
        const publicKeyBuffer = publicKey.export({format: 'der', type: 'spki'});
        const ipdwAddress = publicKeyBuffer.toString('hex');

        const ownershipSignature = await signer(OWNERSHIP_MESSAGE.replace('{{ipdwAddress}}', ipdwAddress).replace('{{section}}', section));

        const encryptedBlockFactory = new EncryptedBlockFactory(keyBuffer);
        const signedBlockFactory = new SignedBlockFactory(publicKeyBuffer, privateKeyBuffer);

        const privateBlockFactory = new CombinedBlockFactory([encryptedBlockFactory, signedBlockFactory]);
        const blockStorage = new BlockStorage(storageProvider, privateBlockFactory);

        const syncProvider = await P2PSyncProvider.create(blockStorage, ipdwAddress);

        return new IPDW(blockStorage);
    }

}
