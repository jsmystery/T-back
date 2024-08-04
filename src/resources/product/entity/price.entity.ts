import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Price {
	@Field(() => Int)
	price: number

	@Field(() => Int)
	minQuantity: number
}