import {noise} from "@chainsafe/libp2p-noise";
import {yamux} from "@chainsafe/libp2p-yamux";
import {generateKeyPair, marshalPrivateKey, unmarshalPrivateKey} from "@libp2p/crypto/keys";
import {kadDHT, removePublicAddressesMapper} from "@libp2p/kad-dht";
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
import {ping} from "@libp2p/ping";
import {webTransport} from "@libp2p/webtransport";
import * as filters from '@libp2p/websockets/filters'
import * as fs from "fs";
import * as https from "https";


async function main(): Promise<void> {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        const privateKey = await generateKeyPair("Ed25519", 2048);
        const privateKeyString = toString(marshalPrivateKey(privateKey), "base64pad");
        console.log('Copy this private key', privateKeyString);
        return;
    }

    const privateKeyString = args[0];
    const privateKey = await unmarshalPrivateKey(uint8ArrayFromString(privateKeyString, "base64pad"));
    const peerId = await peerIdFromKeys(privateKey.public.bytes, privateKey.bytes);

    const server = https.createServer();

    if (args.length === 2) {
        const certificatesFolder = args[1];

        const setSecureContext = () => {
            server.setSecureContext({
                key: fs.readFileSync(certificatesFolder + 'privkey.pem'),
                cert: fs.readFileSync(certificatesFolder + 'cert.pem'),
                ca: fs.readFileSync(certificatesFolder + 'chain.pem'),
            });
        }

        if (fs.existsSync(certificatesFolder)) {
            fs.watch(certificatesFolder, {persistent: true}, setSecureContext);
            setSecureContext();
        }
    }

    const node = await createLibp2p({
        peerId,
        addresses: {
            listen: [
                '/ip4/0.0.0.0/tcp/4001',
                '/ip4/0.0.0.0/tcp/4002/ws',
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
            webSockets({filter: filters.all, server}),
            webTransport(),
        ],
        connectionEncryption: [noise()],
        streamMuxers: [yamux(), mplex()],
        connectionGater: {
            denyDialMultiaddr: () => {
                return false
            }
        },
        services: {
            identify: identify(),
            dht: kadDHT({
                protocol: '/ipdw/dht/1.0.0',
                peerInfoMapper: removePublicAddressesMapper,
                clientMode: false
            }),
            pubsub: gossipsub(),
            autoNAT: autoNAT(),
            relay: circuitRelayServer({
                advertise: true,
                reservations: {
                    maxReservations: Infinity
                }
            }),
            ping: ping(),
            upnp: uPnPNAT(),
            dcutr: dcutr(),
        }
    });

    await node.services.dht.setMode('server');

    console.info("libp2p is running");
    console.info("PeerId", node.peerId);
    console.info("MultiAddress", node.getMultiaddrs());

    node.addEventListener('connection:open', (e) => {
        console.log('connection:open', e, e.detail)
    });
    node.addEventListener('connection:close', (e) => {
        console.log('connection:close', e, e.detail)
    });
    node.addEventListener('self:peer:update', (e) => {
        console.log('self:peer:update', e, e.detail)
    });
}


main().catch(err => {
    console.error(err);
    process.exit(1);
});

