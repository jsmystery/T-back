import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Id } from 'src/global/entities/global.entity'
import { SelectCategory } from 'src/resources/category/entities/category.entity'
import { NestedOrder } from 'src/resources/order/entities/order.entity'
import { Price } from './price.entity'

@ObjectType()
export class AnnouncementCard extends Id {
	@Field(() => String)
	name: string

	@Field(() => String)
	city: string

	@Field(() => Int)
	minPrice: number

	@Field(() => Int)
	maxPrice: number

	@Field(() => String)
	posterPath: string

	@Field(() => String)
	sku: string

	@Field(() => String)
	about?: string

	@Field(() => Int)
	views: number

	@Field(() => [NestedOrder])
	orders: NestedOrder[]

	@Field(() => String)
	createdAt: string
}

@ObjectType()
export class AllAnnouncements {
	@Field(() => [AnnouncementCard])
	announcements: AnnouncementCard[]

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

	@Field(() => String)
	videoPath: string

	@Field(() => [String])
	imagesPaths: string[]

	@Field(() => [Price])
	prices: Price[]

	@Field(() => SelectCategory)
	category: SelectCategory
}
