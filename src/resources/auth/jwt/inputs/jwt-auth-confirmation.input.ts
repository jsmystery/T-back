import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class JwtAuthConfirmationInput {
	@Field(() => String)
	readonly email: string

	@Field(() => String)
	readonly login: string

	@Field(() => String)
	readonly phone: string

	@Field(() => String)
	readonly password: string

	@Field(() => String)
	readonly confirmPassword: string
}
