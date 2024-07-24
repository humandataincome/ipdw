import {AlgorandStorageProvider} from "../src";

async function main(): Promise<void> {
    const provider = new AlgorandStorageProvider(
        "",
        "https://testnet-algorand.api.purestake.io/ps2",
        "",
        1,
        ""
    );

    await provider.set("myKey", new TextEncoder().encode("myValue"));
    const value = await provider.get("myKey");
    console.log(new TextDecoder().decode(value));
}

(async () => {
    await main();
})();
