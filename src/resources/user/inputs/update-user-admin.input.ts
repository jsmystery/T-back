import { Field, InputType } from '@nestjs/graphql'
// import { IsEmail, IsOptional, IsString } from 'class-validator'

@InputType()
export class UpdateUserAdminInput {
  @Field(() => Number)
  userId: number

  @Field(() => String, { nullable: true })

  whatsapp?: string

  @Field(() => String, { nullable: true })

  telegram?: string

  @Field(() => String, { nullable: true })
 
  phone?: string

  @Field(() => String, { nullable: true })

  email?: string

  @Field(() => String, { nullable: true })
 
  login?: string
}