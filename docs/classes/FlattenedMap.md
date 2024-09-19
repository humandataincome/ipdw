[**ipdw**](../README.md) • **Docs**

***

[ipdw](../globals.md) / FlattenedMap

# Class: FlattenedMap\<StorageProviderT\>

## Type Parameters

• **StorageProviderT** *extends* [`StorageProvider`](../interfaces/StorageProvider.md)

## Constructors

### new FlattenedMap()

> **new FlattenedMap**\<`StorageProviderT`\>(`storage`, `prefix`): [`FlattenedMap`](FlattenedMap.md)\<`StorageProviderT`\>

#### Parameters

• **storage**: `StorageProviderT`

• **prefix**: `string` = `''`

#### Returns

[`FlattenedMap`](FlattenedMap.md)\<`StorageProviderT`\>

#### Defined in

[src/core/struct/map.flattened.ts:8](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/struct/map.flattened.ts#L8)

## Methods

### copyTo()

> **copyTo**(`storage`, `newPrefix`): `Promise`\<`void`\>

#### Parameters

• **storage**: [`StorageProvider`](../interfaces/StorageProvider.md)

• **newPrefix**: `string`

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/core/struct/map.flattened.ts:66](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/struct/map.flattened.ts#L66)

***

### delete()

> **delete**(`key`): `Promise`\<`void`\>

#### Parameters

• **key**: `string`

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/core/struct/map.flattened.ts:49](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/struct/map.flattened.ts#L49)

***

### get()

> **get**(`key`): `Promise`\<`undefined` \| `string` \| [`FlattenedMap`](FlattenedMap.md)\<`StorageProviderT`\> \| [`FlattenedArray`](FlattenedArray.md)\<`StorageProviderT`\>\>

#### Parameters

• **key**: `string`

#### Returns

`Promise`\<`undefined` \| `string` \| [`FlattenedMap`](FlattenedMap.md)\<`StorageProviderT`\> \| [`FlattenedArray`](FlattenedArray.md)\<`StorageProviderT`\>\>

#### Defined in

[src/core/struct/map.flattened.ts:13](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/struct/map.flattened.ts#L13)

***

### has()

> **has**(`key`): `Promise`\<`boolean`\>

#### Parameters

• **key**: `string`

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/core/struct/map.flattened.ts:45](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/struct/map.flattened.ts#L45)

***

### keys()

> **keys**(): `Promise`\<`string`[]\>

#### Returns

`Promise`\<`string`[]\>

#### Defined in

[src/core/struct/map.flattened.ts:58](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/struct/map.flattened.ts#L58)

***

### set()

> **set**(`key`, `value`): `Promise`\<`void`\>

#### Parameters

• **key**: `string`

• **value**: `undefined` \| `string` \| [`FlattenedMap`](FlattenedMap.md)\<`StorageProviderT`\> \| [`FlattenedArray`](FlattenedArray.md)\<`StorageProviderT`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/core/struct/map.flattened.ts:34](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/struct/map.flattened.ts#L34)
