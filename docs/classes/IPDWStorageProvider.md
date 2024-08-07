[**ipdw**](../README.md) • **Docs**

***

[ipdw](../globals.md) / IPDWStorageProvider

# Class: IPDWStorageProvider

## Implements

- [`StorageProvider`](../interfaces/StorageProvider.md)

## Constructors

### new IPDWStorageProvider()

> **new IPDWStorageProvider**(`yMap`, `synchronizationProvider`): [`IPDWStorageProvider`](IPDWStorageProvider.md)

#### Parameters

• **yMap**: `YMap`\<`Uint8Array`\>

• **synchronizationProvider**: [`SynchronizationProvider`](SynchronizationProvider.md)

#### Returns

[`IPDWStorageProvider`](IPDWStorageProvider.md)

#### Defined in

[src/core/storage/ipdw.storage.ts:9](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/storage/ipdw.storage.ts#L9)

## Properties

### synchronizationProvider

> `readonly` **synchronizationProvider**: [`SynchronizationProvider`](SynchronizationProvider.md)

#### Defined in

[src/core/storage/ipdw.storage.ts:6](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/storage/ipdw.storage.ts#L6)

## Methods

### clear()

> **clear**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`StorageProvider`](../interfaces/StorageProvider.md).[`clear`](../interfaces/StorageProvider.md#clear)

#### Defined in

[src/core/storage/ipdw.storage.ts:68](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/storage/ipdw.storage.ts#L68)

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

[src/core/storage/ipdw.storage.ts:60](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/storage/ipdw.storage.ts#L60)

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

[src/core/storage/ipdw.storage.ts:56](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/storage/ipdw.storage.ts#L56)

***

### ls()

> **ls**(): `Promise`\<`string`[]\>

#### Returns

`Promise`\<`string`[]\>

#### Implementation of

[`StorageProvider`](../interfaces/StorageProvider.md).[`ls`](../interfaces/StorageProvider.md#ls)

#### Defined in

[src/core/storage/ipdw.storage.ts:64](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/storage/ipdw.storage.ts#L64)

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

[src/core/storage/ipdw.storage.ts:48](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/storage/ipdw.storage.ts#L48)

***

### Init()

> `static` **Init**(`privateKey`, `storageProvider`): `Promise`\<[`IPDWStorageProvider`](IPDWStorageProvider.md)\>

#### Parameters

• **privateKey**: `string`

• **storageProvider**: [`StorageProvider`](../interfaces/StorageProvider.md)

#### Returns

`Promise`\<[`IPDWStorageProvider`](IPDWStorageProvider.md)\>

#### Defined in

[src/core/storage/ipdw.storage.ts:14](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/storage/ipdw.storage.ts#L14)
