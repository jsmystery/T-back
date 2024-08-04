import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class SeoInput {
	@Field(() => String)
	title: string

	@Field(() => String)
	description: string
}
