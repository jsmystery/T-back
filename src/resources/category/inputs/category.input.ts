import { Field, InputType } from '@nestjs/graphql'
import { SeoInput } from 'src/resources/seo/inputs/seo.input'

@InputType()
export class CategoryInput {
	@Field(() => String)
	name: string

	@Field(() => String)
	smallImagePath: string

	@Field(() => String)
	bigImagePath: string

	@Field(() => SeoInput, { nullable: true })
	seo?: SeoInput
}
