import { Module } from '@nestjs/common'
import { MailService } from 'src/resources/mail/mail.service'
import { JwtAuthResolver } from './jwt-auth.resolver'
import { JwtAuthService } from './jwt-auth.service'

@Module({
	providers: [JwtAuthResolver, JwtAuthService, MailService],
})
export class JwtAuthModule {}
