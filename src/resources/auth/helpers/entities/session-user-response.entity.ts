import { Field, ObjectType } from '@nestjs/graphql'
import { SessionUser } from 'src/resources/user/entities/session/user.entity'

@ObjectType()
export class SessionUserResponse {
	@Field(() => SessionUser)
	user: SessionUser
}
