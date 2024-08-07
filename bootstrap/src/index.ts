import {Libp2pNode} from "./node.js";

async function main(): Promise<void> {
    const node = new Libp2pNode();
    await node.init(process.env.PRIVATE_KEY, process.env.DOMAIN);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
