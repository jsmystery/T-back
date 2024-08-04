import { Resolver } from '@nestjs/graphql'
import { TelegramAuthService } from './telegram-auth.service'

@Resolver()
export class TelegramAuthResolver {
	constructor(private readonly telegramAuthService: TelegramAuthService) {}
}
