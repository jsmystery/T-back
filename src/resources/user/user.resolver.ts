import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Auth } from '../auth/helpers/decorators/auth.decorator'
import { CurrentUser } from './decorators/user.decorator'
import { SessionUser } from './entities/session/session-user.entity'
import { UserList } from './entities/full/users.entity'
import { UserService } from './user.service'
import { UpdateUserInput } from './inputs/update-user.input'
import { UpdateUserAdminInput } from './inputs/update-user-admin.input'
import { UserRole } from '../user/enums/user-role.enum'


@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Auth()
  @Query(() => SessionUser, { name: 'user' })
  async getCurrentUser(@CurrentUser('id') id: number) {
    return this.userService.byId(id)
  }

//   @Auth()
  @Query(() => [UserList], { name: 'allUsers' })
  async getAllUsers() {
    return this.userService.getAllUsers()
  }

  @Auth()
  @Mutation(() => Boolean, { name: 'updateUserProfile' })
  async updateUserProfile(
    @Args('input') input: UpdateUserInput,
    @CurrentUser('id') id: number
  ) {
    return this.userService.updateUserProfile(id, input)
  }

	@Auth(UserRole.ADMIN)
  @Mutation(() => Boolean, { name: 'updateUserProfileAdmin' })
  async updateUserProfileAdmin(
    @Args('input') input: UpdateUserAdminInput
  ) {
    return this.userService.updateUserProfileAdmin(input)
  }

  @Auth(UserRole.ADMIN)
  @Mutation(() => Boolean, { name: 'deleteUser' })
  async deleteUser(
    @Args('id', { type: () => Number }) id: number
  ) {
    return this.userService.deleteUser(id)
  }
}
