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
import {toString as uint8ArrayToString} from 'uint8arrays/to-string';
import {webRTC, webRTCDirect} from "@libp2p/webrtc";
import {identify} from "@libp2p/identify";
import {gossipsub} from "@chainsafe/libp2p-gossipsub";
import {uPnPNAT} from "@libp2p/upnp-nat";
import {dcutr} from "@libp2p/dcutr";
import {ping} from "@libp2p/ping";
import {pubsubPeerDiscovery} from "@libp2p/pubsub-peer-discovery";
import {PeerRecord, RecordEnvelope} from "@libp2p/peer-record";
import {fetch} from "@libp2p/fetch";
import * as acme from 'acme-client';
import * as fs from 'fs';
import * as http from 'http';
import forge from 'node-forge';

const CERT_PATH = './data/cert.pem';
const KEY_PATH = './data/key.pem';

interface CertificateInfo {
    key: string;
    cert: string;
    expirationDate: Date;
}

async function generateOrRenewCertificate(domain: string): Promise<CertificateInfo> {
    const client = new acme.Client({
        directoryUrl: acme.directory.letsencrypt.production,
        accountKey: await acme.forge.createPrivateKey()
    });

    const [key, csr] = await acme.forge.createCsr({
        commonName: domain,
    });

    let server: http.Server | null = null;
    let challengePath: string | null = null;
    let challengeContent: string | null = null;

    const cert = await client.auto({
        csr,
        email: 'info@' + domain,
        termsOfServiceAgreed: true,
        challengePriority: ['http-01'],
        challengeCreateFn: async (authz, challenge, keyAuthorization) => {
            if (challenge.type === 'http-01') {
                challengePath = `/.well-known/acme-challenge/${challenge.token}`;
                challengeContent = keyAuthorization;

                server = http.createServer((req, res) => {
                    if (req.url === challengePath) {
                        res.writeHead(200, {'Content-Type': 'text/plain'});
                        res.end(challengeContent);
                    } else {
                        res.writeHead(404);
                        res.end();
                    }
                });

                await new Promise<void>((resolve) => {
                    server!.listen(80, () => {
                        console.log('ACME challenge server listening on port 80');
                        resolve();
                    });
                });
            }
        },
        challengeRemoveFn: async (authz, challenge, keyAuthorization) => {
            if (server) {
                await new Promise<void>((resolve) => {
                    server!.close(() => {
                        console.log('ACME challenge server closed');
                        resolve();
                    });
                });
                server = null;
            }
            challengePath = null;
            challengeContent = null;
        },
    });

    console.log('Certificate generated', cert);

    const expirationDate = parseCertificateExpirationDate(cert)!;

    return {
        key: key.toString(),
        cert,
        expirationDate
    };
}

function parseCertificateExpirationDate(certPem: string): Date | null {
    try {
        const certDer = forge.util.decode64(certPem.replace(/-----BEGIN CERTIFICATE-----|-----END CERTIFICATE-----|[\r\n]/g, ''));
        const certAsn1 = forge.asn1.fromDer(certDer);
        const cert = forge.pki.certificateFromAsn1(certAsn1);
        return cert.validity.notAfter;
    } catch (error) {
        console.error('Error parsing certificate:', error);
        return null;
    }
}

async function ensureValidCertificate(domain: string): Promise<CertificateInfo> {
    let certInfo: CertificateInfo;

    if (fs.existsSync(CERT_PATH) && fs.existsSync(KEY_PATH)) {
        const cert = fs.readFileSync(CERT_PATH, 'utf-8');
        const key = fs.readFileSync(KEY_PATH, 'utf-8');
        const expirationDate = parseCertificateExpirationDate(cert)!;

        certInfo = {cert, key, expirationDate};

        console.log('loaded cert', certInfo);

        // If the certificate expires in less than 30 days, renew it
        if (expirationDate.getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000) {
            console.log('Certificate expiring soon. Renewing...');
            certInfo = await generateOrRenewCertificate(domain);
        }
    } else {
        console.log('No existing certificate found. Generating new one...');
        certInfo = await generateOrRenewCertificate(domain);
    }

    // Save the certificate and key
    fs.writeFileSync(CERT_PATH, certInfo.cert);
    fs.writeFileSync(KEY_PATH, certInfo.key);

    return certInfo;
}

