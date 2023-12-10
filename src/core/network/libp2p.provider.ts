import * as Y from 'yjs'
import type {Libp2p} from "@libp2p/interface";
import type {Stream} from '@libp2p/interface/src/connection';
import type {IncomingStreamData} from '@libp2p/interface/src/stream-handler';
import {GossipSub} from "@chainsafe/libp2p-gossipsub";
import {PeerId} from "@libp2p/interface/src/peer-id";


function changesTopic(topic: string): string {
    return `/ipdw/${topic}/changes/1.0.0`
}

function stateVectorTopic(topic: string): string {
    return `/ipdw/${topic}/stateVector/1.0.0`
}

function syncProtocol(topic: string): string {
    return `/ipdw/${topic}/sync/1.0.0`
}

export class Libp2pProvider {
    ydoc: Y.Doc;
    node: Libp2p<{ pubsub: GossipSub }>;
    peerID: string;
    topic: string
    stateVectors: { [key: string]: Uint8Array } = {};
    unsyncedPeers: Set<PeerId> = new Set();
    initialSync = false;


    aggressivelyKeepPeersUpdated: boolean = true;

    constructor(ydoc: Y.Doc, node: Libp2p<{ pubsub: GossipSub }>, topic: string) {
        this.ydoc = ydoc;
        this.node = node;
        this.topic = topic;
        this.peerID = this.node.peerId.toString()
        this.stateVectors[this.peerID] = Y.encodeStateVector(this.ydoc)

        ydoc.on('update', this.onUpdate.bind(this));

        node.services.pubsub.addEventListener('message', (msg) => {
            console.log(msg.detail)
            if (msg.detail.topic === changesTopic(topic)) {
                this.onPubSubChanges(msg)
            } else if (msg.detail.topic === stateVectorTopic(topic)) {
                this.onPubSubStateVector(msg)
            }
        })

        node.services.pubsub.subscribe(changesTopic(topic))

        node.services.pubsub.subscribe(stateVectorTopic(topic))

        node.handle(syncProtocol(topic), this.onSyncMsg.bind(this)).then();

        this.tryInitialSync(this.stateVectors[this.peerID], this).then();
    }

    destroy() {
        this.node.services.pubsub.unsubscribe(changesTopic(this.topic))
        this.node.services.pubsub.unsubscribe(stateVectorTopic(this.topic))

        //Remove also event listeners

        this.node.unhandle(syncProtocol(this.topic)).then()

        this.initialSync = true;
    }

    storeStateVector(peerID: string, stateVector: Uint8Array) {
        this.stateVectors[peerID] = stateVector;
    }

    fetchStateVector(peerID: string) {
        return this.stateVectors[peerID];
    }

    // Not required, but nice if we can get synced against a peer sooner rather than latter
    private async tryInitialSync(updateData: Uint8Array, origin: this | any) {
        const tries = 10;
        const maxWaitTime = 1000;
        let waitTime = 100;
        for (let i = 0; i < tries; i++) {
            if (this.initialSync) {
                return
            }
            const peers = [...this.node.services.pubsub.getSubscribers(stateVectorTopic(this.topic)) || []]

            if (peers.length !== 0) {
                const peer = peers[i % peers.length]
                try {
                    await this.syncPeer(peer)
                    this.initialSync = true;
                    return true
                } catch (e) {
                    console.warn("failed to sync with anyone", e)
                }
            }

            await new Promise(resolve => setTimeout(resolve, waitTime))
            waitTime = Math.min(waitTime * 2, maxWaitTime)
        }
    }

    private onUpdate(updateData: Uint8Array, origin: this | any) {
        if (origin !== this) {
            this.publishUpdate(updateData);

            return
        }
    }

    private publishUpdate(updateData: Uint8Array) {
        console.log('updateData', updateData)
        if (this.node.status !== 'started') {
            return
        }

        this.node.services.pubsub.publish(changesTopic(this.topic), updateData).then();
        const stateV = Y.encodeStateVector(this.ydoc)
        this.stateVectors[this.peerID] = stateV;
        this.node.services.pubsub.publish(stateVectorTopic(this.topic), stateV).then();

        // Publish awareness as well
    }

    private onPubSubChanges(msg: any) {
        console.log('changes data', msg.detail.data)
        this.updateYdoc(msg.detail.data, this);
    }

    private onPubSubStateVector(msg: any) {
        this.stateVectors[msg.from] = msg.detail.data;

        if (!this.Uint8ArrayEquals(msg.detail.data, this.stateVectors[this.peerID])) {
            // Bookkeep that this peer is out of date
            // console.log("Peer is out of date", msg.from)
            this.queuePeerSync(msg.detail.from);
        }
    }

    private Uint8ArrayEquals(a: Uint8Array, b: Uint8Array): boolean {
        if (a.length !== b.length) {
            return false;
        }
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) {
                return false;
            }
        }
        return true;
    }

    private updateYdoc(updateData: Uint8Array, origin: any) {
        this.initialSync = true;
        Y.applyUpdate(this.ydoc, updateData, this);
        this.stateVectors[this.peerID] = Y.encodeStateVector(this.ydoc)
    }

    private async runSyncProtocol(stream: Stream, remotePeer: PeerId, initiate: boolean) {
        if (initiate) {
            await stream.sink([
                this.stateVectors[this.peerID],
                Y.encodeStateAsUpdate(this.ydoc, this.stateVectors[remotePeer.toString()])
            ])
        }

        const [{value: stateVector}, {value: updateData}] = [
            await (stream.source as AsyncIterable<Iterable<Uint8Array>>)[Symbol.asyncIterator]().next(),
            await (stream.source as AsyncIterable<Iterable<Uint8Array>>)[Symbol.asyncIterator]().next()
        ]
        this.stateVectors[remotePeer.toString()] = stateVector.slice(0);
        this.updateYdoc(updateData.slice(0), this);

        if (!initiate) {
            await stream.sink([
                Y.encodeStateVector(this.ydoc),
                Y.encodeStateAsUpdate(this.ydoc, this.stateVectors[remotePeer.toString()])
            ])
        }

        stream.close()
    }

    private async onSyncMsg(data: IncomingStreamData): Promise<void> {
        await this.runSyncProtocol(data.stream, data.connection.remotePeer, false)
    }

    private queuePeerSync(peerID: PeerId) {
        this.unsyncedPeers.add(peerID);
        if (this.aggressivelyKeepPeersUpdated) {
            for (const peerID of this.unsyncedPeers) {
                this.syncPeer(peerID).catch(console.error);
            }
        } else {
            throw new Error("Not implemented")
        }
    }

    private async syncPeer(peerID: PeerId) {
        try {
            const stream = await this.node.dialProtocol(peerID, syncProtocol(this.topic))
            await this.runSyncProtocol(stream, peerID, true)
            return
        } catch (e) {
            console.warn(`Failed to sync with ${peerID}`, e)
        }

        throw new Error("Failed to sync with peer")
    }
}
