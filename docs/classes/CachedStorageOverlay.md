[**ipdw**](../README.md) • **Docs**

***

[ipdw](../globals.md) / CachedStorageOverlay

# Class: CachedStorageOverlay\<RemoteStorageProviderT, CacheStorageProviderT\>

## Type Parameters

• **RemoteStorageProviderT** *extends* [`StorageProvider`](../interfaces/StorageProvider.md)

• **CacheStorageProviderT** *extends* [`StorageProvider`](../interfaces/StorageProvider.md)

## Implements

- [`StorageProvider`](../interfaces/StorageProvider.md)

## Constructors

### new CachedStorageOverlay()

> **new CachedStorageOverlay**\<`RemoteStorageProviderT`, `CacheStorageProviderT`\>(`remoteStorage`, `cacheStorage`, `startSync`): [`CachedStorageOverlay`](CachedStorageOverlay.md)\<`RemoteStorageProviderT`, `CacheStorageProviderT`\>

#### Parameters

• **remoteStorage**: `RemoteStorageProviderT`

• **cacheStorage**: `CacheStorageProviderT`

• **startSync**: `boolean` = `true`

#### Returns

[`CachedStorageOverlay`](CachedStorageOverlay.md)\<`RemoteStorageProviderT`, `CacheStorageProviderT`\>

#### Defined in

[src/core/overlay/cached.overlay.ts:16](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/overlay/cached.overlay.ts#L16)

## Methods

### clear()

> **clear**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`StorageProvider`](../interfaces/StorageProvider.md).[`clear`](../interfaces/StorageProvider.md#clear)

#### Defined in

[src/core/overlay/cached.overlay.ts:58](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/overlay/cached.overlay.ts#L58)

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

[src/core/overlay/cached.overlay.ts:42](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/overlay/cached.overlay.ts#L42)

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

[src/core/overlay/cached.overlay.ts:36](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/overlay/cached.overlay.ts#L36)

***

### ls()

> **ls**(): `Promise`\<`string`[]\>

#### Returns

`Promise`\<`string`[]\>

#### Implementation of

[`StorageProvider`](../interfaces/StorageProvider.md).[`ls`](../interfaces/StorageProvider.md#ls)

#### Defined in

[src/core/overlay/cached.overlay.ts:54](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/overlay/cached.overlay.ts#L54)

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

[src/core/overlay/cached.overlay.ts:24](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/overlay/cached.overlay.ts#L24)

***

### startSync()

> **startSync**(): `void`

#### Returns

`void`

#### Defined in

[src/core/overlay/cached.overlay.ts:96](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/overlay/cached.overlay.ts#L96)

***

### stopSync()

> **stopSync**(): `void`

#### Returns

`void`

#### Defined in

[src/core/overlay/cached.overlay.ts:102](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/overlay/cached.overlay.ts#L102)

***

### sync()

> **sync**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/core/overlay/cached.overlay.ts:65](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/overlay/cached.overlay.ts#L65)
