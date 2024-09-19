[**ipdw**](../README.md) • **Docs**

***

[ipdw](../globals.md) / AlgorandStorageProvider

# Class: AlgorandStorageProvider

## Implements

- [`StorageProvider`](../interfaces/StorageProvider.md)

## Constructors

### new AlgorandStorageProvider()

> **new AlgorandStorageProvider**(`account`, `applicationId`, `client`): [`AlgorandStorageProvider`](AlgorandStorageProvider.md)

#### Parameters

• **account**: `Account`

• **applicationId**: `bigint`

• **client**: `AlgodClient`

#### Returns

[`AlgorandStorageProvider`](AlgorandStorageProvider.md)

#### Defined in

[src/core/storage/algorand.storage.ts:32](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/storage/algorand.storage.ts#L32)

## Methods

### clear()

> **clear**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`StorageProvider`](../interfaces/StorageProvider.md).[`clear`](../interfaces/StorageProvider.md#clear)

#### Defined in

[src/core/storage/algorand.storage.ts:222](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/storage/algorand.storage.ts#L222)

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

[src/core/storage/algorand.storage.ts:182](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/storage/algorand.storage.ts#L182)

***

### getAccountInfo()

> **getAccountInfo**(): `Promise`\<`object`\>

#### Returns

`Promise`\<`object`\>

##### address

> **address**: `string`

##### balance

> **balance**: `bigint`

##### mnemonic

> **mnemonic**: `string`

#### Defined in

[src/core/storage/algorand.storage.ts:152](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/storage/algorand.storage.ts#L152)

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

[src/core/storage/algorand.storage.ts:177](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/storage/algorand.storage.ts#L177)

***

### ls()

> **ls**(): `Promise`\<`string`[]\>

#### Returns

`Promise`\<`string`[]\>

#### Implementation of

[`StorageProvider`](../interfaces/StorageProvider.md).[`ls`](../interfaces/StorageProvider.md#ls)

#### Defined in

[src/core/storage/algorand.storage.ts:202](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/storage/algorand.storage.ts#L202)

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

[src/core/storage/algorand.storage.ts:160](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/storage/algorand.storage.ts#L160)

***

### Init()

> `static` **Init**(`privateKey`, `serverUrl`, `indexerUrl`, `contractName`): `Promise`\<[`AlgorandStorageProvider`](AlgorandStorageProvider.md)\>

#### Parameters

• **privateKey**: `string`

• **serverUrl**: `string` = `ALGORAND_MAINNET_SERVER_URL`

• **indexerUrl**: `string` = `ALGORAND_MAINNET_INDEXER_URL`

• **contractName**: `string` = `ALGORAND_DEFAULT_CONTRACT_NAME`

#### Returns

`Promise`\<[`AlgorandStorageProvider`](AlgorandStorageProvider.md)\>

#### Defined in

[src/core/storage/algorand.storage.ts:38](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/storage/algorand.storage.ts#L38)
