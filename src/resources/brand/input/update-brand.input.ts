import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class UpdateBrandInput {
  @Field(() => String)
  name: string

  @Field(() => String)
  city: string

  @Field(() => String)
  about: string
}