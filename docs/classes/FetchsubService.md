[**ipdw**](../README.md) • **Docs**

***

[ipdw](../globals.md) / FetchsubService

# Class: FetchsubService

## Constructors

### new FetchsubService()

> **new FetchsubService**(`node`): [`FetchsubService`](FetchsubService.md)

#### Parameters

• **node**: `Libp2p`\<`object`\>

#### Returns

[`FetchsubService`](FetchsubService.md)

#### Defined in

[src/core/network/fetchsub.service.ts:20](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/network/fetchsub.service.ts#L20)

## Methods

### addSubscriptionListener()

> **addSubscriptionListener**(`topic`, `listener`): `Promise`\<`void`\>

#### Parameters

• **topic**: `string`

• **listener**: `ListenerFunction`

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/core/network/fetchsub.service.ts:51](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/network/fetchsub.service.ts#L51)

***

### getSubscribers()

> **getSubscribers**(`topic`): `Promise`\<`PeerId`[]\>

#### Parameters

• **topic**: `string`

#### Returns

`Promise`\<`PeerId`[]\>

#### Defined in

[src/core/network/fetchsub.service.ts:68](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/network/fetchsub.service.ts#L68)

***

### removeSubscriptionListener()

> **removeSubscriptionListener**(`topic`, `listener`): `Promise`\<`void`\>

#### Parameters

• **topic**: `string`

• **listener**: `ListenerFunction`

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/core/network/fetchsub.service.ts:58](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/network/fetchsub.service.ts#L58)

***

### run()

> **run**(): `void`

#### Returns

`void`

#### Defined in

[src/core/network/fetchsub.service.ts:26](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/network/fetchsub.service.ts#L26)

***

### stop()

> **stop**(): `void`

#### Returns

`void`

#### Defined in

[src/core/network/fetchsub.service.ts:34](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/network/fetchsub.service.ts#L34)

***

### subscribe()

> **subscribe**(`topic`): `void`

#### Parameters

• **topic**: `string`

#### Returns

`void`

#### Defined in

[src/core/network/fetchsub.service.ts:39](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/network/fetchsub.service.ts#L39)

***

### unregisterHandleFetchSubscribers()

> **unregisterHandleFetchSubscribers**(): `void`

#### Returns

`void`

#### Defined in

[src/core/network/fetchsub.service.ts:47](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/network/fetchsub.service.ts#L47)

***

### unsubscribe()

> **unsubscribe**(`topic`): `void`

#### Parameters

• **topic**: `string`

#### Returns

`void`

#### Defined in

[src/core/network/fetchsub.service.ts:43](https://github.com/ansi-code/ipdw/blob/01fadcc9abca9fbd90e38855b259b101aa727349/src/core/network/fetchsub.service.ts#L43)
