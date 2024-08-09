[**ipdw**](../README.md) • **Docs**

***

[ipdw](../globals.md) / CompressedStorageOverlay

# Class: CompressedStorageOverlay\<CompressedStorageProviderT, UncompressedStorageProviderT\>

## Type Parameters

• **CompressedStorageProviderT** *extends* [`StorageProvider`](../interfaces/StorageProvider.md)

• **UncompressedStorageProviderT** *extends* [`StorageProvider`](../interfaces/StorageProvider.md)

## Implements

- [`StorageProvider`](../interfaces/StorageProvider.md)

## Constructors

### new CompressedStorageOverlay()

> **new CompressedStorageOverlay**\<`CompressedStorageProviderT`, `UncompressedStorageProviderT`\>(`compressedStorageProvider`, `uncompressedStorageProvider`): [`CompressedStorageOverlay`](CompressedStorageOverlay.md)\<`CompressedStorageProviderT`, `UncompressedStorageProviderT`\>

#### Parameters

• **compressedStorageProvider**: `CompressedStorageProviderT`

• **uncompressedStorageProvider**: `UncompressedStorageProviderT`

#### Returns

[`CompressedStorageOverlay`](CompressedStorageOverlay.md)\<`CompressedStorageProviderT`, `UncompressedStorageProviderT`\>

#### Defined in

[src/core/overlay/compressed.overlay.ts:7](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/overlay/compressed.overlay.ts#L7)

## Methods

### clear()

> **clear**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`StorageProvider`](../interfaces/StorageProvider.md).[`clear`](../interfaces/StorageProvider.md#clear)

#### Defined in

[src/core/overlay/compressed.overlay.ts:46](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/overlay/compressed.overlay.ts#L46)

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

[src/core/overlay/compressed.overlay.ts:38](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/overlay/compressed.overlay.ts#L38)

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

[src/core/overlay/compressed.overlay.ts:34](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/overlay/compressed.overlay.ts#L34)

***

### ls()

> **ls**(): `Promise`\<`string`[]\>

#### Returns

`Promise`\<`string`[]\>

#### Implementation of

[`StorageProvider`](../interfaces/StorageProvider.md).[`ls`](../interfaces/StorageProvider.md#ls)

#### Defined in

[src/core/overlay/compressed.overlay.ts:42](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/overlay/compressed.overlay.ts#L42)

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

[src/core/overlay/compressed.overlay.ts:29](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/overlay/compressed.overlay.ts#L29)

***

### toBuffer()

> **toBuffer**(): `Promise`\<`Buffer`\>

#### Returns

`Promise`\<`Buffer`\>

#### Defined in

[src/core/overlay/compressed.overlay.ts:51](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/overlay/compressed.overlay.ts#L51)

***

### Init()

> `static` **Init**\<`CompressedStorageProviderT`\>(`storageProvider`): `Promise`\<[`CompressedStorageOverlay`](CompressedStorageOverlay.md)\<`CompressedStorageProviderT`, [`MemoryStorageProvider`](MemoryStorageProvider.md)\>\>

#### Type Parameters

• **CompressedStorageProviderT** *extends* [`StorageProvider`](../interfaces/StorageProvider.md)

#### Parameters

• **storageProvider**: `CompressedStorageProviderT`

#### Returns

`Promise`\<[`CompressedStorageOverlay`](CompressedStorageOverlay.md)\<`CompressedStorageProviderT`, [`MemoryStorageProvider`](MemoryStorageProvider.md)\>\>

#### Defined in

[src/core/overlay/compressed.overlay.ts:12](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/overlay/compressed.overlay.ts#L12)
