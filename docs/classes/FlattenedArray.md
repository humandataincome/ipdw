[**ipdw**](../README.md) • **Docs**

***

[ipdw](../globals.md) / FlattenedArray

# Class: FlattenedArray

## Constructors

### new FlattenedArray()

> **new FlattenedArray**(`storage`, `prefix`): [`FlattenedArray`](FlattenedArray.md)

#### Parameters

• **storage**: [`StorageProvider`](../interfaces/StorageProvider.md)

• **prefix**: `string` = `''`

#### Returns

[`FlattenedArray`](FlattenedArray.md)

#### Defined in

[src/core/struct/array.flattened.ts:5](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/struct/array.flattened.ts#L5)

## Methods

### copyTo()

> **copyTo**(`storage`, `newPrefix`): `Promise`\<`void`\>

#### Parameters

• **storage**: [`StorageProvider`](../interfaces/StorageProvider.md)

• **newPrefix**: `string`

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/core/struct/array.flattened.ts:108](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/struct/array.flattened.ts#L108)

***

### delete()

> **delete**(`index`): `Promise`\<`void`\>

#### Parameters

• **index**: `number`

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/core/struct/array.flattened.ts:49](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/struct/array.flattened.ts#L49)

***

### get()

> **get**(`index`): `Promise`\<`undefined` \| `string` \| [`FlattenedArray`](FlattenedArray.md) \| [`FlattenedMap`](FlattenedMap.md)\>

#### Parameters

• **index**: `number`

#### Returns

`Promise`\<`undefined` \| `string` \| [`FlattenedArray`](FlattenedArray.md) \| [`FlattenedMap`](FlattenedMap.md)\>

#### Defined in

[src/core/struct/array.flattened.ts:8](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/struct/array.flattened.ts#L8)

***

### has()

> **has**(`index`): `Promise`\<`boolean`\>

#### Parameters

• **index**: `number`

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/core/struct/array.flattened.ts:45](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/struct/array.flattened.ts#L45)

***

### insert()

> **insert**(`index`, `value`): `Promise`\<`void`\>

#### Parameters

• **index**: `number`

• **value**: `string` \| [`FlattenedArray`](FlattenedArray.md) \| [`FlattenedMap`](FlattenedMap.md)

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/core/struct/array.flattened.ts:77](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/struct/array.flattened.ts#L77)

***

### length()

> **length**(): `Promise`\<`number`\>

#### Returns

`Promise`\<`number`\>

#### Defined in

[src/core/struct/array.flattened.ts:99](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/struct/array.flattened.ts#L99)

***

### push()

> **push**(`value`): `Promise`\<`number`\>

#### Parameters

• **value**: `string` \| [`FlattenedArray`](FlattenedArray.md) \| [`FlattenedMap`](FlattenedMap.md)

#### Returns

`Promise`\<`number`\>

#### Defined in

[src/core/struct/array.flattened.ts:93](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/struct/array.flattened.ts#L93)

***

### set()

> **set**(`index`, `value`): `Promise`\<`void`\>

#### Parameters

• **index**: `number`

• **value**: `undefined` \| `string` \| [`FlattenedArray`](FlattenedArray.md) \| [`FlattenedMap`](FlattenedMap.md)

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/core/struct/array.flattened.ts:29](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/struct/array.flattened.ts#L29)
