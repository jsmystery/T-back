import { Field, Int, ObjectType } from '@nestjs/graphql'
import { TariffType } from '../enums/tariff-type.enum'

@ObjectType()
export class NestedTariff {
	@Field(() => TariffType)
	type: TariffType
}

@ObjectType()
export class Tariff extends NestedTariff {
	@Field(() => Int)
	price: number

	@Field(() => String, { nullable: true })
	description: string

	@Field(() => Int, { nullable: true })
	duration?: number
}
