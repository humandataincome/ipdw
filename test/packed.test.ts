import {CryptoUtils, EncryptedPackFactory, FileSystemStorageProvider, PackedStorageOverlay} from "../src";
import {Buffer} from "buffer";

async function main(): Promise<void> {
    const storage = new FileSystemStorageProvider();

    const keyBuffer = await CryptoUtils.DeriveKey(Buffer.from('supersecret'), Buffer.from('salt'));
    const encryptedPackFactory = new EncryptedPackFactory(keyBuffer);

    const provider = new PackedStorageOverlay(storage, encryptedPackFactory, encryptedPackFactory);

    console.log('set', await provider.set("myKey", new TextEncoder().encode("myValue")))
    console.log('get', new TextDecoder().decode(await provider.get("myKey")));
    console.log('has', await provider.has("myKey"));
    console.log('ls', await provider.ls());
}

main()
    .then(() => process.exit(0))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
