import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class TelegramAuthInput {
	@Field(() => String)
	login: string

	@Field(() => String)
	password: string
}
