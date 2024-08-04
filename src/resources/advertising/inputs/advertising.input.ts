import { Field, InputType } from '@nestjs/graphql'
import { type FileUpload, GraphQLUpload } from 'graphql-upload-ts'
import { AdvertisingTypeSelectInput } from 'src/global/inputs/select.input'

@InputType()
export class AdvertisingInput {
	@Field(() => GraphQLUpload)
	smallImage: FileUpload

	@Field(() => GraphQLUpload)
	bigImage: FileUpload

	@Field(() => String)
	resolution: string

	@Field(() => String, { nullable: true })
	url?: string

	@Field(() => String, { nullable: true })
	alt?: string

	@Field(() => String)
	weekPrice: string

	@Field(() => String)
	monthPrice: string

	@Field(() => AdvertisingTypeSelectInput)
	type: AdvertisingTypeSelectInput
}
