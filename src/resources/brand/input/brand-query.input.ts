import { Field, InputType } from '@nestjs/graphql'
import { Sort } from 'src/global/enums/query.enum'
import { FullestQueryInput } from 'src/global/inputs/query.input'

@InputType()
export class BrandQueryInput extends FullestQueryInput {
	@Field(() => Sort, { nullable: true })
	rating?: Sort

	@Field(() => Sort, { nullable: true })
	reviewsCount?: Sort
}
