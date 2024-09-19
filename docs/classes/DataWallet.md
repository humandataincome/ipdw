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

[src/core/datawallet.ts:5](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/datawallet.ts#L5)
