import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import type { GqlContext } from 'src/shared/types/gql-context.type'
import { AuthService } from '../auth.service'
import { SessionUserResponse } from '../helpers/entities/session-user-response.entity'
import { TelegramAuthInput } from './inputs/telegram-auth.input'
import { TelegramAuthService } from './telegram-auth.service'

@Resolver()
export class TelegramAuthResolver {
	constructor(
		private readonly telegramAuthService: TelegramAuthService,
		private readonly authService: AuthService
	) {}

	@Mutation(() => SessionUserResponse, { name: 'telegramAuth' })
	async telegramAuth(
		@Args('data') input: TelegramAuthInput,
		@Context() { res }: GqlContext
	) {
		const { refreshToken, accessToken, ...response } =
			await this.telegramAuthService.auth(input)

		await this.authService.addRefreshTokenToCookies(res, refreshToken)
		await this.authService.addAccessTokenToCookies(res, accessToken)

		return response
	}
}
