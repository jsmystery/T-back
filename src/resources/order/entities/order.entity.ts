import { Field, ObjectType } from '@nestjs/graphql'
import { NestedTariff } from 'src/resources/tariff/entities/tariff.entity'

@ObjectType()
export class NestedOrder {
	@Field(() => String, { nullable: true })
	expirationDate?: string

	@Field(() => Boolean, { nullable: true })
	isLittleLeft?: boolean

	@Field(() => NestedTariff)
	tariff: NestedTariff
}
