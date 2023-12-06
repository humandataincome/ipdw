import {FileSystemStorageProvider} from "../core";
import {HashUtils} from "../utils";
import crypto from "crypto";
import {BlockStorage} from "./core/blocks/block.storage";
import {Relay} from "./core/protocol/relay";
import {EncryptedBlockFactory} from "./core/blocks/encrypted-block.factory";
import {SignedBlockFactory} from "./core/blocks/signed-block.factory";
import {MapSharded} from "./core/structs/map.sharded";
import {CombinedBlockFactory} from "./core/blocks/combined-block.factory";
import {PlainBlockFactory} from "./core/blocks/plain-block.factory";
import Web3 from "web3";


async function main0() {
    const privateKey = '0xb0f184133811fd8a55cace6f8c850ed4736e08a5d055371421535063f4a8d6d9';

    const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID'));

    try {
        // Get the Ethereum address associated with the private key
        const account = web3.eth.accounts.privateKeyToAccount(privateKey);
        const fromAddress = account.address;

        // Message to be signed
        const messageToSign = 'Hello, World';

        // Sign the message
        const signature = web3.eth.accounts.sign(messageToSign, privateKey);

        console.log('Address:', fromAddress);
        console.log('Signature:', signature.signature);
    } catch (error) {
        console.error('Error:', error);
    }
}
async function main1() {
    const masterPassword = '531kLbt7mzSRJoVkeRYt';
    const SALT = Buffer.from('1Qmzz2vn');

    const keyBuffer = await HashUtils.pbkdf2(masterPassword, SALT, 100100, 32, 'sha256');

    keyBuffer[0] &= 248;
    keyBuffer[31] &= 127;
    keyBuffer[31] |= 64;

    console.log(keyBuffer);

    const privateKeyBuffer = Buffer.concat([Buffer.from('302e020100300506032b657004220420', 'hex'), keyBuffer]);
    console.log(privateKeyBuffer);
    const publicKeyBuffer = crypto.createPublicKey(crypto.createPrivateKey({key: privateKeyBuffer, format: 'der', type: 'pkcs8'})).export({format: 'der', type: 'spki'});

    //const storageProvider = new MemoryStorageProvider();
    const storageProvider = new FileSystemStorageProvider();

    const encryptedBlockFactory = new EncryptedBlockFactory(keyBuffer);
    const signedBlockFactory = new SignedBlockFactory(publicKeyBuffer, privateKeyBuffer);

    const privateBlockFactory = new CombinedBlockFactory([encryptedBlockFactory, signedBlockFactory]);
    const blockStorage = new BlockStorage(storageProvider, privateBlockFactory);

    const plainBlock = new Uint8Array([1, 4, 6]);
    console.log('plainBlock', plainBlock);
    const encryptedBlock = await encryptedBlockFactory.encode(plainBlock);
    console.log('encryptedBlock', encryptedBlock);
    const signedBlock = await signedBlockFactory.encode(encryptedBlock);
    console.log('signedBlock', signedBlock);

    await blockStorage.insert(0, signedBlock);

    const savedBlock = await blockStorage.get(0);
    console.log('savedBlock', savedBlock);
    const verifiedBlock = await signedBlockFactory.decode(savedBlock!);
    console.log('verifiedBlock', verifiedBlock);
    const decryptedBlock = await encryptedBlockFactory.decode(verifiedBlock!);
    console.log('decryptedBlock', decryptedBlock);
}

async function main2() {
    const storageProvider = new FileSystemStorageProvider();
    const plainBlockFactory = new PlainBlockFactory();
    const blockStorage = new BlockStorage(storageProvider, plainBlockFactory);

    blockStorage.events.addEventListener('insert', e => console.log('insert', e.detail!.index, e.detail!.value));
    blockStorage.events.addEventListener('delete', e => console.log('delete', e.detail!.index));

    const mapSharded = new MapSharded(blockStorage);
    await mapSharded.set('test', '12345');

}

async function main() {
    const relay = new Relay();
    await relay.test();
}

(async () => {
    await main0();
})();
