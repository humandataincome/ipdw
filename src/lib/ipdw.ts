import {BlockStorage, CombinedBlockFactory, EncryptedBlockFactory, MapSharded, SignedBlockFactory, StorageProvider, SynchronizationProvider} from "../core";
import {CryptoUtils} from "../utils";
import {Buffer} from "buffer";


const SALT = Buffer.from('1Qmzz2vn', 'utf8');

export class IPDW {
    public data: MapSharded;
    public syncProvider: SynchronizationProvider;

    constructor(blockStorage: BlockStorage, syncProvider: SynchronizationProvider) {
        this.data = new MapSharded(blockStorage);
        this.syncProvider = syncProvider;
    }

    public static async create(seed: string, storageProvider: StorageProvider): Promise<IPDW> {
        const keyBuffer = await CryptoUtils.DeriveKey(Buffer.from(seed, 'utf8'), SALT);

        const [privateKeyBuffer, publicKeyBuffer] = await CryptoUtils.DeriveKeyPair(keyBuffer, SALT);
        const address = publicKeyBuffer.toString('hex'); // Can use derivation paths like m/44’/60’/0’/0/0

        const encryptedBlockFactory = new EncryptedBlockFactory(keyBuffer);
        const signedBlockFactory = new SignedBlockFactory(publicKeyBuffer, privateKeyBuffer);

        const privateBlockFactory = new CombinedBlockFactory([encryptedBlockFactory, signedBlockFactory]);
        const blockStorage = new BlockStorage(storageProvider, privateBlockFactory);

        const syncProvider = await SynchronizationProvider.create(blockStorage, address);

        return new IPDW(blockStorage, syncProvider);
    }

}
