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

• **applicationId**: `number`

• **client**: `AlgodClient`

#### Returns

[`AlgorandStorageProvider`](AlgorandStorageProvider.md)

#### Defined in

[src/core/storage/algorand.storage.ts:29](https://github.com/ansi-code/ipdw/blob/ddce49f30075d034810cb5fb58d4bd8d0a9b98e6/src/core/storage/algorand.storage.ts#L29)

## Methods

### clear()

> **clear**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`StorageProvider`](../interfaces/StorageProvider.md).[`clear`](../interfaces/StorageProvider.md#clear)

#### Defined in

[src/core/storage/algorand.storage.ts:166](https://github.com/ansi-code/ipdw/blob/ddce49f30075d034810cb5fb58d4bd8d0a9b98e6/src/core/storage/algorand.storage.ts#L166)

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

[src/core/storage/algorand.storage.ts:149](https://github.com/ansi-code/ipdw/blob/ddce49f30075d034810cb5fb58d4bd8d0a9b98e6/src/core/storage/algorand.storage.ts#L149)

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

[src/core/storage/algorand.storage.ts:122](https://github.com/ansi-code/ipdw/blob/ddce49f30075d034810cb5fb58d4bd8d0a9b98e6/src/core/storage/algorand.storage.ts#L122)

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

[src/core/storage/algorand.storage.ts:144](https://github.com/ansi-code/ipdw/blob/ddce49f30075d034810cb5fb58d4bd8d0a9b98e6/src/core/storage/algorand.storage.ts#L144)

***

### ls()

> **ls**(): `Promise`\<`string`[]\>

#### Returns

`Promise`\<`string`[]\>

#### Implementation of

[`StorageProvider`](../interfaces/StorageProvider.md).[`ls`](../interfaces/StorageProvider.md#ls)

#### Defined in

[src/core/storage/algorand.storage.ts:161](https://github.com/ansi-code/ipdw/blob/ddce49f30075d034810cb5fb58d4bd8d0a9b98e6/src/core/storage/algorand.storage.ts#L161)

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

[src/core/storage/algorand.storage.ts:130](https://github.com/ansi-code/ipdw/blob/ddce49f30075d034810cb5fb58d4bd8d0a9b98e6/src/core/storage/algorand.storage.ts#L130)

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

[src/core/storage/algorand.storage.ts:35](https://github.com/ansi-code/ipdw/blob/ddce49f30075d034810cb5fb58d4bd8d0a9b98e6/src/core/storage/algorand.storage.ts#L35)
