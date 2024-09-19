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

[src/core/storage/ipdw.storage.ts:11](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/storage/ipdw.storage.ts#L11)

## Properties

### synchronizationProvider

> `readonly` **synchronizationProvider**: [`SynchronizationProvider`](SynchronizationProvider.md)

#### Defined in

[src/core/storage/ipdw.storage.ts:7](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/storage/ipdw.storage.ts#L7)

## Methods

### batch()

> **batch**(`f`): `Promise`\<`void`\>

#### Parameters

• **f**

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/core/storage/ipdw.storage.ts:53](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/storage/ipdw.storage.ts#L53)

***

### clear()

> **clear**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`StorageProvider`](../interfaces/StorageProvider.md).[`clear`](../interfaces/StorageProvider.md#clear)

#### Defined in

[src/core/storage/ipdw.storage.ts:78](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/storage/ipdw.storage.ts#L78)

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

[src/core/storage/ipdw.storage.ts:70](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/storage/ipdw.storage.ts#L70)

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

[src/core/storage/ipdw.storage.ts:66](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/storage/ipdw.storage.ts#L66)

***

### ls()

> **ls**(): `Promise`\<`string`[]\>

#### Returns

`Promise`\<`string`[]\>

#### Implementation of

[`StorageProvider`](../interfaces/StorageProvider.md).[`ls`](../interfaces/StorageProvider.md#ls)

#### Defined in

[src/core/storage/ipdw.storage.ts:74](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/storage/ipdw.storage.ts#L74)

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

[src/core/storage/ipdw.storage.ts:57](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/storage/ipdw.storage.ts#L57)

***

### Init()

> `static` **Init**(`privateKey`, `storageProvider`): `Promise`\<[`IPDWStorageProvider`](IPDWStorageProvider.md)\>

#### Parameters

• **privateKey**: `string`

• **storageProvider**: [`StorageProvider`](../interfaces/StorageProvider.md)

#### Returns

`Promise`\<[`IPDWStorageProvider`](IPDWStorageProvider.md)\>

#### Defined in

[src/core/storage/ipdw.storage.ts:17](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/storage/ipdw.storage.ts#L17)
