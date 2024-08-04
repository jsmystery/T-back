import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class MailInput {
	@Field(() => String)
	email: string

	@Field(() => String)
	subject: string

	@Field(() => String)
	template: string
}
