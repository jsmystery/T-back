import { Field, InputType } from '@nestjs/graphql'
import { GraphQLUpload, type FileUpload } from 'graphql-upload-ts'
import {
	CreatableSelectInput,
	SelectInput,
} from 'src/global/inputs/select.input'

@InputType()
export class BrandInput {
	@Field(() => GraphQLUpload, { nullable: true })
	logoFile?: FileUpload

	@Field(() => String, { nullable: true })
	logoPath?: string

	@Field(() => String)
	name: string

	@Field(() => String, { nullable: true })
	email?: string

	@Field(() => String, { nullable: true })
	phone?: string

	@Field(() => String, { nullable: true })
	whatsapp?: string

	@Field(() => String, { nullable: true })
	telegram?: string

	@Field(() => CreatableSelectInput)
	city: CreatableSelectInput

	@Field(() => String)
	about: string

	@Field(() => SelectInput)
	category: SelectInput
}
