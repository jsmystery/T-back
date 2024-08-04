import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { MailInput } from './inputs/mail.input'

@Injectable()
export class MailService {
	constructor(private readonly emailService: MailerService) {}

	async sendEmail(input: MailInput, context?: object) {
		const { subject, email, template } = input

		await this.emailService.sendMail({
			from: process.env.SITE_NAME,
			to: email,
			subject,
			template,
			context,
		})

		return true
	}
}
