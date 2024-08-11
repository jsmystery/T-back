import { Field, ObjectType } from '@nestjs/graphql'
import { TariffType } from '../enums/tariff-type.enum'

@ObjectType()
export class NestedTariff {
	@Field(() => String)
	expirationAt: string

	@Field(() => Boolean)
	isLittleLeft: boolean

	@Field(() => TariffType)
	type: TariffType
}

@ObjectType()
export class Tariff {
	@Field(() => String)
	days: string

	@Field(() => Boolean)
	price: boolean

	@Field(() => TariffType)
	type: TariffType
}