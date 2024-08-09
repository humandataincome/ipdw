[**ipdw**](../README.md) • **Docs**

***

[ipdw](../globals.md) / CRDTStorageOverlay

# Class: CRDTStorageOverlay\<RemoteStorageProviderT, CacheStorageProviderT\>

## Type Parameters

• **RemoteStorageProviderT** *extends* [`StorageProvider`](../interfaces/StorageProvider.md)

• **CacheStorageProviderT** *extends* [`StorageProvider`](../interfaces/StorageProvider.md)

## Implements

- [`StorageProvider`](../interfaces/StorageProvider.md)

## Constructors

### new CRDTStorageOverlay()

> **new CRDTStorageOverlay**\<`RemoteStorageProviderT`, `CacheStorageProviderT`\>(`remoteStorage`, `cacheStorage`, `startSync`): [`CRDTStorageOverlay`](CRDTStorageOverlay.md)\<`RemoteStorageProviderT`, `CacheStorageProviderT`\>

#### Parameters

• **remoteStorage**: `RemoteStorageProviderT`

• **cacheStorage**: `CacheStorageProviderT`

• **startSync**: `boolean` = `true`

#### Returns

[`CRDTStorageOverlay`](CRDTStorageOverlay.md)\<`RemoteStorageProviderT`, `CacheStorageProviderT`\>

#### Defined in

[src/core/overlay/crdt.overlay.ts:17](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/overlay/crdt.overlay.ts#L17)

## Methods

### clear()

> **clear**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`StorageProvider`](../interfaces/StorageProvider.md).[`clear`](../interfaces/StorageProvider.md#clear)

#### Defined in

[src/core/overlay/crdt.overlay.ts:61](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/overlay/crdt.overlay.ts#L61)

***

### get()

> **get**(`key`): `Promise`\<`undefined` \| `Uint8Array`\>

#### Parameters

• **key**: `string`

#### Returns

`Promise`\<`undefined` \| `Uint8Array`\>

#### Implementation of

[`StorageProvider`](../interfaces/StorageProvider.md).[`get`](../interfaces/StorageProvider.md#get)

#### Defined in

[src/core/overlay/crdt.overlay.ts:44](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/overlay/crdt.overlay.ts#L44)

***

### has()

> **has**(`key`): `Promise`\<`boolean`\>

#### Parameters

• **key**: `string`

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`StorageProvider`](../interfaces/StorageProvider.md).[`has`](../interfaces/StorageProvider.md#has)

#### Defined in

[src/core/overlay/crdt.overlay.ts:38](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/overlay/crdt.overlay.ts#L38)

***

### ls()

> **ls**(): `Promise`\<`string`[]\>

#### Returns

`Promise`\<`string`[]\>

#### Implementation of

[`StorageProvider`](../interfaces/StorageProvider.md).[`ls`](../interfaces/StorageProvider.md#ls)

#### Defined in

[src/core/overlay/crdt.overlay.ts:57](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/overlay/crdt.overlay.ts#L57)

***

### set()

> **set**(`key`, `value`): `Promise`\<`void`\>

#### Parameters

• **key**: `string`

• **value**: `undefined` \| `Uint8Array`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`StorageProvider`](../interfaces/StorageProvider.md).[`set`](../interfaces/StorageProvider.md#set)

#### Defined in

[src/core/overlay/crdt.overlay.ts:25](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/overlay/crdt.overlay.ts#L25)

***

### startSync()

> **startSync**(): `void`

#### Returns

`void`

#### Defined in

[src/core/overlay/crdt.overlay.ts:68](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/overlay/crdt.overlay.ts#L68)

***

### stopSync()

> **stopSync**(): `void`

#### Returns

`void`

#### Defined in

[src/core/overlay/crdt.overlay.ts:74](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/overlay/crdt.overlay.ts#L74)

***

### sync()

> **sync**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/core/overlay/crdt.overlay.ts:81](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/overlay/crdt.overlay.ts#L81)
