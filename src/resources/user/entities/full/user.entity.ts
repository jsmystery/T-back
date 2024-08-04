import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Brand } from '../../../brand/entities/brand.entity'
import { UserRole } from '../../enums/user-role.enum'
import { Profile } from '../profile/profile.entity'

@ObjectType()
export class User {
	@Field(() => Int)
	id: number

	@Field(() => Profile)
	profile: Profile

	@Field(() => Brand)
	brand: Brand

	@Field(() => UserRole)
	role: UserRole
}
