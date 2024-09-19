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

[src/core/storage/cere.storage.ts:140](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/storage/cere.storage.ts#L140)

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

[src/core/storage/cere.storage.ts:122](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/storage/cere.storage.ts#L122)

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

[src/core/storage/cere.storage.ts:95](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/storage/cere.storage.ts#L95)

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

[src/core/storage/cere.storage.ts:117](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/storage/cere.storage.ts#L117)

***

### ls()

> **ls**(): `Promise`\<`string`[]\>

#### Returns

`Promise`\<`string`[]\>

#### Implementation of

[`StorageProvider`](../interfaces/StorageProvider.md).[`ls`](../interfaces/StorageProvider.md#ls)

#### Defined in

[src/core/storage/cere.storage.ts:135](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/storage/cere.storage.ts#L135)

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

[src/core/storage/cere.storage.ts:101](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/storage/cere.storage.ts#L101)

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

[src/core/storage/cere.storage.ts:32](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/storage/cere.storage.ts#L32)
