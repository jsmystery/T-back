import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ReviewCard {
	@Field(() => Int)
	id: number

	@Field(() => String)
	authorName: string

	@Field(() => String)
	comment: string

	@Field(() => Int)
	rating: number

	@Field(() => String)
	createdAt: string
}

@ObjectType()
export class AllReviews {
	@Field(() => [ReviewCard])
	reviews: ReviewCard[]

	@Field(() => Int)
	count: number
}
