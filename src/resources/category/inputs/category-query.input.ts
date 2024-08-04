import { Field, InputType } from '@nestjs/graphql'
import { FullestQueryInput } from 'src/global/inputs/query.input'

@InputType()
export class CategoryQueryInput extends FullestQueryInput {
	@Field(() => Boolean, { nullable: true })
	popular?: boolean
}
