import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class YookassaInput {
	@Field(() => String)
	amount: string

	@Field(() => String)
	redirectUrl: string
}
