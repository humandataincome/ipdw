import {Libp2pFactory, SwarmsubService} from "../src";


async function runNode1() {
    const node = await Libp2pFactory.create();
    const swarm = new SwarmsubService(node);
    await swarm.subscribe('ipdw-test-1');
}

async function runNode2() {
    const node = await Libp2pFactory.create();
    const swarm = new SwarmsubService(node);
    await swarm.setSubscriptionListener('ipdw-test-1', async (p) => console.log(p));
}

async function main(): Promise<void> {
    await runNode1();
    await runNode2();
}

(async () => {
    await main();
})();
