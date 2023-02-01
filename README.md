# ipdw (InterPlanetary Data Wallet)

PDW is a repository for storing personal or user data within a safe and distributed storage. 
It enables you to build a real decentralized network (Web 4.0) without needing to be online. 
You can take advantage of P2P interactions, database-less backends, verified identities, and much more.

## Features

- Store personal or user data within a safe and distributed storage
- Build a decentralized network (Web 4.0) without needing to be online
- Enjoy P2P interactions
- Utilize database-less backends
- Verify identities
- And much more!

## Key Pair

Everyone has a key pair, consisting of a public key and a private key, which can be saved in different formats (such as the BIP39 standard for mnemonic phrases-based deterministic key generation).

In Web 3.0 applications, your wallet address (derived from the public key) can be recognized, allowing you to act on the distributed ledger (the storage) as a well-identified identity.

## Decentralization and Security

The blockchains have different replicated and redundant ledgers and consensus algorithms, with a competition underway to find the best algorithm for increased throughput, security, and more.

Thanks to applications like Metamask/Trust, Web 3.0 users are now familiar with private key usage and management. These applications have simplified the user experience, making it easy for users to manage keys and sign messages using RSA.

Private keys and public keys are nearly invulnerable to attacks from computers, except for social/phishing and similar attacks. "Humans are always the vulnerable element in the chain," so it's important to always be cautious.

## Data Wallet

The InterPlanetary Data Wallet is a sophisticated mechanism for storing all kinds of data that works offline and only partially exposes the data during a transaction. The data is encrypted, so it can be safely shared without knowing the passphrase.

The wallet can be synced between all your devices using P2P communication strategies like IPFS and IPNS, and is always offline until a transaction occurs.

## Getting Started

To get started with IPDW, you will need to follow these steps:

Clone the repository:
```bash
$ git clone https://github.com/ansi-code/ipdw.git
```

Install the required dependencies:
```bash
$ npm install
```

Start using IPDW.
```js
const web3 = new Web3(Web3.givenProvider || "https://bsc-dataseed.binance.org/");

const account = web3.eth.accounts.privateKeyToAccount("0xeffc0f0bac08c2157c8bcabfbbe71df7c96b499defcfdae2210139418618d574");
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;
console.log(account.address);

const ipdw = await IPDW.create(async (msg) => await web3.eth.sign(msg, web3.eth.defaultAccount || 0), 'Global', new MemoryStorageProvider());

const data = {hello: "world"};

console.log('PUSHING LOCAL DATA TO REMOTE', data);
const dataBuffer = Buffer.from(JSON.stringify(data), 'utf8');
await ipdw.setData(dataBuffer, 'ENCRYPTED');
await ipdw.push();
console.log('PUSHED LOCAL DATA TO REMOTE');

console.log('PULLING REMOTE DATA TO LOCAL');
await ipdw.pull();
const gotDataBuffer = await ipdw.getData('ENCRYPTED')
const gotData = JSON.parse(gotDataBuffer.toString('utf8'));
console.log('PULLED REMOTE DATA TO LOCAL', gotData);

await ipdw.addMessageListener('PLAIN', 'bla bla', console.log);
await ipdw.sendMessage('PLAIN', 'bla bla', 'Hello World');
```

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
