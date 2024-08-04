import { Field, InputType } from '@nestjs/graphql'
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts'
import { SelectInput } from 'src/global/inputs/select.input'
import { PriceInput } from './price.input'

@InputType()
export class ProductInput {
	@Field(() => String)
	name: string

	@Field(() => String)
	about: string

	@Field(() => String)
	sku: string

	@Field(() => GraphQLUpload)
	poster: FileUpload

	@Field(() => GraphQLUpload, { nullable: true })
	video?: FileUpload

	@Field(() => [GraphQLUpload])
	images: FileUpload[]

	@Field(() => [PriceInput])
	prices: PriceInput[]

	@Field(() => SelectInput)
	category: SelectInput
}
