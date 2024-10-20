import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class UpdateProductInput {
	@Field(() => String, { nullable: true })
	name?: string  

	@Field(() => String, { nullable: true })
	about?: string  

   @Field(() => Number)
   price: number;
 
   @Field(() => Number)
   minQuantity: number;
}
