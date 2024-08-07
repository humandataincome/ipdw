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

[src/core/network/swarmsub.service.ts:19](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/network/swarmsub.service.ts#L19)

## Methods

### addSubscriptionListener()

> **addSubscriptionListener**(`topic`, `listener`): `Promise`\<`void`\>

#### Parameters

• **topic**: `string`

• **listener**: `ListenerFunction`

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/core/network/swarmsub.service.ts:50](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/network/swarmsub.service.ts#L50)

***

### getSubscribers()

> **getSubscribers**(`topic`): `Promise`\<`PeerId`[]\>

#### Parameters

• **topic**: `string`

#### Returns

`Promise`\<`PeerId`[]\>

#### Defined in

[src/core/network/swarmsub.service.ts:71](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/network/swarmsub.service.ts#L71)

***

### removeSubscriptionListener()

> **removeSubscriptionListener**(`topic`, `listener`): `Promise`\<`void`\>

#### Parameters

• **topic**: `string`

• **listener**: `ListenerFunction`

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/core/network/swarmsub.service.ts:59](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/network/swarmsub.service.ts#L59)

***

### run()

> **run**(): `void`

#### Returns

`void`

#### Defined in

[src/core/network/swarmsub.service.ts:23](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/network/swarmsub.service.ts#L23)

***

### stop()

> **stop**(): `void`

#### Returns

`void`

#### Defined in

[src/core/network/swarmsub.service.ts:30](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/network/swarmsub.service.ts#L30)

***

### subscribe()

> **subscribe**(`topic`): `Promise`\<`void`\>

#### Parameters

• **topic**: `string`

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/core/network/swarmsub.service.ts:34](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/network/swarmsub.service.ts#L34)

***

### unsubscribe()

> **unsubscribe**(`topic`): `Promise`\<`void`\>

#### Parameters

• **topic**: `string`

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/core/network/swarmsub.service.ts:43](https://github.com/ansi-code/ipdw/blob/d3334c70f49293ce3e0ff61a485778d41bda3a8d/src/core/network/swarmsub.service.ts#L43)
