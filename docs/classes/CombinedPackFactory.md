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

[src/core/pack/combined-pack.factory.ts:6](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/pack/combined-pack.factory.ts#L6)

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

[src/core/pack/combined-pack.factory.ts:10](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/pack/combined-pack.factory.ts#L10)

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

[src/core/pack/combined-pack.factory.ts:18](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/pack/combined-pack.factory.ts#L18)
