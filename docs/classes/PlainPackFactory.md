[**ipdw**](../README.md) • **Docs**

***

[ipdw](../globals.md) / PlainPackFactory

# Class: PlainPackFactory

## Implements

- [`PackFactory`](../interfaces/PackFactory.md)

## Constructors

### new PlainPackFactory()

> **new PlainPackFactory**(): [`PlainPackFactory`](PlainPackFactory.md)

#### Returns

[`PlainPackFactory`](PlainPackFactory.md)

## Methods

### decode()

> **decode**(`pack`): `Promise`\<`undefined` \| `Uint8Array`\>

#### Parameters

• **pack**: `Uint8Array`

#### Returns

`Promise`\<`undefined` \| `Uint8Array`\>

#### Implementation of

[`PackFactory`](../interfaces/PackFactory.md).[`decode`](../interfaces/PackFactory.md#decode)

#### Defined in

[src/core/pack/plain-pack.factory.ts:4](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/pack/plain-pack.factory.ts#L4)

***

### encode()

> **encode**(`value`): `Promise`\<`Uint8Array`\>

#### Parameters

• **value**: `Uint8Array`

#### Returns

`Promise`\<`Uint8Array`\>

#### Implementation of

[`PackFactory`](../interfaces/PackFactory.md).[`encode`](../interfaces/PackFactory.md#encode)

#### Defined in

[src/core/pack/plain-pack.factory.ts:8](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/pack/plain-pack.factory.ts#L8)
