# ipdw (InterPlanetary Data Wallet)

<img src="assets/logo.svg" width="256" alt="logo"/>

[![npm (scoped)](https://img.shields.io/npm/v/ipdw)](https://www.npmjs.com/package/ipdw) [![node-current (scoped)](https://img.shields.io/node/v/idpw)](https://www.npmjs.com/package/ipdw)

InterPlanetary Data Wallet (IPDW): store users data within a secure distributed storage.
It enables to build a real decentralised network (Web 0) without the need of centralized database.
You can take advantage of P2P interactions, database-less, conflict-free replication, and much more.
The main idea is to shard data structures in blocks and to propagate them encrypted and signed.

## Features

- Store unstructured data
- Authenticate with web3 keys
- Enjoy p2p interactions
- Deploy database-less apps
- Unlimited scalability
- Conflict-free
- And much more!

## Decentralized authentication

Everyone has a key pair, consisting of a public key and a private key, which can be saved in different formats (such as the BIP39 standard for mnemonic phrases-based deterministic key generation).

In Web 3.0 applications, your wallet address (derived from the public key) can be recognized, allowing you to act on the distributed ledger (the storage) as a well-identified identity.

## Getting Started

To get started with IPDW, you will need to follow these steps:

Install the package:

```bash
$ npm install ipdw
```

Instantiate ipdw with this interface:

```
public static async create(privateKey: string, storageProvider: StorageProvider, salt?: Buffer): Promise<IPDW>
```

Then access to "data", which is a sharded map where you can get and set in a key-value style.

The full example with auto synchronization between devices:

```js
import {IPDW, MemoryStorageProvider} from "ipdw";

// On device 1
(async function () {
    const ipdw = await IPDW.create('b577c4367d79f1a7a0c8353f7937d601758d92c35df958781d72d70f9177e52f', new MemoryStorageProvider());

    await ipdw.data.set('test1', 'hello');

    const value1 = await ipdw.data.get('test1');
    console.log('test1 value:', value1);
    // test1 value: hello

    // Run "device 2" and if reachable it will be discovered and synced
    const value2 = await ipdw.data.get('test2');
    console.log('test2 value:', value2);
    // test2 value: world
})();

// On device 2
(async function () {
    const ipdw = await IPDW.create('b577c4367d79f1a7a0c8353f7937d601758d92c35df958781d72d70f9177e52f', new MemoryStorageProvider());
    await ipdw.data.set('test2', 'world');
})();
```

## Data Wallet Principles

The InterPlanetary Data Wallet is a sophisticated mechanism for storing all kinds of data that works offline and only partially exposes the data during a transaction. The data is encrypted, so it can be safely shared without knowing the passphrase.

The wallet can be synced between all your devices using P2P communication strategies like IPFS and IPNS, and is always offline until a transaction occurs.

## Security and Design

The blockchains have different replicated and redundant ledgers and consensus algorithms, with a competition underway to find the best algorithm for increased throughput, security, and more.

Thanks to applications like Metamask/Trust, Web 3.0 users are now familiar with private key usage and management. These applications have simplified the user experience, making it easy for users to manage keys and sign messages using ECDSA.

Private keys and public keys are nearly invulnerable to attacks from computers, except for social/phishing and similar attacks. "Humans are always the vulnerable element in the chain," so it's important to always be cautious.

## Contributing

We welcome contributions to IPDW! If you would like to contribute, please follow these steps:

1. Fork the repository
2. Create a new branch for your changes
3. Commit your changes and open a pull request
4. Support

If you need help using IPDW or have any questions, please open an issue in this repository and we will be happy to assist you.

## License

This project is licensed under the Apache 2.0 License. See the [LICENSE](./LICENSE) file for details.

We hope you will join us in our mission to defeat internet data centralization!
