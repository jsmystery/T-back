import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class UpdateProductInputAdmin {
	@Field(() => String, { nullable: true })
	name?: string  

	@Field(() => String, { nullable: true })
	about?: string  

  @Field(() => [String])
	imagesPaths?: string[]

  @Field(() => String)
	posterPath?: string

  //  @Field(() => Number)
  //  price: number;
 
  //  @Field(() => Number)
  //  minQuantity: number;

   
  // @Field(() => Number, { nullable: true })
  // price2?: number;

  // @Field(() => Number, { nullable: true })
  // minQuantity2?: number;

  // @Field(() => Number, { nullable: true })
  // price3?: number;

  // @Field(() => Number, { nullable: true })
  // minQuantity3?: number;
}
