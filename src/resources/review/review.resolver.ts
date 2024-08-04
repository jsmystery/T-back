import { Args, Query, Resolver } from '@nestjs/graphql'
import { QueryInput } from 'src/global/inputs/query.input'
import { AllReviews } from './entities/review.entity'
import { ReviewService } from './review.service'

@Resolver()
export class ReviewResolver {
	constructor(private readonly reviewService: ReviewService) {}

	@Query(() => AllReviews, { name: 'reviews' })
	async getAll(@Args('query') input: QueryInput) {
		return this.reviewService.getAll(input)
	}
}
