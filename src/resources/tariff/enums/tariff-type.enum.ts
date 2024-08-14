import { registerEnumType } from '@nestjs/graphql'

export enum TariffType {
	TOP = 'TOP',
	FILL = 'FILL',
	VIP = 'VIP',
}

registerEnumType(TariffType, {
	name: 'TariffType',
})
