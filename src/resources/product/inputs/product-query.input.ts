import { Field, InputType, Int } from '@nestjs/graphql'
import { Sort } from 'src/global/enums/query.enum'
import { FullestQueryInput } from 'src/global/inputs/query.input'

@InputType()
export class ProductQueryInput extends FullestQueryInput {
	@Field(() => Sort, { nullable: true })
	views?: Sort

	@Field(() => Int, { nullable: true })
	brandId?: number
}
