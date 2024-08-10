[**ipdw**](../README.md) • **Docs**

***

[ipdw](../globals.md) / FlattenedArray

# Class: FlattenedArray\<StorageProviderT\>

## Type Parameters

• **StorageProviderT** *extends* [`StorageProvider`](../interfaces/StorageProvider.md)

## Constructors

### new FlattenedArray()

> **new FlattenedArray**\<`StorageProviderT`\>(`storage`, `prefix`): [`FlattenedArray`](FlattenedArray.md)\<`StorageProviderT`\>

#### Parameters

• **storage**: `StorageProviderT`

• **prefix**: `string` = `''`

#### Returns

[`FlattenedArray`](FlattenedArray.md)\<`StorageProviderT`\>

#### Defined in

[src/core/struct/array.flattened.ts:8](https://github.com/ansi-code/ipdw/blob/ddce49f30075d034810cb5fb58d4bd8d0a9b98e6/src/core/struct/array.flattened.ts#L8)

## Methods

### copyTo()

> **copyTo**(`storage`, `newPrefix`): `Promise`\<`void`\>

#### Parameters

• **storage**: [`StorageProvider`](../interfaces/StorageProvider.md)

• **newPrefix**: `string`

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/core/struct/array.flattened.ts:113](https://github.com/ansi-code/ipdw/blob/ddce49f30075d034810cb5fb58d4bd8d0a9b98e6/src/core/struct/array.flattened.ts#L113)

***

### delete()

> **delete**(`index`): `Promise`\<`void`\>

#### Parameters

• **index**: `number`

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/core/struct/array.flattened.ts:54](https://github.com/ansi-code/ipdw/blob/ddce49f30075d034810cb5fb58d4bd8d0a9b98e6/src/core/struct/array.flattened.ts#L54)

***

### get()

> **get**(`index`): `Promise`\<`undefined` \| `string` \| [`FlattenedArray`](FlattenedArray.md)\<`StorageProviderT`\> \| [`FlattenedMap`](FlattenedMap.md)\<`StorageProviderT`\>\>

#### Parameters

• **index**: `number`

#### Returns

`Promise`\<`undefined` \| `string` \| [`FlattenedArray`](FlattenedArray.md)\<`StorageProviderT`\> \| [`FlattenedMap`](FlattenedMap.md)\<`StorageProviderT`\>\>

#### Defined in

[src/core/struct/array.flattened.ts:13](https://github.com/ansi-code/ipdw/blob/ddce49f30075d034810cb5fb58d4bd8d0a9b98e6/src/core/struct/array.flattened.ts#L13)

***

### has()

> **has**(`index`): `Promise`\<`boolean`\>

#### Parameters

• **index**: `number`

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/core/struct/array.flattened.ts:50](https://github.com/ansi-code/ipdw/blob/ddce49f30075d034810cb5fb58d4bd8d0a9b98e6/src/core/struct/array.flattened.ts#L50)

***

### insert()

> **insert**(`index`, `value`): `Promise`\<`void`\>

#### Parameters

• **index**: `number`

• **value**: `string` \| [`FlattenedArray`](FlattenedArray.md)\<`StorageProviderT`\> \| [`FlattenedMap`](FlattenedMap.md)\<`StorageProviderT`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/core/struct/array.flattened.ts:82](https://github.com/ansi-code/ipdw/blob/ddce49f30075d034810cb5fb58d4bd8d0a9b98e6/src/core/struct/array.flattened.ts#L82)

***

### length()

> **length**(): `Promise`\<`number`\>

#### Returns

`Promise`\<`number`\>

#### Defined in

[src/core/struct/array.flattened.ts:104](https://github.com/ansi-code/ipdw/blob/ddce49f30075d034810cb5fb58d4bd8d0a9b98e6/src/core/struct/array.flattened.ts#L104)

***

### push()

> **push**(`value`): `Promise`\<`number`\>

#### Parameters

• **value**: `string` \| [`FlattenedArray`](FlattenedArray.md)\<`StorageProviderT`\> \| [`FlattenedMap`](FlattenedMap.md)\<`StorageProviderT`\>

#### Returns

`Promise`\<`number`\>

#### Defined in

[src/core/struct/array.flattened.ts:98](https://github.com/ansi-code/ipdw/blob/ddce49f30075d034810cb5fb58d4bd8d0a9b98e6/src/core/struct/array.flattened.ts#L98)

***

### set()

> **set**(`index`, `value`): `Promise`\<`void`\>

#### Parameters

• **index**: `number`

• **value**: `undefined` \| `string` \| [`FlattenedArray`](FlattenedArray.md)\<`StorageProviderT`\> \| [`FlattenedMap`](FlattenedMap.md)\<`StorageProviderT`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/core/struct/array.flattened.ts:34](https://github.com/ansi-code/ipdw/blob/ddce49f30075d034810cb5fb58d4bd8d0a9b98e6/src/core/struct/array.flattened.ts#L34)
