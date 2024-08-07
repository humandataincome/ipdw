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

[src/core/storage/algorand.storage.ts:26](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/storage/algorand.storage.ts#L26)

## Methods

### clear()

> **clear**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`StorageProvider`](../interfaces/StorageProvider.md).[`clear`](../interfaces/StorageProvider.md#clear)

#### Defined in

[src/core/storage/algorand.storage.ts:164](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/storage/algorand.storage.ts#L164)

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

[src/core/storage/algorand.storage.ts:147](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/storage/algorand.storage.ts#L147)

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

[src/core/storage/algorand.storage.ts:119](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/storage/algorand.storage.ts#L119)

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

[src/core/storage/algorand.storage.ts:142](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/storage/algorand.storage.ts#L142)

***

### ls()

> **ls**(): `Promise`\<`string`[]\>

#### Returns

`Promise`\<`string`[]\>

#### Implementation of

[`StorageProvider`](../interfaces/StorageProvider.md).[`ls`](../interfaces/StorageProvider.md#ls)

#### Defined in

[src/core/storage/algorand.storage.ts:159](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/storage/algorand.storage.ts#L159)

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

[src/core/storage/algorand.storage.ts:127](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/storage/algorand.storage.ts#L127)

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

[src/core/storage/algorand.storage.ts:32](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/storage/algorand.storage.ts#L32)
