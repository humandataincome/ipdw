[**ipdw**](../README.md) • **Docs**

***

[ipdw](../globals.md) / StorageProvider

# Interface: StorageProvider

## Methods

### clear()

> **clear**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/core/storage/storage.interface.ts:10](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/storage/storage.interface.ts#L10)

***

### get()

> **get**(`key`): `Promise`\<`undefined` \| `Uint8Array`\>

#### Parameters

• **key**: `string`

#### Returns

`Promise`\<`undefined` \| `Uint8Array`\>

#### Defined in

[src/core/storage/storage.interface.ts:6](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/storage/storage.interface.ts#L6)

***

### has()

> **has**(`key`): `Promise`\<`boolean`\>

#### Parameters

• **key**: `string`

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/core/storage/storage.interface.ts:4](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/storage/storage.interface.ts#L4)

***

### ls()

> **ls**(): `Promise`\<`string`[]\>

#### Returns

`Promise`\<`string`[]\>

#### Defined in

[src/core/storage/storage.interface.ts:8](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/storage/storage.interface.ts#L8)

***

### set()

> **set**(`key`, `value`): `Promise`\<`void`\>

#### Parameters

• **key**: `string`

• **value**: `undefined` \| `Uint8Array`

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/core/storage/storage.interface.ts:2](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/storage/storage.interface.ts#L2)
