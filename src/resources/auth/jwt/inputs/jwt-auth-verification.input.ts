import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class JwtAuthVerificationInput {
	@Field(() => String)
	readonly email: string
}
