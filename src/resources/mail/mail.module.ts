import { MailerModule } from '@nestjs-modules/mailer'
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter'
import { Module } from '@nestjs/common'
import { MailService } from './mail.service'

@Module({
	providers: [MailService],
	imports: [
		MailerModule.forRoot({
			transport: {
				service: process.env.EMAIL_SERVICE,
				host: process.env.EMAIL_HOST,
				port: +process.env.EMAIL_PORT,
				ignoreTLS: true,
				secure: true,
				auth: {
					user: process.env.EMAIL_USER,
					pass: process.env.EMAIL_PASSWORD,
				},
			},
			template: {
				dir: `${process.cwd()}/src/resources/mail/templates`,
				adapter: new PugAdapter(),
				options: {
					strict: true,
				},
			},
		}),
	],
})
export class MailModule {}
