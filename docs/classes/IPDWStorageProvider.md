[**ipdw**](../README.md) • **Docs**

***

[ipdw](../globals.md) / IPDWStorageProvider

# Class: IPDWStorageProvider

## Implements

- [`StorageProvider`](../interfaces/StorageProvider.md)

## Constructors

### new IPDWStorageProvider()

> **new IPDWStorageProvider**(`yMap`, `synchronizationProvider`, `storageProvider`): [`IPDWStorageProvider`](IPDWStorageProvider.md)

#### Parameters

• **yMap**: `YMap`\<`Uint8Array`\>

• **synchronizationProvider**: [`SynchronizationProvider`](SynchronizationProvider.md)

• **storageProvider**: [`StorageProvider`](../interfaces/StorageProvider.md)

#### Returns

[`IPDWStorageProvider`](IPDWStorageProvider.md)

#### Defined in

[src/core/storage/ipdw.storage.ts:11](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/storage/ipdw.storage.ts#L11)

## Properties

### synchronizationProvider

> `readonly` **synchronizationProvider**: [`SynchronizationProvider`](SynchronizationProvider.md)

#### Defined in

[src/core/storage/ipdw.storage.ts:7](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/storage/ipdw.storage.ts#L7)

## Methods

### clear()

> **clear**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`StorageProvider`](../interfaces/StorageProvider.md).[`clear`](../interfaces/StorageProvider.md#clear)

#### Defined in

[src/core/storage/ipdw.storage.ts:75](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/storage/ipdw.storage.ts#L75)

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

[src/core/storage/ipdw.storage.ts:67](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/storage/ipdw.storage.ts#L67)

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

[src/core/storage/ipdw.storage.ts:63](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/storage/ipdw.storage.ts#L63)

***

### ls()

> **ls**(): `Promise`\<`string`[]\>

#### Returns

`Promise`\<`string`[]\>

#### Implementation of

[`StorageProvider`](../interfaces/StorageProvider.md).[`ls`](../interfaces/StorageProvider.md#ls)

#### Defined in

[src/core/storage/ipdw.storage.ts:71](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/storage/ipdw.storage.ts#L71)

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

[src/core/storage/ipdw.storage.ts:53](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/storage/ipdw.storage.ts#L53)

***

### Init()

> `static` **Init**(`privateKey`, `storageProvider`): `Promise`\<[`IPDWStorageProvider`](IPDWStorageProvider.md)\>

#### Parameters

• **privateKey**: `string`

• **storageProvider**: [`StorageProvider`](../interfaces/StorageProvider.md)

#### Returns

`Promise`\<[`IPDWStorageProvider`](IPDWStorageProvider.md)\>

#### Defined in

[src/core/storage/ipdw.storage.ts:17](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/storage/ipdw.storage.ts#L17)
