import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class SessionProfile {
	@Field(() => String)
	login: string

	@Field(() => String, { nullable: true })
	email?: string

	@Field(() => String, { nullable: true })
	phone?: string
}

@ObjectType()
export class Profile extends SessionProfile {
	@Field(() => String)
	password: string
}
