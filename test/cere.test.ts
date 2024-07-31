import {CereStorageProvider} from "../src";

async function main(): Promise<void> {
    const provider = await CereStorageProvider.Init('b577c4367d79f1a7a0c8353f7937d601758d92c35df958781d72d70f9177e52f');

    await provider.set("myKey", new TextEncoder().encode("myValue"));
    const value = await provider.get("myKey");
    console.log(new TextDecoder().decode(value));
}

main()
    .then(() => process.exit(0))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
