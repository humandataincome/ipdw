[**ipdw**](../README.md) • **Docs**

***

[ipdw](../globals.md) / CombinedPackFactory

# Class: CombinedPackFactory

## Implements

- [`PackFactory`](../interfaces/PackFactory.md)

## Constructors

### new CombinedPackFactory()

> **new CombinedPackFactory**(`packFactories`): [`CombinedPackFactory`](CombinedPackFactory.md)

#### Parameters

• **packFactories**: [`PackFactory`](../interfaces/PackFactory.md)[]

#### Returns

[`CombinedPackFactory`](CombinedPackFactory.md)

#### Defined in

[src/core/pack/combined-pack.factory.ts:6](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/pack/combined-pack.factory.ts#L6)

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

[src/core/pack/combined-pack.factory.ts:10](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/pack/combined-pack.factory.ts#L10)

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

[src/core/pack/combined-pack.factory.ts:18](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/pack/combined-pack.factory.ts#L18)
