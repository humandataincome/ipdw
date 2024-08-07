[**ipdw**](../README.md) • **Docs**

***

[ipdw](../globals.md) / FileSystemStorageProvider

# Class: FileSystemStorageProvider

## Implements

- [`StorageProvider`](../interfaces/StorageProvider.md)

## Constructors

### new FileSystemStorageProvider()

> **new FileSystemStorageProvider**(`basePath`): [`FileSystemStorageProvider`](FileSystemStorageProvider.md)

#### Parameters

• **basePath**: `string` = `".storage/"`

#### Returns

[`FileSystemStorageProvider`](FileSystemStorageProvider.md)

#### Defined in

[src/core/storage/filesystem.storage.ts:7](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/storage/filesystem.storage.ts#L7)

## Methods

### clear()

> **clear**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`StorageProvider`](../interfaces/StorageProvider.md).[`clear`](../interfaces/StorageProvider.md#clear)

#### Defined in

[src/core/storage/filesystem.storage.ts:35](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/storage/filesystem.storage.ts#L35)

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

[src/core/storage/filesystem.storage.ts:25](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/storage/filesystem.storage.ts#L25)

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

[src/core/storage/filesystem.storage.ts:21](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/storage/filesystem.storage.ts#L21)

***

### ls()

> **ls**(): `Promise`\<`string`[]\>

#### Returns

`Promise`\<`string`[]\>

#### Implementation of

[`StorageProvider`](../interfaces/StorageProvider.md).[`ls`](../interfaces/StorageProvider.md#ls)

#### Defined in

[src/core/storage/filesystem.storage.ts:29](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/storage/filesystem.storage.ts#L29)

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

[src/core/storage/filesystem.storage.ts:14](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/storage/filesystem.storage.ts#L14)
