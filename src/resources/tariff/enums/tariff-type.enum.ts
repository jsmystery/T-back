import { registerEnumType } from '@nestjs/graphql'

export enum TariffType {
	TOP = 'TOP',
	HOT = 'HOT',
	VIP = 'VIP',
}

registerEnumType(TariffType, {
	name: 'TariffType',
})
