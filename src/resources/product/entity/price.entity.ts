import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Price { 
	@Field(() => String)
	price: string | number 

	@Field(() => String)
	minQuantity: string | number 
}
