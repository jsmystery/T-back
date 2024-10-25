import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateProductInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  about: string;

  @Field(() => Number)
  price: number;

  @Field(() => Number)
  minQuantity: number;

  @Field(() => Number, { nullable: true })
  price2?: number;

  @Field(() => Number, { nullable: true })
  minQuantity2?: number;

  @Field(() => Number, { nullable: true })
  price3?: number;

  @Field(() => Number, { nullable: true })
  minQuantity3?: number;

//   @Field(() => Int)
//   brandId: number;

//   @Field(() => Int)
//   categoryId: number;

//   @Field(() => Int)
//   rating: number;

//   @Field(() => Int)
//   views: number;

//   @Field(() => String)
//   posterPath: string;
}