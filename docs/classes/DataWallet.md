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

> `static` **Create**\<`StorageProviderT`\>(`privateKey`, `storageProvider`, `salt`): `Promise`\<[`FlattenedMap`](FlattenedMap.md)\<[`PackedStorageOverlay`](PackedStorageOverlay.md)\<[`VersionedStorageOverlay`](VersionedStorageOverlay.md)\<`StorageProviderT`\>, [`EncryptedPackFactory`](EncryptedPackFactory.md), [`CombinedPackFactory`](CombinedPackFactory.md)\>\>\>

#### Type Parameters

• **StorageProviderT** *extends* [`StorageProvider`](../interfaces/StorageProvider.md)

#### Parameters

• **privateKey**: `string`

• **storageProvider**: `StorageProviderT`

• **salt**: `Buffer` = `...`

#### Returns

`Promise`\<[`FlattenedMap`](FlattenedMap.md)\<[`PackedStorageOverlay`](PackedStorageOverlay.md)\<[`VersionedStorageOverlay`](VersionedStorageOverlay.md)\<`StorageProviderT`\>, [`EncryptedPackFactory`](EncryptedPackFactory.md), [`CombinedPackFactory`](CombinedPackFactory.md)\>\>\>

#### Defined in

[src/core/datawallet.ts:5](https://github.com/ansi-code/ipdw/blob/ddce49f30075d034810cb5fb58d4bd8d0a9b98e6/src/core/datawallet.ts#L5)
