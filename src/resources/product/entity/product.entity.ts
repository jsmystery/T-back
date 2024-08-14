import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Id } from 'src/global/entities/global.entity'
import {
	NestedBrand,
	NestedProductBrand,
} from 'src/resources/brand/entities/brand.entity'
import { NestedCategory } from 'src/resources/category/entities/category.entity'
import { ReviewCard } from 'src/resources/review/entities/review.entity'
import { Price } from './price.entity'

@ObjectType()
export class Product extends Id {
	@Field(() => String)
	name: string

	@Field(() => String)
	about: string

	@Field(() => String)
	sku: string

	@Field(() => String)
	posterPath: string

	@Field(() => String, { nullable: true })
	videoPath?: string

	@Field(() => [String])
	imagesPaths: string[]

	@Field(() => [Price])
	prices: Price[]

	@Field(() => String)
	rating: string

	@Field(() => [ReviewCard])
	reviews: ReviewCard[]

	@Field(() => Int)
	reviewsCount: number

	@Field(() => NestedCategory)
	category: NestedCategory

	@Field(() => NestedProductBrand)
	provider: NestedProductBrand

	@Field(() => Int)
	views: number

	@Field(() => String)
	createdAt: string
}

@ObjectType()
export class ProductCard extends Id {
	@Field(() => String)
	name: string

	@Field(() => String)
	posterPath: string

	@Field(() => Int)
	minPrice: number

	@Field(() => Int)
	maxPrice: number

	@Field(() => Int)
	rating: number

	@Field(() => Int)
	ratesCount: number

	@Field(() => NestedCategory)
	category: NestedCategory

	@Field(() => NestedBrand)
	provider: NestedBrand
}

@ObjectType()
export class AllProducts {
	@Field(() => [ProductCard])
	products: ProductCard[]

	@Field(() => Int)
	count: number
}
