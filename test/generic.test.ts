import {create} from "ipfs-core";

async function main() {
    /*
const ipdw = await IPDW.create(async (msg: string) => "aaaaa", 'Globala', new MemoryStorageProvider());
await ipdw.addMessageListener('PLAIN', 'bla bla', console.log);
await ipdw.sendMessage('PLAIN', 'bla bla', 'Hello World');
 */

    const node = await create({
        //repo: 'ipfs-ipdw' + Math.random(),
        config: {
            Addresses: {
                Swarm: [
                    "/dns4/ipfs.humandataincome.com/tcp/4003/wss",
                ]
            }
        }
    })

    console.log("initialized")
    // Need metadata file
    for await (const file of node.ls("/ipfs/" + "Qmdzb3MYr9oFCy2mNKz7siKQEbvEhYZiG86KuFhvp6N5sP")) {
        console.log(file.path)
    }

    const res = await node.files.stat("/ipfs/" + "Qmdzb3MYr9oFCy2mNKz7siKQEbvEhYZiG86KuFhvp6N5sP");


    console.log(res);

    //add has progress

    let content = new Uint8Array(res.size)
    let offset = 0;

    for await (const chunk of node.cat("/ipfs/" + "Qmdzb3MYr9oFCy2mNKz7siKQEbvEhYZiG86KuFhvp6N5sP")) {
        console.log(chunk.length)
        console.log(chunk.byteOffset)
        console.log(offset)
        content.set(chunk, offset);
        offset += chunk.length;
    }

    console.log(content.length);
}

(async () => {
    await main();
})();

