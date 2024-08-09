[**ipdw**](../README.md) • **Docs**

***

[ipdw](../globals.md) / VersionedStorageOverlay

# Class: VersionedStorageOverlay\<StorageProviderT\>

## Type Parameters

• **StorageProviderT** *extends* [`StorageProvider`](../interfaces/StorageProvider.md)

## Implements

- [`StorageProvider`](../interfaces/StorageProvider.md)

## Constructors

### new VersionedStorageOverlay()

> **new VersionedStorageOverlay**\<`StorageProviderT`\>(`storageProvider`): [`VersionedStorageOverlay`](VersionedStorageOverlay.md)\<`StorageProviderT`\>

#### Parameters

• **storageProvider**: `StorageProviderT`

#### Returns

[`VersionedStorageOverlay`](VersionedStorageOverlay.md)\<`StorageProviderT`\>

#### Defined in

[src/core/overlay/versioned.overlay.ts:9](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/overlay/versioned.overlay.ts#L9)

## Methods

### clear()

> **clear**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`StorageProvider`](../interfaces/StorageProvider.md).[`clear`](../interfaces/StorageProvider.md#clear)

#### Defined in

[src/core/overlay/versioned.overlay.ts:41](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/overlay/versioned.overlay.ts#L41)

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

[src/core/overlay/versioned.overlay.ts:33](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/overlay/versioned.overlay.ts#L33)

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

[src/core/overlay/versioned.overlay.ts:29](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/overlay/versioned.overlay.ts#L29)

***

### ls()

> **ls**(): `Promise`\<`string`[]\>

#### Returns

`Promise`\<`string`[]\>

#### Implementation of

[`StorageProvider`](../interfaces/StorageProvider.md).[`ls`](../interfaces/StorageProvider.md#ls)

#### Defined in

[src/core/overlay/versioned.overlay.ts:37](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/overlay/versioned.overlay.ts#L37)

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

[src/core/overlay/versioned.overlay.ts:19](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/overlay/versioned.overlay.ts#L19)

***

### Init()

> `static` **Init**\<`StorageProviderT`\>(`storageProvider`): `Promise`\<[`VersionedStorageOverlay`](VersionedStorageOverlay.md)\<`StorageProviderT`\>\>

#### Type Parameters

• **StorageProviderT** *extends* [`StorageProvider`](../interfaces/StorageProvider.md)

#### Parameters

• **storageProvider**: `StorageProviderT`

#### Returns

`Promise`\<[`VersionedStorageOverlay`](VersionedStorageOverlay.md)\<`StorageProviderT`\>\>

#### Defined in

[src/core/overlay/versioned.overlay.ts:13](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/overlay/versioned.overlay.ts#L13)
