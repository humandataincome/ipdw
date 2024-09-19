[**ipdw**](../README.md) • **Docs**

***

[ipdw](../globals.md) / SignedPackFactory

# Class: SignedPackFactory

## Implements

- [`PackFactory`](../interfaces/PackFactory.md)

## Constructors

### new SignedPackFactory()

> **new SignedPackFactory**(`publicKey`, `privateKey`?): [`SignedPackFactory`](SignedPackFactory.md)

#### Parameters

• **publicKey**: `Buffer`

• **privateKey?**: `Buffer`

#### Returns

[`SignedPackFactory`](SignedPackFactory.md)

#### Defined in

[src/core/pack/signed-pack.factory.ts:10](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/pack/signed-pack.factory.ts#L10)

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

[src/core/pack/signed-pack.factory.ts:15](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/pack/signed-pack.factory.ts#L15)

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

[src/core/pack/signed-pack.factory.ts:30](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/pack/signed-pack.factory.ts#L30)
