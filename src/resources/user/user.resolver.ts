import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Auth } from '../auth/helpers/decorators/auth.decorator'
import { CurrentUser } from './decorators/user.decorator'
import { SessionUser } from './entities/session/session-user.entity'
import { UserService } from './user.service'
import { UpdateUserInput } from './inputs/update-user.input' 

@Resolver()
export class UserResolver {
	constructor(private readonly userService: UserService) {}

	@Auth()
	@Query(() => SessionUser, { name: 'user' })
	async getCurrentUser(@CurrentUser('id') id: number) {
		return this.userService.byId(id)
	}


	@Auth()
	@Mutation(() => Boolean, { name: 'updateUserProfile' })
	async updateUserProfile(
		@Args('input') input: UpdateUserInput, // Highlight: Accept input for updating the profile fields
		@CurrentUser('id') id: number // Highlight: Get the current user's ID
	) {
		return this.userService.updateUserProfile(id, input) // Highlight: Call the service to update the user's profile
	}
}
