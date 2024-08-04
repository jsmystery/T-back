import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { GqlContext } from 'src/shared/types/gql-context.type'
import { AuthService } from '../auth.service'
import { SessionUserResponse } from '../helpers/entities/session-user-response.entity'
import { JwtAuthConfirmationInput } from './inputs/jwt-auth-confirmation.input'
import { JwtAuthLoginInput } from './inputs/jwt-auth-login.input'
import { JwtAuthResetInput } from './inputs/jwt-auth-reset.input'
import { JwtAuthVerificationInput } from './inputs/jwt-auth-verification.input'
import { JwtAuthService } from './jwt-auth.service'

@Resolver()
export class JwtAuthResolver {
	constructor(
		private readonly jwtAuthService: JwtAuthService,
		private readonly authService: AuthService
	) {}

	@Mutation(() => Boolean, { name: 'jwtConfirmation' })
	async sendConfirmation(@Args('data') input: JwtAuthConfirmationInput) {
		try {
			return this.jwtAuthService.sendConfirmation(input)
		} catch (err) {
			return false
		}
	}

	@Mutation(() => Boolean, { name: 'jwtVerification' })
	async sendVerification(@Args('data') input: JwtAuthVerificationInput) {
		try {
			return this.jwtAuthService.sendVerification(input)
		} catch (err) {
			return false
		}
	}

	@Query(() => SessionUserResponse, { name: 'jwtRegister' })
	async register(@Args('token') token: string, @Context() { res }: GqlContext) {
		const { refreshToken, accessToken, ...response } =
			await this.jwtAuthService.register(token)

		await this.authService.addRefreshTokenToCookies(res, refreshToken)
		await this.authService.addAccessTokenToCookies(res, accessToken)

		return response
	}

	@Mutation(() => SessionUserResponse, { name: 'jwtLogin' })
	async login(
		@Args('data') input: JwtAuthLoginInput,
		@Context() { res }: GqlContext
	) {
		const { refreshToken, accessToken, ...response } =
			await this.jwtAuthService.login(input)

		await this.authService.addRefreshTokenToCookies(res, refreshToken)
		await this.authService.addAccessTokenToCookies(res, accessToken)

		return response
	}

	@Mutation(() => Boolean, { name: 'jwtReset' })
	async reset(@Args('data') input: JwtAuthResetInput) {
		try {
			return this.jwtAuthService.reset(input)
		} catch (err) {
			return false
		}
	}
}
