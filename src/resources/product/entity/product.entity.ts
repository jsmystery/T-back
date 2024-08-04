import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Id } from 'src/global/entities/global.entity'
import { Visibility } from 'src/global/enums/query.enum'
import { NestedBrand } from 'src/resources/brand/entities/brand.entity'
import { NestedCategory } from 'src/resources/category/entities/category.entity'
import { Price } from './price.entity'

@ObjectType()
export class Product {
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

	@Field(() => Visibility)
	visibility: Visibility
}

@ObjectType()
export class AllProducts {
	@Field(() => [ProductCard])
	products: ProductCard[]

	@Field(() => Int)
	count: number
}
