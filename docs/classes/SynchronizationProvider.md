[**ipdw**](../README.md) • **Docs**

***

[ipdw](../globals.md) / SynchronizationProvider

# Class: SynchronizationProvider

## Properties

### events

> **events**: [`TypedEventTarget`](TypedEventTarget.md)\<`SyncEventTypes`\>

#### Defined in

[src/core/network/synchronization.provider.ts:29](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/network/synchronization.provider.ts#L29)

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

[src/core/network/synchronization.provider.ts:31](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/network/synchronization.provider.ts#L31)

***

### peers

> **peers**: `Set`\<`PeerId`\>

#### Defined in

[src/core/network/synchronization.provider.ts:30](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/network/synchronization.provider.ts#L30)

## Methods

### start()

> **start**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/core/network/synchronization.provider.ts:61](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/network/synchronization.provider.ts#L61)

***

### stop()

> **stop**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/core/network/synchronization.provider.ts:68](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/network/synchronization.provider.ts#L68)

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

[src/core/network/synchronization.provider.ts:53](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/network/synchronization.provider.ts#L53)
