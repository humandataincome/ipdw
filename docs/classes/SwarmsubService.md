[**ipdw**](../README.md) • **Docs**

***

[ipdw](../globals.md) / SwarmsubService

# Class: SwarmsubService

## Constructors

### new SwarmsubService()

> **new SwarmsubService**(`node`): [`SwarmsubService`](SwarmsubService.md)

#### Parameters

• **node**: `Libp2p`\<`object`\>

#### Returns

[`SwarmsubService`](SwarmsubService.md)

#### Defined in

[src/core/network/swarmsub.service.ts:23](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/network/swarmsub.service.ts#L23)

## Methods

### addSubscriptionListener()

> **addSubscriptionListener**(`topic`, `listener`): `Promise`\<`void`\>

#### Parameters

• **topic**: `string`

• **listener**: `ListenerFunction`

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/core/network/swarmsub.service.ts:54](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/network/swarmsub.service.ts#L54)

***

### getSubscribers()

> **getSubscribers**(`topic`): `Promise`\<`PeerId`[]\>

#### Parameters

• **topic**: `string`

#### Returns

`Promise`\<`PeerId`[]\>

#### Defined in

[src/core/network/swarmsub.service.ts:75](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/network/swarmsub.service.ts#L75)

***

### removeSubscriptionListener()

> **removeSubscriptionListener**(`topic`, `listener`): `Promise`\<`void`\>

#### Parameters

• **topic**: `string`

• **listener**: `ListenerFunction`

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/core/network/swarmsub.service.ts:63](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/network/swarmsub.service.ts#L63)

***

### run()

> **run**(): `void`

#### Returns

`void`

#### Defined in

[src/core/network/swarmsub.service.ts:27](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/network/swarmsub.service.ts#L27)

***

### stop()

> **stop**(): `void`

#### Returns

`void`

#### Defined in

[src/core/network/swarmsub.service.ts:34](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/network/swarmsub.service.ts#L34)

***

### subscribe()

> **subscribe**(`topic`): `Promise`\<`void`\>

#### Parameters

• **topic**: `string`

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/core/network/swarmsub.service.ts:38](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/network/swarmsub.service.ts#L38)

***

### unsubscribe()

> **unsubscribe**(`topic`): `Promise`\<`void`\>

#### Parameters

• **topic**: `string`

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/core/network/swarmsub.service.ts:47](https://github.com/humandataincome/ipdw/blob/cffd44f47ee394d38eaa57c50e77342565775d5e/src/core/network/swarmsub.service.ts#L47)
