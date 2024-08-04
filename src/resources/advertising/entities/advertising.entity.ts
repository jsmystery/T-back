import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Id } from 'src/global/entities/global.entity'
import { Visibility } from 'src/global/enums/query.enum'
import { AdvertisingType } from '../enums/advertising-type.enum'

@ObjectType()
export class Advertising extends Id {
	@Field(() => String, { nullable: true })
	smallImagePath?: string

	@Field(() => String)
	bigImagePath: string

	@Field(() => String, { nullable: true })
	resolution?: string

	@Field(() => String, { nullable: true })
	url?: string

	@Field(() => String, { nullable: true })
	alt?: string

	@Field(() => AdvertisingType)
	type: AdvertisingType

	@Field(() => Visibility, { nullable: true })
	visibility?: Visibility
}

@ObjectType()
export class CurrentAdvertising extends Advertising {
	@Field(() => String)
	weekPrice: string

	@Field(() => String)
	monthPrice: string
}

@ObjectType()
export class AllAdvertisements {
	@Field(() => [Advertising])
	advertisements: Advertising[]

	@Field(() => Int)
	count: number
}
