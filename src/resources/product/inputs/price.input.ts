import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class PriceInput {
	@Field(() => String)
	price: string

	@Field(() => String)
	minQuantity: string
}
