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

[src/utils/lock.utils.ts:32](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/utils/lock.utils.ts#L32)

***

### acquireWrite()

> **acquireWrite**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/utils/lock.utils.ts:48](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/utils/lock.utils.ts#L48)

***

### releaseRead()

> **releaseRead**(): `void`

#### Returns

`void`

#### Defined in

[src/utils/lock.utils.ts:43](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/utils/lock.utils.ts#L43)

***

### releaseWrite()

> **releaseWrite**(): `void`

#### Returns

`void`

#### Defined in

[src/utils/lock.utils.ts:59](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/utils/lock.utils.ts#L59)
