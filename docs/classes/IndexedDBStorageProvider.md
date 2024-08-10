[**ipdw**](../README.md) • **Docs**

***

[ipdw](../globals.md) / IndexedDBStorageProvider

# Class: IndexedDBStorageProvider

## Implements

- [`StorageProvider`](../interfaces/StorageProvider.md)

## Constructors

### new IndexedDBStorageProvider()

> **new IndexedDBStorageProvider**(`database`, `basePath`): [`IndexedDBStorageProvider`](IndexedDBStorageProvider.md)

#### Parameters

• **database**: `IDBDatabase`

• **basePath**: `string`

#### Returns

[`IndexedDBStorageProvider`](IndexedDBStorageProvider.md)

#### Defined in

[src/core/storage/indexeddb.storage.ts:7](https://github.com/ansi-code/ipdw/blob/ddce49f30075d034810cb5fb58d4bd8d0a9b98e6/src/core/storage/indexeddb.storage.ts#L7)

## Methods

### clear()

> **clear**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`StorageProvider`](../interfaces/StorageProvider.md).[`clear`](../interfaces/StorageProvider.md#clear)

#### Defined in

[src/core/storage/indexeddb.storage.ts:59](https://github.com/ansi-code/ipdw/blob/ddce49f30075d034810cb5fb58d4bd8d0a9b98e6/src/core/storage/indexeddb.storage.ts#L59)

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

[src/core/storage/indexeddb.storage.ts:49](https://github.com/ansi-code/ipdw/blob/ddce49f30075d034810cb5fb58d4bd8d0a9b98e6/src/core/storage/indexeddb.storage.ts#L49)

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

[src/core/storage/indexeddb.storage.ts:45](https://github.com/ansi-code/ipdw/blob/ddce49f30075d034810cb5fb58d4bd8d0a9b98e6/src/core/storage/indexeddb.storage.ts#L45)

***

### ls()

> **ls**(): `Promise`\<`string`[]\>

#### Returns

`Promise`\<`string`[]\>

#### Implementation of

[`StorageProvider`](../interfaces/StorageProvider.md).[`ls`](../interfaces/StorageProvider.md#ls)

#### Defined in

[src/core/storage/indexeddb.storage.ts:55](https://github.com/ansi-code/ipdw/blob/ddce49f30075d034810cb5fb58d4bd8d0a9b98e6/src/core/storage/indexeddb.storage.ts#L55)

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

[src/core/storage/indexeddb.storage.ts:35](https://github.com/ansi-code/ipdw/blob/ddce49f30075d034810cb5fb58d4bd8d0a9b98e6/src/core/storage/indexeddb.storage.ts#L35)

***

### Init()

> `static` **Init**(`basePath`): `Promise`\<[`IndexedDBStorageProvider`](IndexedDBStorageProvider.md)\>

#### Parameters

• **basePath**: `string` = `".storage/"`

#### Returns

`Promise`\<[`IndexedDBStorageProvider`](IndexedDBStorageProvider.md)\>

#### Defined in

[src/core/storage/indexeddb.storage.ts:12](https://github.com/ansi-code/ipdw/blob/ddce49f30075d034810cb5fb58d4bd8d0a9b98e6/src/core/storage/indexeddb.storage.ts#L12)
