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

[src/core/network/fetchsub.service.ts:23](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/network/fetchsub.service.ts#L23)

## Methods

### addSubscriptionListener()

> **addSubscriptionListener**(`topic`, `listener`): `Promise`\<`void`\>

#### Parameters

• **topic**: `string`

• **listener**: `ListenerFunction`

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/core/network/fetchsub.service.ts:56](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/network/fetchsub.service.ts#L56)

***

### getSubscribers()

> **getSubscribers**(`topic`): `Promise`\<`PeerId`[]\>

#### Parameters

• **topic**: `string`

#### Returns

`Promise`\<`PeerId`[]\>

#### Defined in

[src/core/network/fetchsub.service.ts:73](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/network/fetchsub.service.ts#L73)

***

### removeSubscriptionListener()

> **removeSubscriptionListener**(`topic`, `listener`): `Promise`\<`void`\>

#### Parameters

• **topic**: `string`

• **listener**: `ListenerFunction`

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/core/network/fetchsub.service.ts:63](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/network/fetchsub.service.ts#L63)

***

### run()

> **run**(): `void`

#### Returns

`void`

#### Defined in

[src/core/network/fetchsub.service.ts:29](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/network/fetchsub.service.ts#L29)

***

### stop()

> **stop**(): `void`

#### Returns

`void`

#### Defined in

[src/core/network/fetchsub.service.ts:39](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/network/fetchsub.service.ts#L39)

***

### subscribe()

> **subscribe**(`topic`): `void`

#### Parameters

• **topic**: `string`

#### Returns

`void`

#### Defined in

[src/core/network/fetchsub.service.ts:44](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/network/fetchsub.service.ts#L44)

***

### unregisterHandleFetchSubscribers()

> **unregisterHandleFetchSubscribers**(): `void`

#### Returns

`void`

#### Defined in

[src/core/network/fetchsub.service.ts:52](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/network/fetchsub.service.ts#L52)

***

### unsubscribe()

> **unsubscribe**(`topic`): `void`

#### Parameters

• **topic**: `string`

#### Returns

`void`

#### Defined in

[src/core/network/fetchsub.service.ts:48](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/network/fetchsub.service.ts#L48)
