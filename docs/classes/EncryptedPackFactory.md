[**ipdw**](../README.md) • **Docs**

***

[ipdw](../globals.md) / EncryptedPackFactory

# Class: EncryptedPackFactory

## Implements

- [`PackFactory`](../interfaces/PackFactory.md)

## Constructors

### new EncryptedPackFactory()

> **new EncryptedPackFactory**(`key`): [`EncryptedPackFactory`](EncryptedPackFactory.md)

#### Parameters

• **key**: `Buffer`

#### Returns

[`EncryptedPackFactory`](EncryptedPackFactory.md)

#### Defined in

[src/core/pack/encrypted-pack.factory.ts:9](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/pack/encrypted-pack.factory.ts#L9)

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

[src/core/pack/encrypted-pack.factory.ts:13](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/pack/encrypted-pack.factory.ts#L13)

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

[src/core/pack/encrypted-pack.factory.ts:26](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/pack/encrypted-pack.factory.ts#L26)
