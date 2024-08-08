import {noise} from "@chainsafe/libp2p-noise";
import {yamux} from "@chainsafe/libp2p-yamux";
import {generateKeyPair, marshalPrivateKey, unmarshalPrivateKey} from "@libp2p/crypto/keys";
import {KadDHT, kadDHT} from "@libp2p/kad-dht";
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
import {webRTC, webRTCDirect} from "@libp2p/webrtc";
import {identify} from "@libp2p/identify";
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

import Debug from "debug";

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

            wsConfig = {
                websocket: {
                    key: certInfo.key,
                    cert: certInfo.cert
                }
            };

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
                    '/webrtc',
                ],
                announce: announceAddresses
            },
            transports: [
                circuitRelayTransport({discoverRelays: 1}),
                tcp(),
                webRTC(),
                webRTCDirect(),
                webSockets(wsConfig),
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
                    pingTimeout: 10000,
                }),
                pubsub: gossipsub({
                    fallbackToFloodsub: true,
                    canRelayMessage: true,
                    doPX: true,
                }),
                autoNAT: autoNAT(),
                relay: circuitRelayServer({
                    maxInboundHopStreams: Infinity,
                    maxOutboundHopStreams: Infinity,
                    reservations: {
                        maxReservations: Infinity,
                        applyDefaultLimit: false,
                    }
                }),
                ping: ping({protocolPrefix: 'ipdw'}),
                upnp: uPnPNAT(),
                dcutr: dcutr(),
                fetch: fetch({protocolPrefix: 'ipdw'}),
            },
            connectionManager: {
                maxConnections: Infinity,
                minConnections: 0,
            },
        });

        this.registerHandleFetchSubscribers(node);

        await node.start();
        await node.services.dht.setMode('server');

        debug('p2p:started', node.peerId, node.getMultiaddrs().map((ma: any) => ma.toString()));
        debug('To reuse this Peer ID use this key', uint8ArrayToString(marshalPrivateKey({bytes: peerId.privateKey!}), "base64pad"));
    }

    private static registerHandleFetchSubscribers(node: Libp2p.Libp2p<{ pubsub: PubSub, fetch: Fetch }>): void {
        const subscribersFetchPathPrefix = '/tracker/subscribers/1.0.0/';

        node.services.fetch.registerLookupFunction(subscribersFetchPathPrefix, async (key: string) => {
            const topic = key.slice(subscribersFetchPathPrefix.length);
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
            }
        }, 24 * 60 * 60 * 1000); // Check every 24 hours
    }
}
