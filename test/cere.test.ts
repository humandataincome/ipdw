import {CERE_TESTNET_INDEXER_URL, CERE_TESTNET_RPC_URL, CereStorageProvider} from "../src/core/storage/cere.storage";

async function main(): Promise<void> {
    const provider = await CereStorageProvider.Init('hybrid label reunion only dawn maze asset draft cousin height flock nation', CERE_TESTNET_RPC_URL, CERE_TESTNET_INDEXER_URL);

    try {
        await provider.setup();

        console.log('set', await provider.set("myKey", new TextEncoder().encode("myValue")))
        console.log('get', new TextDecoder().decode(await provider.get("myKey")));
        console.log('has', await provider.has("myKey"));
        console.log('ls', await provider.ls());
        console.log('clear', await provider.clear());
        console.log('has not', await provider.has("myKey"));
    } catch (e) {
        console.error(e);

        console.log('getAccountInfo', await provider.getAccountInfo())
    }

}

main()
    .then(() => process.exit(0))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
