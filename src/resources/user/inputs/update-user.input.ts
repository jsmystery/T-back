import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class UpdateUserInput {
	@Field({ nullable: true })
	email?: string // Highlight: Optional email field

	@Field({ nullable: true })
	password?: string // Highlight: Optional password field

	@Field({ nullable: true })
	whatsapp?: string // Highlight: Optional WhatsApp field

	@Field({ nullable: true })
	telegram?: string // Highlight: Optional Telegram field

	@Field({ nullable: true })
	phone?: string // Highlight: Optional phone field
}
