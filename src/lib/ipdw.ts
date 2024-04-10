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
        //const [privateKeyBuffer, publicKeyBuffer] = await CryptoUtils.GetKeyPair(Buffer.from(seed, 'utf8')); // If seed is a private key
        const [privateKeyBuffer, publicKeyBuffer] = await CryptoUtils.DeriveKeyPair(Buffer.from(seed, 'utf8'), salt);
        const publicKey = publicKeyBuffer.toString('hex');

        const keyBuffer = await CryptoUtils.DeriveKey(privateKeyBuffer, salt);

        const encryptedBlockFactory = new EncryptedBlockFactory(keyBuffer);
        const signedBlockFactory = new SignedBlockFactory(publicKeyBuffer, privateKeyBuffer);

        const privateBlockFactory = new CombinedBlockFactory([encryptedBlockFactory, signedBlockFactory]);
        const blockStorage = new BlockStorage(storageProvider, privateBlockFactory);

        const data = await MapSharded.create(blockStorage);
        const node = await Libp2pFactory.create();
        const syncProvider = new SynchronizationProvider(blockStorage, node, publicKey);

        await syncProvider.start();

        return new IPDW(data, syncProvider);
    }

}
