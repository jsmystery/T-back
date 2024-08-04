import { Query, Resolver } from '@nestjs/graphql'
import { Auth } from '../auth/helpers/decorators/auth.decorator'
import { CurrentUser } from './decorators/user.decorator'
import { SessionUser } from './entities/session/user.entity'
import { UserService } from './user.service'

@Resolver()
export class UserResolver {
	constructor(private readonly userService: UserService) {}

	@Auth()
	@Query(() => SessionUser, { name: 'user' })
	async getCurrentUser(@CurrentUser('id') id: number) {
		return this.userService.byId(id)
	}
}
