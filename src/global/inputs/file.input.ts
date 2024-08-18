import { Field, InputType } from '@nestjs/graphql'
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts'

@InputType()
export class FileInput {
	@Field(() => GraphQLUpload, { nullable: true })
	file?: FileUpload
}

@InputType()
export class FilePathInput {
	@Field(() => String, { nullable: true })
	url?: string
}
