[**ipdw**](../README.md) • **Docs**

***

[ipdw](../globals.md) / ReadWriteLock

# Class: ReadWriteLock

## Constructors

### new ReadWriteLock()

> **new ReadWriteLock**(): [`ReadWriteLock`](ReadWriteLock.md)

#### Returns

[`ReadWriteLock`](ReadWriteLock.md)

## Methods

### acquireRead()

> **acquireRead**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/utils/lock.utils.ts:32](https://github.com/ansi-code/ipdw/blob/ddce49f30075d034810cb5fb58d4bd8d0a9b98e6/src/utils/lock.utils.ts#L32)

***

### acquireWrite()

> **acquireWrite**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/utils/lock.utils.ts:48](https://github.com/ansi-code/ipdw/blob/ddce49f30075d034810cb5fb58d4bd8d0a9b98e6/src/utils/lock.utils.ts#L48)

***

### releaseRead()

> **releaseRead**(): `void`

#### Returns

`void`

#### Defined in

[src/utils/lock.utils.ts:43](https://github.com/ansi-code/ipdw/blob/ddce49f30075d034810cb5fb58d4bd8d0a9b98e6/src/utils/lock.utils.ts#L43)

***

### releaseWrite()

> **releaseWrite**(): `void`

#### Returns

`void`

#### Defined in

[src/utils/lock.utils.ts:59](https://github.com/ansi-code/ipdw/blob/ddce49f30075d034810cb5fb58d4bd8d0a9b98e6/src/utils/lock.utils.ts#L59)
