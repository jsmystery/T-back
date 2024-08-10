import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Id } from 'src/global/entities/global.entity'
import { NestedCategory } from 'src/resources/category/entities/category.entity'
import { ReviewCard } from 'src/resources/review/entities/review.entity'

@ObjectType()
export class BrandCard extends Id {
	@Field(() => String)
	name: string

	@Field(() => String)
	slug: string

	@Field(() => String)
	logoPath: string

	@Field(() => String)
	rating: string

	@Field(() => Int)
	reviewsCount: number

	@Field(() => NestedCategory)
	category: NestedCategory
}

@ObjectType()
export class AllBrands {
	@Field(() => [BrandCard])
	brands: BrandCard[]

	@Field(() => Int)
	count: number
}

@ObjectType()
export class NestedBrand {
	@Field(() => String)
	name: string

	@Field(() => String)
	slug: string

	@Field(() => String)
	logoPath: string
}

@ObjectType()
export class NestedProductBrand extends NestedBrand {
	@Field(() => Int)
	id: number

	@Field(() => String)
	rating: string

	@Field(() => String)
	phoneNumber: string

	@Field(() => Boolean)
	isSubscribed: boolean

	@Field(() => Boolean)
	isBrandOwner: boolean
}

@ObjectType()
export class Brand extends Id {
	@Field(() => String)
	name: string

	@Field(() => String)
	logoPath: string

	@Field(() => String)
	city: string

	@Field(() => Int)
	postedCount: number

	@Field(() => String)
	rating: string

	@Field(() => String)
	phoneNumber: string

	@Field(() => Boolean)
	isSubscribed: boolean

	@Field(() => Boolean)
	isBrandOwner: boolean

	@Field(() => String)
	about: string

	@Field(() => [ReviewCard])
	reviews: ReviewCard[]

	@Field(() => Int)
	reviewsCount: number

	@Field(() => String)
	createdAt: string
}
