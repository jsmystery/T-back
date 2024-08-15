import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Price {
	@Field(() => String)
	price: string

	@Field(() => String)
	minQuantity: string
}
