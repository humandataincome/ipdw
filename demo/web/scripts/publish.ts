import {create, globSource} from 'ipfs-http-client'

async function main() {
    const username = process.env.IPFS_USERNAME;
    const password = process.env.IPFS_PASSWORD;
    const auth = "Basic " + Buffer.from(username + ":" + password).toString("base64");
    const client = create({
        host: "ipfs-api.humandataincome.com",
        port: 443,
        protocol: "https",
        headers: {
            authorization: auth,
        },
    });

    let rootCid = "";

    for await (const file of client.addAll(globSource('./dist', '**/*'), {wrapWithDirectory: true})) {
        if (file.path === "") {
            rootCid = file.cid.toString();
        }
    }

    await client.files.cp("/ipfs/" + rootCid, "/" + Date.now())

    console.log("https://ipfs.humandataincome.com/ipfs/" + rootCid)
}

(async () => {
    await main();
})();

