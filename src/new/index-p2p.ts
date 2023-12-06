/* eslint-disable no-console */

import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { floodsub } from '@libp2p/floodsub'
import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { mplex } from '@libp2p/mplex'
import { tcp } from '@libp2p/tcp'
//import { createLibp2p } from 'libp2p'
import { identifyService } from 'libp2p/identify'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'
import createLibp2p from "./core/network/libp2p.factory";

const createNode = async () => {
    /*
        const node = await createLibp2p({
            addresses: {
                listen: ['/ip4/0.0.0.0/tcp/0']
            },
            transports: [tcp()],
            streamMuxers: [yamux(), mplex() as any],
            connectionEncryption: [noise() as any],
            services: {
                pubsub: floodsub() as any,
                identify: identifyService()
            }
        })
*/
    const node = await createLibp2p()

        return node as any
    }

;(async () => {
    const topic = 'news'

    const [node1, node2] = await Promise.all([
        createNode(),
        createNode()
    ])

    // Add node's 2 data to the PeerStore
    await node1.peerStore.patch(node2.peerId, {
        multiaddrs: node2.getMultiaddrs()
    })
    await node1.dial(node2.peerId)

    node1.services.pubsub.subscribe(topic)
    node1.services.pubsub.addEventListener('message', (evt: any) => {
        console.log(`node1 received: ${uint8ArrayToString(evt.detail.data)} on topic ${evt.detail.topic}`)
    })

    // Will not receive own published messages by default
    node2.services.pubsub.subscribe(topic)
    node2.services.pubsub.addEventListener('message', (evt: any) => {
        console.log(`node2 received: ${uint8ArrayToString(evt.detail.data)} on topic ${evt.detail.topic}`)
    })

    // node2 publishes "news" every second
    setInterval(() => {
        node2.services.pubsub.publish(topic, uint8ArrayFromString('Bird bird bird, bird is the word!')).catch((err: any) => {
            console.error(err)
        })
    }, 1000)
})()
