[**ipdw**](../README.md) • **Docs**

***

[ipdw](../globals.md) / IPFSStorageProvider

# Class: IPFSStorageProvider

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

[src/core/storage/ipfs.storage.ts:83](https://github.com/ansi-code/ipdw/blob/ddce49f30075d034810cb5fb58d4bd8d0a9b98e6/src/core/storage/ipfs.storage.ts#L83)

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

[src/core/storage/ipfs.storage.ts:62](https://github.com/ansi-code/ipdw/blob/ddce49f30075d034810cb5fb58d4bd8d0a9b98e6/src/core/storage/ipfs.storage.ts#L62)

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

[src/core/storage/ipfs.storage.ts:57](https://github.com/ansi-code/ipdw/blob/ddce49f30075d034810cb5fb58d4bd8d0a9b98e6/src/core/storage/ipfs.storage.ts#L57)

***

### ls()

> **ls**(): `Promise`\<`string`[]\>

#### Returns

`Promise`\<`string`[]\>

#### Implementation of

[`StorageProvider`](../interfaces/StorageProvider.md).[`ls`](../interfaces/StorageProvider.md#ls)

#### Defined in

[src/core/storage/ipfs.storage.ts:78](https://github.com/ansi-code/ipdw/blob/ddce49f30075d034810cb5fb58d4bd8d0a9b98e6/src/core/storage/ipfs.storage.ts#L78)

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

[src/core/storage/ipfs.storage.ts:42](https://github.com/ansi-code/ipdw/blob/ddce49f30075d034810cb5fb58d4bd8d0a9b98e6/src/core/storage/ipfs.storage.ts#L42)

***

### Init()

> `static` **Init**(`privateKey`, `salt`): `Promise`\<[`IPFSStorageProvider`](IPFSStorageProvider.md)\>

#### Parameters

• **privateKey**: `string`

• **salt**: `Uint8Array` = `IPNS_DEFAULT_DERIVATION_SALT`

#### Returns

`Promise`\<[`IPFSStorageProvider`](IPFSStorageProvider.md)\>

#### Defined in

[src/core/storage/ipfs.storage.ts:28](https://github.com/ansi-code/ipdw/blob/ddce49f30075d034810cb5fb58d4bd8d0a9b98e6/src/core/storage/ipfs.storage.ts#L28)
