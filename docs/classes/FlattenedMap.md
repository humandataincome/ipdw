[**ipdw**](../README.md) • **Docs**

***

[ipdw](../globals.md) / FlattenedMap

# Class: FlattenedMap

## Constructors

### new FlattenedMap()

> **new FlattenedMap**(`storage`, `prefix`): [`FlattenedMap`](FlattenedMap.md)

#### Parameters

• **storage**: [`StorageProvider`](../interfaces/StorageProvider.md)

• **prefix**: `string` = `''`

#### Returns

[`FlattenedMap`](FlattenedMap.md)

#### Defined in

[src/core/struct/map.flattened.ts:5](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/struct/map.flattened.ts#L5)

## Methods

### copyTo()

> **copyTo**(`storage`, `newPrefix`): `Promise`\<`void`\>

#### Parameters

• **storage**: [`StorageProvider`](../interfaces/StorageProvider.md)

• **newPrefix**: `string`

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/core/struct/map.flattened.ts:61](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/struct/map.flattened.ts#L61)

***

### delete()

> **delete**(`key`): `Promise`\<`void`\>

#### Parameters

• **key**: `string`

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/core/struct/map.flattened.ts:44](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/struct/map.flattened.ts#L44)

***

### get()

> **get**(`key`): `Promise`\<`undefined` \| `string` \| [`FlattenedArray`](FlattenedArray.md) \| [`FlattenedMap`](FlattenedMap.md)\>

#### Parameters

• **key**: `string`

#### Returns

`Promise`\<`undefined` \| `string` \| [`FlattenedArray`](FlattenedArray.md) \| [`FlattenedMap`](FlattenedMap.md)\>

#### Defined in

[src/core/struct/map.flattened.ts:8](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/struct/map.flattened.ts#L8)

***

### has()

> **has**(`key`): `Promise`\<`boolean`\>

#### Parameters

• **key**: `string`

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/core/struct/map.flattened.ts:40](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/struct/map.flattened.ts#L40)

***

### keys()

> **keys**(): `Promise`\<`string`[]\>

#### Returns

`Promise`\<`string`[]\>

#### Defined in

[src/core/struct/map.flattened.ts:53](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/struct/map.flattened.ts#L53)

***

### set()

> **set**(`key`, `value`): `Promise`\<`void`\>

#### Parameters

• **key**: `string`

• **value**: `undefined` \| `string` \| [`FlattenedArray`](FlattenedArray.md) \| [`FlattenedMap`](FlattenedMap.md)

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/core/struct/map.flattened.ts:29](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/struct/map.flattened.ts#L29)
