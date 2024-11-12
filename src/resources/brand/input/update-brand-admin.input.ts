import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class UpdateBrandInputAdmin {
  @Field(() => String)
  name: string

  @Field(() => String)
  city: string

  @Field(() => String)
  about: string

  @Field(() => String)
  logoPath: string

  @Field(() => String)
  slug: string
}