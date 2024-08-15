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

	@Field(() => GraphQLUpload, { nullable: true })
	posterFile?: FileUpload

	@Field(() => String, { nullable: true })
	posterPath?: string

	@Field(() => GraphQLUpload, { nullable: true })
	videoFile?: FileUpload

	@Field(() => String, { nullable: true })
	videoPath?: string

	@Field(() => [GraphQLUpload], { nullable: true })
	imagesFiles?: FileUpload[]

	@Field(() => [String], { nullable: true })
	imagesPaths?: string[]

	@Field(() => [PriceInput])
	prices: PriceInput[]

	@Field(() => SelectInput)
	category: SelectInput
}
