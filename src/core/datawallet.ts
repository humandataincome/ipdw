import {CombinedPackFactory, EncryptedPackFactory, FlattenedMap, PackedStorageOverlay, SignedPackFactory, StorageProvider, VersionedStorageOverlay} from "./";
import {CryptoUtils} from "../";

export class DataWallet {
    public static async Create<StorageProviderT extends StorageProvider>(privateKey: string, storageProvider: StorageProviderT, salt: Buffer = Buffer.from('1Qmzz2vn', 'utf8')): Promise<FlattenedMap<PackedStorageOverlay<VersionedStorageOverlay<StorageProviderT>, EncryptedPackFactory, CombinedPackFactory>>> {
        const versionedOverlay = await VersionedStorageOverlay.Init(storageProvider);

        const [privateKeyBuffer, publicKeyBuffer] = await CryptoUtils.GetKeyPair(Buffer.from(privateKey.slice(2), 'hex'));
        const keyBuffer = await CryptoUtils.DeriveKey(privateKeyBuffer, salt);

        const encryptedPackFactory = new EncryptedPackFactory(keyBuffer);

        const signedPackFactory = new SignedPackFactory(publicKeyBuffer, privateKeyBuffer);
        const privatePackFactory = new CombinedPackFactory([encryptedPackFactory, signedPackFactory]);

        const packOverlay = new PackedStorageOverlay(versionedOverlay, encryptedPackFactory, privatePackFactory);

        return new FlattenedMap(packOverlay);
    }
}
