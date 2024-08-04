import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class JwtAuthLoginInput {
	@Field(() => String)
	readonly login: string

	@Field(() => String)
	readonly password: string
}
