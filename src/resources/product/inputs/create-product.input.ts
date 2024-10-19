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