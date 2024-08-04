import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class SessionProfile {
	@Field(() => String)
	login: string

	@Field(() => String)
	email: string

	@Field(() => String)
	phone: string
}

@ObjectType()
export class Profile extends SessionProfile {
	@Field(() => String)
	password: string
}
