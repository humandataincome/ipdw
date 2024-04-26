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
import {ping} from "@libp2p/ping";
import * as fs from "fs";
import * as https from "https";
import {pubsubPeerDiscovery} from "@libp2p/pubsub-peer-discovery";
import {PeerRecord, RecordEnvelope} from "@libp2p/peer-record";
import {fetch} from "@libp2p/fetch";
import * as http from "http";


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

    let server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse> | https.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;

    if (args.length === 2) {
        server = https.createServer();

        const certificatesFolder = args[1];

        const setSecureContext = () => {
            (server as https.Server<typeof http.IncomingMessage, typeof http.ServerResponse>).setSecureContext({
                key: fs.readFileSync(certificatesFolder + 'privkey.pem'),
                cert: fs.readFileSync(certificatesFolder + 'cert.pem'),
                ca: fs.readFileSync(certificatesFolder + 'chain.pem'),
            });
        }

        if (fs.existsSync(certificatesFolder)) {
            fs.watch(certificatesFolder, {persistent: true}, setSecureContext);
            setSecureContext();
        }
    } else {
        server = http.createServer();
    }

    const node = await createLibp2p({
        /*
        datastore: await (async () => {
            const d = new FsDatastore('.datastore');
            await d.open();
            return d;
        })(), // Disable for local testing
         */
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
            webSockets({websocket: {rejectUnauthorized: false}, server}),
        ],
        connectionEncryption: [noise()],
        streamMuxers: [yamux(), mplex()],
        peerDiscovery: [
            pubsubPeerDiscovery({topics: ['_peer-discovery._ipdw._pubsub']}),
        ],
        services: {
            identify: identify({protocolPrefix: 'ipdw'}),
            dht: kadDHT({
                protocol: '/ipdw/dht/1.0.0',
                clientMode: false,
                kBucketSize: 1024,
                pingTimeout: 10000
            }),
            pubsub: gossipsub({fallbackToFloodsub: true, canRelayMessage: true, doPX: true}),
            autoNAT: autoNAT(),
            relay: circuitRelayServer({
                advertise: true,
                maxInboundHopStreams: Infinity,
                maxOutboundHopStreams: Infinity,
                reservations: {
                    maxReservations: Infinity,
                    applyDefaultLimit: false
                }
            }),
            ping: ping({protocolPrefix: 'ipdw'}),
            upnp: uPnPNAT(),
            dcutr: dcutr(),
            fetch: fetch({protocolPrefix: 'ipdw'})
        },
        connectionManager: {
            minConnections: 0
        },
    });

    await node.services.dht.setMode('server');

    node.services.fetch.registerLookupFunction('/tracker/subscribers/', async (key: string) => {
        const topic = key.slice('/tracker/subscribers/'.length);
        const peers = await Promise.all(node.services.pubsub.getSubscribers(topic).map(p => node.peerStore.get(p)));
        const peerRecordEnvelopes = await Promise.all(peers.map(p => RecordEnvelope.seal(new PeerRecord({peerId: p.id, multiaddrs: p.addresses.map(a => a.multiaddr)}), node.peerId)));
        const peersRecordEnvelopesData = peerRecordEnvelopes.map(pre => pre.marshal());
        return Uint8ArrayMarshal(peersRecordEnvelopesData);
    });

    node.addEventListener("connection:open", (event) => {
        console.log("connection:open", node.peerId, event.detail.remoteAddr);
    });
    node.addEventListener("connection:close", (event) => {
        console.log("connection:close", node.peerId, event.detail.remoteAddr);
    });
    node.addEventListener("peer:update", (event) => {
        //console.log("peer:update", node.peerId, event.detail.peer.id, event.detail.peer.addresses);
    });
    node.addEventListener("peer:discovery", (event) => {
        console.log("peer:discovery", node.peerId, event.detail, event.detail.id, event.detail.multiaddrs);
    });
    node.addEventListener("peer:connect", (event) => {
        console.log("peer:connect", node.peerId, event.detail);
    });

    console.log('p2p:started', node.peerId, node.getMultiaddrs());
}

function Uint8ArrayMarshal(array: Uint8Array[]): Uint8Array {
    // Calculate total length of all Uint8Arrays in the array
    let totalLength = 0;
    for (const arr of array) {
        totalLength += arr.length;
    }

    // Calculate the total length of the marshalled data including the length prefixes
    const totalByteLength = 4 + totalLength + (4 * array.length);

    // Allocate a new Uint8Array with the total length
    const result = new Uint8Array(totalByteLength);

    // Write the number of arrays as a 32-bit integer at the beginning
    new DataView(result.buffer).setUint32(0, array.length, true);
    let offset = 4;

    // For each array, write its length as a 32-bit integer followed by its data
    for (const arr of array) {
        new DataView(result.buffer).setUint32(offset, arr.length, true);
        offset += 4;
        result.set(arr, offset);
        offset += arr.length;
    }

    return result;
}


main().catch(err => {
    console.error(err);
    process.exit(1);
});

