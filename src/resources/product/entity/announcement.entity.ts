import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Id } from 'src/global/entities/global.entity'
import { NestedTariff } from 'src/resources/tariff/entities/tariff.entity'

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

	@Field(() => Int)
	views: number

	@Field(() => [NestedTariff])
	tariffs: NestedTariff[]

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
