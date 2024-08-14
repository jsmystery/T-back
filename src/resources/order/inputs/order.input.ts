import { Field, InputType, Int } from '@nestjs/graphql'
import { TariffType } from 'src/resources/tariff/enums/tariff-type.enum'

@InputType()
export class OrderInput {
	@Field(() => Int)
	productId: number

	@Field(() => TariffType)
	tariffType: TariffType
}
