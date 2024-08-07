[**ipdw**](../README.md) • **Docs**

***

[ipdw](../globals.md) / CachedStorageOverlay

# Class: CachedStorageOverlay

## Implements

- [`StorageProvider`](../interfaces/StorageProvider.md)

## Constructors

### new CachedStorageOverlay()

> **new CachedStorageOverlay**(`remoteStorage`, `cacheStorage`): [`CachedStorageOverlay`](CachedStorageOverlay.md)

#### Parameters

• **remoteStorage**: [`StorageProvider`](../interfaces/StorageProvider.md)

• **cacheStorage**: [`StorageProvider`](../interfaces/StorageProvider.md)

#### Returns

[`CachedStorageOverlay`](CachedStorageOverlay.md)

#### Defined in

[src/core/overlay/cached.overlay.ts:13](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/overlay/cached.overlay.ts#L13)

## Methods

### clear()

> **clear**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`StorageProvider`](../interfaces/StorageProvider.md).[`clear`](../interfaces/StorageProvider.md#clear)

#### Defined in

[src/core/overlay/cached.overlay.ts:53](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/overlay/cached.overlay.ts#L53)

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

[src/core/overlay/cached.overlay.ts:37](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/overlay/cached.overlay.ts#L37)

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

[src/core/overlay/cached.overlay.ts:31](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/overlay/cached.overlay.ts#L31)

***

### ls()

> **ls**(): `Promise`\<`string`[]\>

#### Returns

`Promise`\<`string`[]\>

#### Implementation of

[`StorageProvider`](../interfaces/StorageProvider.md).[`ls`](../interfaces/StorageProvider.md#ls)

#### Defined in

[src/core/overlay/cached.overlay.ts:49](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/overlay/cached.overlay.ts#L49)

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

[src/core/overlay/cached.overlay.ts:19](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/overlay/cached.overlay.ts#L19)

***

### sync()

> **sync**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/core/overlay/cached.overlay.ts:60](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/overlay/cached.overlay.ts#L60)
