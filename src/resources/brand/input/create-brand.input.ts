import { InputType, Field, Int, Float } from '@nestjs/graphql';

@InputType()
export class CreateBrandInput {

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

}
