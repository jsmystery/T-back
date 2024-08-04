import { registerEnumType } from '@nestjs/graphql'

export enum AdvertisingType {
	LARGE = 'LARGE',
	BANNER = 'BANNER',
	SMALL = 'SMALL',
	CATALOG = 'CATALOG',
	CARD = 'CARD',
}

registerEnumType(AdvertisingType, {
	name: 'AdvertisingType',
})
