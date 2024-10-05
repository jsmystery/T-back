import { InputType, Field, Int, Float } from '@nestjs/graphql';

@InputType()
export class CreateBrandInput {
//   @Field(() => Int)
//   id: number;

//   @Field(() => Date)
//   createdAt?: Date;

  @Field(() => String)
  name: string;

  @Field(() => String)
  slug: string;

  @Field(() => String)
  city: string;

  @Field(() => String)
  logoPath?: string;

  @Field(() => String)
  about: string;

//   @Field(() => [String])
//   subscribers: string[];

//   @Field(() => Float)
//   rating: number;

//   @Field(() => Int)
//   balance: number;

//   @Field(() => Int, { nullable: true })
//   categoryId?: number;

//   @Field(() => Int, { nullable: true })
//   userId?: number;
}
