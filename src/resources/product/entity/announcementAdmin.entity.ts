import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Id } from 'src/global/entities/global.entity'
import { SelectCategory } from 'src/resources/category/entities/category.entity'
import { NestedOrder } from 'src/resources/order/entities/order.entity'
import { Price } from './price.entity'

@ObjectType()
export class AnnouncementCardAdmin extends Id {
	@Field(() => String)
	name: string

	@Field(() => String)
	city: string

	@Field(() => Int)
	minPrice: number

	@Field(() => Int)
	maxPrice: number

	@Field(() => Int)
	price?: number

	@Field(() => String)
	posterPath: string

	@Field(() => String)
	sku: string

	@Field(() => String)  
	about?: string


	@Field(() => String)
	rating?: string


	@Field(() => [Price])
	pricesFull: Price[];
 

	@Field(() => Int)
	views: number

	@Field(() => [NestedOrder])
	orders: NestedOrder[]

	@Field(() => String)
	createdAt: string
}

@ObjectType()
export class AllAnnouncementsAdmin {
	@Field(() => [AnnouncementCardAdmin])
	announcements: AnnouncementCardAdmin[]

	@Field(() => Int)
	count: number
}

@ObjectType()
export class Announcement {
	@Field(() => String)
	name: string

	@Field(() => String)
	about: string

	@Field(() => String)
	sku: string

	@Field(() => String)
	posterPath: string

	// @Field(() => Number)
	// minQuantity: number

	@Field(() => String)
	videoPath: string

	@Field(() => [String])
	imagesPaths: string[]

	@Field(() => [Price])
	prices: Price[]

	// @Field(() => [])
	// pricesFull?: []

	@Field(() => SelectCategory)
	category: SelectCategory
}
