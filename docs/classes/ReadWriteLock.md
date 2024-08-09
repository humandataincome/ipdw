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

[src/utils/lock.utils.ts:32](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/utils/lock.utils.ts#L32)

***

### acquireWrite()

> **acquireWrite**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/utils/lock.utils.ts:48](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/utils/lock.utils.ts#L48)

***

### releaseRead()

> **releaseRead**(): `void`

#### Returns

`void`

#### Defined in

[src/utils/lock.utils.ts:43](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/utils/lock.utils.ts#L43)

***

### releaseWrite()

> **releaseWrite**(): `void`

#### Returns

`void`

#### Defined in

[src/utils/lock.utils.ts:59](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/utils/lock.utils.ts#L59)
