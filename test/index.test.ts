import {DataWallet, IPDWStorageProvider, MemoryStorageProvider} from "../src";

async function startNode(): Promise<void> {
    //const provider = new FileSystemStorageProvider();
    //const compressedProvider = await CompressedOverlay.Init(provider);
    //const provider = await AlgorandStorageProvider.Init('0xb577c4367d79f1a7a0c8353f7937d601758d92c35df958781d72d70f9177e52f', ALGORAND_TESTNET_SERVER_URL, ALGORAND_TESTNET_INDEXER_URL);
    //const provider = await BNBGreenfieldStorageProvider.Init('0xb577c4367d79f1a7a0c8353f7937d601758d92c35df958781d72d70f9177e52f', GREENFIELD_TESTNET_CHAIN_RPC_URL, GREENFIELD_TESTNET_CHAIN_ID);
    //const provider = await CereStorageProvider.Init('hybrid label reunion only dawn maze asset draft cousin height flock nation', CERE_TESTNET_RPC_URL, CERE_TESTNET_INDEXER_URL);
    const provider = await IPDWStorageProvider.Init('0xb577c4367d79f1a7a0c8353f7937d601758d92c35df958781d72d70f9177e52f', new MemoryStorageProvider());

    const dataWallet = await DataWallet.Create('0xb577c4367d79f1a7a0c8353f7937d601758d92c35df958781d72d70f9177e52f', provider);

    setInterval(async () => {
        try {
            const randomString = (Math.random() + 1).toString(36).substring(2);
            await dataWallet.set(randomString, 'value');
            console.log('keys', JSON.stringify(await dataWallet.keys()));
        } catch (e) {
            console.error(e);
        }
    }, 1000);
}

async function main(): Promise<void> {
    await startNode();
    await startNode();
}

main()
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

