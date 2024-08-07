[**ipdw**](../README.md) • **Docs**

***

[ipdw](../globals.md) / CereStorageProvider

# Class: CereStorageProvider

## Implements

- [`StorageProvider`](../interfaces/StorageProvider.md)

## Methods

### clear()

> **clear**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`StorageProvider`](../interfaces/StorageProvider.md).[`clear`](../interfaces/StorageProvider.md#clear)

#### Defined in

[src/core/storage/cere.storage.ts:137](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/storage/cere.storage.ts#L137)

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

[src/core/storage/cere.storage.ts:119](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/storage/cere.storage.ts#L119)

***

### getAccountInfo()

> **getAccountInfo**(): `Promise`\<`object`\>

#### Returns

`Promise`\<`object`\>

##### address

> **address**: `string`

##### balance

> **balance**: `bigint`

#### Defined in

[src/core/storage/cere.storage.ts:92](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/storage/cere.storage.ts#L92)

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

[src/core/storage/cere.storage.ts:114](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/storage/cere.storage.ts#L114)

***

### ls()

> **ls**(): `Promise`\<`string`[]\>

#### Returns

`Promise`\<`string`[]\>

#### Implementation of

[`StorageProvider`](../interfaces/StorageProvider.md).[`ls`](../interfaces/StorageProvider.md#ls)

#### Defined in

[src/core/storage/cere.storage.ts:132](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/storage/cere.storage.ts#L132)

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

[src/core/storage/cere.storage.ts:98](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/storage/cere.storage.ts#L98)

***

### Init()

> `static` **Init**(`privateKey`, `rpcUrl`, `indexerUrl`, `bucketName`): `Promise`\<[`CereStorageProvider`](CereStorageProvider.md)\>

#### Parameters

• **privateKey**: `string`

• **rpcUrl**: `string` = `CERE_MAINNET_RPC_URL`

• **indexerUrl**: `string` = `CERE_MAINNET_INDEXER_URL`

• **bucketName**: `string` = `CERE_DEFAULT_BUCKET_NAME`

#### Returns

`Promise`\<[`CereStorageProvider`](CereStorageProvider.md)\>

#### Defined in

[src/core/storage/cere.storage.ts:28](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/storage/cere.storage.ts#L28)
