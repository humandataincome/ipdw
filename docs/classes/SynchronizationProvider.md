[**ipdw**](../README.md) • **Docs**

***

[ipdw](../globals.md) / SynchronizationProvider

# Class: SynchronizationProvider

## Properties

### events

> **events**: [`TypedEventTarget`](TypedEventTarget.md)\<`SyncEventTypes`\>

#### Defined in

[src/core/network/synchronization.provider.ts:25](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/network/synchronization.provider.ts#L25)

***

### node

> `readonly` **node**: `Libp2p`\<`object`\>

#### Type declaration

##### dht

> **dht**: `KadDHT`

##### fetch

> **fetch**: `Fetch`

##### pubsub

> **pubsub**: `PubSub`\<`PubSubEvents`\>

#### Defined in

[src/core/network/synchronization.provider.ts:27](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/network/synchronization.provider.ts#L27)

***

### peers

> **peers**: `Set`\<`PeerId`\>

#### Defined in

[src/core/network/synchronization.provider.ts:26](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/network/synchronization.provider.ts#L26)

## Methods

### start()

> **start**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/core/network/synchronization.provider.ts:57](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/network/synchronization.provider.ts#L57)

***

### stop()

> **stop**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/core/network/synchronization.provider.ts:64](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/network/synchronization.provider.ts#L64)

***

### Init()

> `static` **Init**(`node`, `crdtDoc`, `privateKey`): `Promise`\<[`SynchronizationProvider`](SynchronizationProvider.md)\>

#### Parameters

• **node**: `Libp2p`\<`object`\>

• **crdtDoc**: `Doc`

• **privateKey**: `string`

#### Returns

`Promise`\<[`SynchronizationProvider`](SynchronizationProvider.md)\>

#### Defined in

[src/core/network/synchronization.provider.ts:49](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/network/synchronization.provider.ts#L49)
