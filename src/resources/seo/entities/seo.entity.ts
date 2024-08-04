import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Seo {
	@Field(() => String)
	title: string

	@Field(() => String)
	description: string
}
