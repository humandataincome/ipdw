[**ipdw**](../README.md) • **Docs**

***

[ipdw](../globals.md) / DataWallet

# Class: DataWallet

## Constructors

### new DataWallet()

> **new DataWallet**(): [`DataWallet`](DataWallet.md)

#### Returns

[`DataWallet`](DataWallet.md)

## Methods

### Create()

> `static` **Create**(`privateKey`, `storageProvider`, `salt`): `Promise`\<[`FlattenedMap`](FlattenedMap.md)\>

#### Parameters

• **privateKey**: `string`

• **storageProvider**: [`StorageProvider`](../interfaces/StorageProvider.md)

• **salt**: `Buffer` = `...`

#### Returns

`Promise`\<[`FlattenedMap`](FlattenedMap.md)\>

#### Defined in

[src/core/datawallet.ts:5](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/datawallet.ts#L5)
