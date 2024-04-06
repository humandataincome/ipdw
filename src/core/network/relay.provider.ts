import type {Libp2p} from "@libp2p/interface";
import type {IncomingStreamData} from "@libp2p/interface/src/stream-handler";
import {TypedCustomEvent, TypedEventTarget} from "../../utils";
import {PeerId} from "@libp2p/interface/src/peer-id";
import {Buffer} from "buffer";

//TODO: FINISH
export class RelayProvider {
    public events: TypedEventTarget<{
        "relay:request": TypedCustomEvent<{ peerId: PeerId, roomId: string }>;
        "relay:accepted": TypedCustomEvent<{ peerId: PeerId, roomId: string }>;
        "relay:declined": TypedCustomEvent<{ peerId: PeerId, roomId: string }>;
    }> = new TypedEventTarget();

    private node: Libp2p<{}>;
    private protocolName: string = '/ipdw/relay/1.0.0';

    constructor(node: Libp2p<{}>) {
        this.node = node;
    }

    public async run(server: boolean = false): Promise<void> {
        if (server)
            await this.node.handle(this.protocolName, this.onProtocolConnection.bind(this));

    }

    private async onProtocolConnection(data: IncomingStreamData): Promise<void> {
        const stream = data.stream;
        const stateRes = await stream.source.next();
        if (!stateRes.done) {
            const remoteRoomId = Buffer.from(stateRes.value.subarray(0, stateRes.value.length)).toString('utf8');
            this.events.dispatchTypedEvent('relay:request', new TypedCustomEvent('relay:request', {detail: {peerId: data.connection.remotePeer, roomId: remoteRoomId}}));

            await stream.close();
            this.events.dispatchTypedEvent('relay:declined', new TypedCustomEvent('relay:declined', {detail: {peerId: data.connection.remotePeer, roomId: remoteRoomId}}));

        }
    }

    private async runProtocol(peerId: PeerId): Promise<void> {
        this.events.dispatchTypedEvent('relay:request', new TypedCustomEvent('relay:request', {detail: {peerId, roomId: ''}}));
    }

}
