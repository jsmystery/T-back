import { Context, Mutation, Resolver } from '@nestjs/graphql'
import { GqlContext } from 'src/shared/types/gql-context.type'
import { AuthService } from './auth.service'
import { Auth } from './helpers/decorators/auth.decorator'

@Resolver()
export class AuthResolver {
	constructor(private readonly authService: AuthService) {}

	@Auth()
	@Mutation(() => Boolean, { name: 'logout' })
	async logout(@Context() { res }: GqlContext) {
		return this.authService.logout(res)
	}
}
