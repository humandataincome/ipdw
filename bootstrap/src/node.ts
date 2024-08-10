import {noise} from "@chainsafe/libp2p-noise";
import {yamux} from "@chainsafe/libp2p-yamux";
import {generateKeyPair, marshalPrivateKey, unmarshalPrivateKey} from "@libp2p/crypto/keys";
import {kadDHT, KadDHT} from "@libp2p/kad-dht";
import {mplex} from "@libp2p/mplex";
import {peerIdFromKeys} from "@libp2p/peer-id";
import {tcp} from "@libp2p/tcp";
import {webSockets} from "@libp2p/websockets";
import * as Libp2p from "libp2p";
import {createLibp2p} from "libp2p";
import {autoNAT} from "@libp2p/autonat";
import {circuitRelayServer, circuitRelayTransport} from "@libp2p/circuit-relay-v2";
import {fromString as uint8ArrayFromString} from "uint8arrays/from-string";
import {toString as uint8ArrayToString} from 'uint8arrays/to-string';
import {identify, identifyPush} from "@libp2p/identify";
import {gossipsub} from "@chainsafe/libp2p-gossipsub";
import {uPnPNAT} from "@libp2p/upnp-nat";
import {dcutr} from "@libp2p/dcutr";
import {ping} from "@libp2p/ping";
import {pubsubPeerDiscovery} from "@libp2p/pubsub-peer-discovery";
import {PeerRecord, RecordEnvelope} from "@libp2p/peer-record";
import {Fetch, fetch} from "@libp2p/fetch";
import {ensureValidCertificate} from './cert.js';
import {ArrayUtils} from "./utils.js";
import type {PubSub} from "@libp2p/interface";
import * as filters from "@libp2p/websockets/filters";

import Debug from "debug";
import {Buffer} from "buffer";
import * as https from "node:https";
import {webRTC, webRTCDirect} from "@libp2p/webrtc";

const debug = Debug('ipdw:bootstrap:libp2p');

export class Libp2pNode {
    public node!: Libp2p.Libp2p<{ pubsub: PubSub, dht: KadDHT, fetch: Fetch }>;

    private static async createNode(privateKey?: string, domain?: string): Promise<any> {
        const keyPair = privateKey
            ? await unmarshalPrivateKey(uint8ArrayFromString(privateKey, "base64pad"))
            : await generateKeyPair("Ed25519", 2048);

        const peerId = await peerIdFromKeys(keyPair.public.bytes, keyPair.bytes);

        let wsConfig, announceAddresses;
        if (domain) {
            const [certInfo, _] = await ensureValidCertificate(domain);

            wsConfig = {server: https.createServer({cert: certInfo.cert, key: certInfo.key})};
            //wsConfig = {cert: certInfo.cert, key: certInfo.key} as any; // We can use also this approach

            announceAddresses = [
                `/dns4/${domain}/tcp/4002/wss`,
                `/dns4/${domain}/tcp/4001`,
            ];
        }

        const node = await createLibp2p({
            peerId: peerId,
            addresses: {
                listen: [
                    '/ip4/0.0.0.0/tcp/4001',
                    '/ip4/0.0.0.0/tcp/4002/ws',
                    '/webrtc'
                ],
                announce: announceAddresses
            },
            transports: [
                circuitRelayTransport(),
                tcp(),
                webRTC(),
                webRTCDirect(),
                webSockets({...wsConfig, filter: filters.all}),
            ],
            connectionEncryption: [noise()],
            streamMuxers: [yamux(), mplex()],
            peerDiscovery: [
                pubsubPeerDiscovery({topics: ['_peer-discovery._ipdw._pubsub']}),
            ],
            services: {
                identify: identify({protocolPrefix: 'ipdw'}),
                identifyPush: identifyPush({protocolPrefix: 'ipdw'}),
                dht: kadDHT({protocol: '/ipdw/dht/1.0.0', clientMode: false}),
                pubsub: gossipsub({fallbackToFloodsub: true, canRelayMessage: true, doPX: true, allowPublishToZeroTopicPeers: true}),
                autoNAT: autoNAT(),
                relay: circuitRelayServer({
                    reservations: {
                        maxReservations: Infinity,
                    }
                }),
                ping: ping({protocolPrefix: 'ipdw'}),
                upnp: uPnPNAT(),
                dcutr: dcutr(),
                fetch: fetch({protocolPrefix: 'ipdw'}),
            },
            connectionManager: {
                minConnections: 0,
            },
        });

        this.registerHandleFetchSubscribers(node);

        debug('p2p:started', node.peerId, node.getMultiaddrs().map((ma: any) => ma.toString()));
        debug('To reuse this Peer ID use this key', uint8ArrayToString(marshalPrivateKey({bytes: peerId.privateKey!}), "base64pad"));
    }

    private static registerHandleFetchSubscribers(node: Libp2p.Libp2p<{ pubsub: PubSub, fetch: Fetch }>): void {
        const subscribersFetchPathPrefix = '/tracker/subscribers/1.0.0/';

        node.services.fetch.registerLookupFunction(subscribersFetchPathPrefix, async (key: string) => {
            const topic = Buffer.from(key.slice(subscribersFetchPathPrefix.length), 'hex').toString('utf8');
            const peers = await Promise.all(node.services.pubsub.getSubscribers(topic).map(p => node.peerStore.get(p)));
            const peerRecordEnvelopes = await Promise.all(peers.map(p =>
                RecordEnvelope.seal(new PeerRecord({
                    peerId: p.id,
                    multiaddrs: p.addresses.map(a => a.multiaddr)
                }), node.peerId)
            ));
            const peersRecordEnvelopesData = peerRecordEnvelopes.map(pre => pre.marshal());
            return ArrayUtils.Uint8ArrayMarshal(peersRecordEnvelopesData);
        });
    }

    public async init(privateKey?: string, domain?: string): Promise<void> {
        this.node = await Libp2pNode.createNode(privateKey, domain);

        setInterval(async () => {
            debug('Checking certificate for renewal...');
            const [certInfo, changed] = await ensureValidCertificate(domain!);

            if (changed) {
                debug('Certificate renewed. Reloading node...');
                await this.node.stop();
                this.node = await Libp2pNode.createNode(privateKey, domain);
                // We could also just reload https server passed in websocket
            }
        }, 24 * 60 * 60 * 1000); // Check every 24 hours
    }
}
