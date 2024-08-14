import { Field, InputType } from '@nestjs/graphql'
import { PaginationInput } from 'src/resources/pagination/input/pagination.input'
import { Sort } from '../enums/query.enum'

@InputType()
export class FullestQueryInput extends PaginationInput {
	@Field(() => Sort)
	sort: Sort

	@Field(() => String, { nullable: true })
	searchTerm?: string
}

@InputType()
export class QueryInput extends PaginationInput {
	@Field(() => Sort)
	sort: Sort

	@Field(() => String, { nullable: true })
	searchTerm?: string
}
