import {BNBGreenfieldStorageProvider, GREENFIELD_TESTNET_CHAIN_ID, GREENFIELD_TESTNET_CHAIN_RPC_URL} from "../src";

async function main(): Promise<void> {
    const provider = await BNBGreenfieldStorageProvider.Init('0xb577c4367d79f1a7a0c8353f7937d601758d92c35df958781d72d70f9177e52f', GREENFIELD_TESTNET_CHAIN_RPC_URL, GREENFIELD_TESTNET_CHAIN_ID);

    console.log('set', await provider.set("myKey", new TextEncoder().encode("myValue")))
    console.log('get', new TextDecoder().decode(await provider.get("myKey")));
    console.log('has', await provider.has("myKey"));
    console.log('ls', await provider.ls());
    console.log('clear', await provider.clear());
    console.log('has not', await provider.has("myKey"));
}

main()
    .then(() => process.exit(0))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
