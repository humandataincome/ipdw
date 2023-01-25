import {create} from 'ipfs-core';

async function main() {
    const ipfs = await create({
        repo: 'ipfs-ipdw' + Math.random(),
    });
    const files = [
        {
            path: '/web/index.html',
            content: 'hello world'
        },
        {
            path: '/web/script.js',
            content: 'console.log("hi")'
        },
    ];

    console.log('PUSHING LOCAL DATA TO REMOTE');
    for (const file of files) {
        console.log(file);
        const res = await ipfs.add(file);
        console.log(res);
    }
    console.log('PUSHED LOCAL DATA TO REMOTE');
}

(async () => {
    await main();
})();
