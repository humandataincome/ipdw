import {BlockStorage, CombinedBlockFactory, EncryptedBlockFactory, Libp2pFactory, MapSharded, SignedBlockFactory, StorageProvider, SynchronizationProvider} from "../core";
import {CryptoUtils} from "../utils";
import {Buffer} from "buffer";


export class IPDW {
    public data: MapSharded;
    public syncProvider: SynchronizationProvider;

    constructor(data: MapSharded, syncProvider: SynchronizationProvider) {
        this.data = data;
        this.syncProvider = syncProvider;
    }

    public static async create(seed: string, storageProvider: StorageProvider, salt: Buffer = Buffer.from('1Qmzz2vn', 'utf8')): Promise<IPDW> {
        const keyBuffer = await CryptoUtils.DeriveKey(Buffer.from(seed, 'utf8'), salt);

        const [privateKeyBuffer, publicKeyBuffer] = await CryptoUtils.DeriveKeyPair(keyBuffer, salt);
        const address = publicKeyBuffer.toString('hex'); // Can use derivation paths like m/44’/60’/0’/0/0

        const encryptedBlockFactory = new EncryptedBlockFactory(keyBuffer);
        const signedBlockFactory = await SignedBlockFactory.create(publicKeyBuffer, privateKeyBuffer);

        const privateBlockFactory = new CombinedBlockFactory([encryptedBlockFactory, signedBlockFactory]);
        const blockStorage = new BlockStorage(storageProvider, privateBlockFactory);

        const data = await MapSharded.create(blockStorage);
        const node = await Libp2pFactory.create();
        const syncProvider = new SynchronizationProvider(blockStorage, node, address);

        await syncProvider.start();

        return new IPDW(data, syncProvider);
    }

}
