import { Module } from '@nestjs/common'
import { AuthResolver } from './auth.resolver'
import { AuthService } from './auth.service'
import { JwtAuthModule } from './jwt/jwt-auth.module'
import { TelegramAuthModule } from './telegram/telegram-auth.module'

@Module({
	providers: [AuthResolver, AuthService],
	imports: [JwtAuthModule, TelegramAuthModule],
})
export class AuthModule {}
