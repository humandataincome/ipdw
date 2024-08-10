[**ipdw**](../README.md) • **Docs**

***

[ipdw](../globals.md) / MemoryStorageProvider

# Class: MemoryStorageProvider

## Implements

- [`StorageProvider`](../interfaces/StorageProvider.md)

## Constructors

### new MemoryStorageProvider()

> **new MemoryStorageProvider**(): [`MemoryStorageProvider`](MemoryStorageProvider.md)

#### Returns

[`MemoryStorageProvider`](MemoryStorageProvider.md)

#### Defined in

[src/core/storage/memory.storage.ts:6](https://github.com/ansi-code/ipdw/blob/ddce49f30075d034810cb5fb58d4bd8d0a9b98e6/src/core/storage/memory.storage.ts#L6)

## Methods

### clear()

> **clear**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`StorageProvider`](../interfaces/StorageProvider.md).[`clear`](../interfaces/StorageProvider.md#clear)

#### Defined in

[src/core/storage/memory.storage.ts:29](https://github.com/ansi-code/ipdw/blob/ddce49f30075d034810cb5fb58d4bd8d0a9b98e6/src/core/storage/memory.storage.ts#L29)

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

[src/core/storage/memory.storage.ts:21](https://github.com/ansi-code/ipdw/blob/ddce49f30075d034810cb5fb58d4bd8d0a9b98e6/src/core/storage/memory.storage.ts#L21)

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

[src/core/storage/memory.storage.ts:17](https://github.com/ansi-code/ipdw/blob/ddce49f30075d034810cb5fb58d4bd8d0a9b98e6/src/core/storage/memory.storage.ts#L17)

***

### ls()

> **ls**(): `Promise`\<`string`[]\>

#### Returns

`Promise`\<`string`[]\>

#### Implementation of

[`StorageProvider`](../interfaces/StorageProvider.md).[`ls`](../interfaces/StorageProvider.md#ls)

#### Defined in

[src/core/storage/memory.storage.ts:25](https://github.com/ansi-code/ipdw/blob/ddce49f30075d034810cb5fb58d4bd8d0a9b98e6/src/core/storage/memory.storage.ts#L25)

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

[src/core/storage/memory.storage.ts:10](https://github.com/ansi-code/ipdw/blob/ddce49f30075d034810cb5fb58d4bd8d0a9b98e6/src/core/storage/memory.storage.ts#L10)
