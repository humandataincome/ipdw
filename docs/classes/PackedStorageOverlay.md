[**ipdw**](../README.md) • **Docs**

***

[ipdw](../globals.md) / PackedStorageOverlay

# Class: PackedStorageOverlay\<StorageProviderT, KeyPackFactoryT, ValuePackFactoryT\>

## Type Parameters

• **StorageProviderT** *extends* [`StorageProvider`](../interfaces/StorageProvider.md)

• **KeyPackFactoryT** *extends* [`PackFactory`](../interfaces/PackFactory.md)

• **ValuePackFactoryT** *extends* [`PackFactory`](../interfaces/PackFactory.md)

## Implements

- [`StorageProvider`](../interfaces/StorageProvider.md)

## Constructors

### new PackedStorageOverlay()

> **new PackedStorageOverlay**\<`StorageProviderT`, `KeyPackFactoryT`, `ValuePackFactoryT`\>(`storageProvider`, `keyPackFactory`, `valuePackFactory`): [`PackedStorageOverlay`](PackedStorageOverlay.md)\<`StorageProviderT`, `KeyPackFactoryT`, `ValuePackFactoryT`\>

#### Parameters

• **storageProvider**: `StorageProviderT`

• **keyPackFactory**: `KeyPackFactoryT`

• **valuePackFactory**: `ValuePackFactoryT`

#### Returns

[`PackedStorageOverlay`](PackedStorageOverlay.md)\<`StorageProviderT`, `KeyPackFactoryT`, `ValuePackFactoryT`\>

#### Defined in

[src/core/overlay/packed.overlay.ts:10](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/overlay/packed.overlay.ts#L10)

## Methods

### clear()

> **clear**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`StorageProvider`](../interfaces/StorageProvider.md).[`clear`](../interfaces/StorageProvider.md#clear)

#### Defined in

[src/core/overlay/packed.overlay.ts:48](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/overlay/packed.overlay.ts#L48)

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

[src/core/overlay/packed.overlay.ts:31](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/overlay/packed.overlay.ts#L31)

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

[src/core/overlay/packed.overlay.ts:24](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/overlay/packed.overlay.ts#L24)

***

### ls()

> **ls**(): `Promise`\<`string`[]\>

#### Returns

`Promise`\<`string`[]\>

#### Implementation of

[`StorageProvider`](../interfaces/StorageProvider.md).[`ls`](../interfaces/StorageProvider.md#ls)

#### Defined in

[src/core/overlay/packed.overlay.ts:39](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/overlay/packed.overlay.ts#L39)

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

[src/core/overlay/packed.overlay.ts:16](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/overlay/packed.overlay.ts#L16)
