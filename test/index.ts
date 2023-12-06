import {Persistence} from "../src";

async function main() {
    const persistence = await Persistence.getInstance();
    const data = await persistence.fetchOrGet("https://gateway.pinata.cloud/ipfs/QmecpDvGdWfcKw7BM4nxyEb7TB856sTY1MqY1dCR45rWjv", console.log);
    console.log(data);
}

(async () => {
    await main();
})();
