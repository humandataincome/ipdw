import {noise} from "@chainsafe/libp2p-noise";
import {yamux} from "@chainsafe/libp2p-yamux";
import {generateKeyPair, marshalPrivateKey, unmarshalPrivateKey} from "@libp2p/crypto/keys";
import {kadDHT} from "@libp2p/kad-dht";
import {mplex} from "@libp2p/mplex";
import {peerIdFromKeys} from "@libp2p/peer-id";
import {tcp} from "@libp2p/tcp";
import {webSockets} from "@libp2p/websockets";
import {createLibp2p} from "libp2p";
import {autoNAT} from "@libp2p/autonat";
import {circuitRelayServer, circuitRelayTransport} from "@libp2p/circuit-relay-v2";
import {fromString as uint8ArrayFromString} from "uint8arrays/from-string";
import {toString} from 'uint8arrays/to-string';
import {webRTC, webRTCDirect} from "@libp2p/webrtc";
import {identify} from "@libp2p/identify";
import {gossipsub} from "@chainsafe/libp2p-gossipsub";
import {uPnPNAT} from "@libp2p/upnp-nat";
import {dcutr} from "@libp2p/dcutr";

async function main(): Promise<void> {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        const privateKey = await generateKeyPair("Ed25519", 2048);
        const privateKeyString = toString(marshalPrivateKey(privateKey), "base64pad");
        console.log('Copy this private key', privateKeyString);
        return;
    }

    const privateKeyString = args[0];
    //const privateKeyString = "CAESQO8swgDBS6fc3/8o27ErvWERJG4e9+Fgts0YFgC665eWUkjOdH5aVa0bF0BqfrlVAVJwLydZMCdBKB4NqUajwis=";
    const privateKey = await unmarshalPrivateKey(uint8ArrayFromString(privateKeyString, "base64pad"));
    const peerId = await peerIdFromKeys(privateKey.public.bytes, privateKey.bytes);

    const node = await createLibp2p({
        peerId,
        addresses: {
            listen: [
                '/ip4/0.0.0.0/tcp/4001',
                '/webrtc'
            ]
        },
        transports: [
            circuitRelayTransport({
                discoverRelays: 1
            }),
            tcp(),
            webRTC(),
            webRTCDirect(),
            webSockets()
        ],
        connectionEncryption: [noise()],
        streamMuxers: [yamux(), mplex()],
        services: {
            identify: identify(),
            dht: kadDHT({
                clientMode: false,
                protocol: '/ipdw/dht/1.0.0',
            }),
            pubsub: gossipsub(),
            autoNAT: autoNAT(),
            relay: circuitRelayServer({
                advertise: true
            }),
            upnp: uPnPNAT(),
            dcutr: dcutr(),
        }
    });

    console.info("libp2p is running");
    console.info("PeerId", node.peerId);
    console.info("MultiAddress", node.getMultiaddrs());
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});

