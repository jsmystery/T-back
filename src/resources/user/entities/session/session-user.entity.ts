import { Field, ObjectType } from '@nestjs/graphql'
import { UserRole } from '../../enums/user-role.enum'
import { SessionProfile } from '../profile/profile.entity'

@ObjectType()
export class SessionUser {
	@Field(() => SessionProfile)
	profile: SessionProfile

	@Field(() => UserRole)
	role: UserRole
}
