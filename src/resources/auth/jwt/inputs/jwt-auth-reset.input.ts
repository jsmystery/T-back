import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class JwtAuthResetInput {
	@Field(() => String)
	readonly token: string

	@Field(() => String)
	readonly newPassword: string
}