async function createNode(peerId: any, wsConfig: any, announceAddresses: any) {
    return await createLibp2p({
        peerId,
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
}

async function main(): Promise<void> {
    const privateKey = process.env.PRIVATE_KEY
        ? await unmarshalPrivateKey(uint8ArrayFromString(process.env.PRIVATE_KEY, "base64pad"))
        : await generateKeyPair("Ed25519", 2048);

    const peerId = await peerIdFromKeys(privateKey.public.bytes, privateKey.bytes);

    let wsConfig: any = {};
    let announceAddresses: string[] = [];
    let node: any;

    async function setupNode() {
        if (process.env.DOMAIN) {
            const domain = process.env.DOMAIN;
            const certInfo = await ensureValidCertificate(domain);

            wsConfig = {
                key: certInfo.key,
                cert: certInfo.cert
            };

            announceAddresses = [
                `/dns4/${domain}/tcp/4002/wss`,
                `/dns4/${domain}/tcp/4001`,
            ];
        }

        if (node) {
            await node.stop();
        }

        node = await createNode(peerId, wsConfig, announceAddresses);
        await node.start();

        await node.services.dht.setMode('server');

        node.services.fetch.registerLookupFunction('/tracker/subscribers/1.0.0/', async (key: string) => {
            const topic = key.slice('/tracker/subscribers/1.0.0/'.length);
            const peers = await Promise.all(node.services.pubsub.getSubscribers(topic).map((p: any) => node.peerStore.get(p)));
            const peerRecordEnvelopes = await Promise.all(peers.map(p => RecordEnvelope.seal(new PeerRecord({
                peerId: p.id,
                multiaddrs: p.addresses.map((a: any) => a.multiaddr),
            }), node.peerId)));
            return marshalUint8Array(peerRecordEnvelopes.map(pre => pre.marshal()));
        });

        node.addEventListener("connection:open", (event: any) => {
            console.log("connection:open", node.peerId, event.detail.remoteAddr);
        });
        node.addEventListener("connection:close", (event: any) => {
            console.log("connection:close", node.peerId, event.detail.remoteAddr);
        });
        node.addEventListener("peer:update", (event: any) => {
            //console.log("peer:update", node.peerId, event.detail.peer.id, event.detail.peer.addresses);
        });
        node.addEventListener("peer:discovery", (event: any) => {
            console.log("peer:discovery", node.peerId, event.detail, event.detail.id, event.detail.multiaddrs);
        });
        node.addEventListener("peer:connect", (event: any) => {
            console.log("peer:connect", node.peerId, event.detail);
        });

        console.log('p2p:started', node.peerId, node.getMultiaddrs().map((ma: any) => ma.toString()));
    }

    await setupNode();

    if (process.env.DOMAIN) {
        const domain = process.env.DOMAIN;

        // Schedule certificate renewal
        setInterval(async () => {
            console.log('Checking certificate for renewal...');
            const newCertInfo = await ensureValidCertificate(domain);

            // If the certificate has been renewed, reload the node
            if (newCertInfo.cert !== wsConfig.tls.cert) {
                console.log('Certificate renewed. Reloading node...');
                await setupNode();
            }
        }, 24 * 60 * 60 * 1000); // Check every 24 hours
    }

    console.log('To reuse this Peer ID use this key', uint8ArrayToString(marshalPrivateKey(privateKey), "base64pad"));
}

function marshalUint8Array(arrays: Uint8Array[]): Uint8Array {
    const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
    const totalByteLength = 4 + totalLength + (4 * arrays.length);
    const result = new Uint8Array(totalByteLength);
    const view = new DataView(result.buffer);

    view.setUint32(0, arrays.length, true);
    let offset = 4;

    arrays.forEach(arr => {
        view.setUint32(offset, arr.length, true);
        offset += 4;
        result.set(arr, offset);
        offset += arr.length;
    });

    return result;
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
