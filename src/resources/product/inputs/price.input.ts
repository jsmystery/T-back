import { Field, InputType, Int } from '@nestjs/graphql'

@InputType()
export class PriceInput {
	@Field(() => Int)
	price: number

	@Field(() => Int)
	minQuantity: number
}
