import * as Y from 'yjs'
import createLibp2p from "../network/libp2p.factory";
import {Libp2pProvider} from "../network/libp2p.provider";
import {Libp2p} from "@libp2p/interface";

export class Relay {
    async test() {
        const yarray = new Y.Array<Uint8Array>();
        // observe changes of the sum
        yarray.observe(event => {
            // print updates when the data changes
            console.log('new event: ', event)
        })

        //yarray.insert(0, [new Uint8Array([1, 4, 6])]);
        yarray.push([new Uint8Array([1, 4, 6])]);
        console.log(yarray)
        console.log(yarray.get(0))


        const topic = 'test'
        const ydoc1 = new Y.Doc()
        const ydoc2 = new Y.Doc()

        ydoc1.getArray('myarray').observe(event => {
            // print updates when the data changes
            console.log('new event 1: ', event)
        })

        ydoc2.getArray('myarray').observe(event => {
            // print updates when the data changes
            console.log('new event 2: ', event)
        })

        const [node1, node2] = await Promise.all([
            createLibp2p(),
            createLibp2p()
        ])

        console.log('aaaaaaa')

        // Add node's 2 data to the PeerStore
        await node1.peerStore.patch(node2.peerId, {
            multiaddrs: node2.getMultiaddrs()
        })
        await node1.dial(node2.peerId)

        const provider1 = new Libp2pProvider(ydoc1, node1, topic)
        const provider2 = new Libp2pProvider(ydoc2, node2, topic)

        setTimeout(()=> {
            ydoc1.getArray('myarray').insert(0, ['Hello doc2, you got this?'])
            console.log('ydoc1', ydoc1.getArray('myarray').get(0))
        },1000)

        setTimeout(()=> {
            console.log('ydoc2', ydoc2.getArray('myarray').get(0))
        },3000)



    }
    async connectNodes(nodes: Libp2p[]) {
        const firstNode = nodes[0]
        for (let i = 1; i < nodes.length; i++) {
            const node = nodes[i]
            await firstNode.dial(node.getMultiaddrs())
        }
    }

}
