import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Id } from 'src/global/entities/global.entity'
import {
	NestedCategory,
	SelectCategory,
} from 'src/resources/category/entities/category.entity'
import { ReviewCard } from 'src/resources/review/entities/review.entity'
import { Tariff } from 'src/resources/tariff/entities/tariff.entity'

@ObjectType()
export class BrandCard extends Id {
	@Field(() => String)
	name: string

	@Field(() => String)
	slug: string

	@Field(() => String)
	city: string

	@Field(() => String)
	logoPath: string

	@Field(() => String)
	rating: string

	@Field(() => String, { nullable: true })
	about?: string="";

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
	city: string

	@Field(() => String)
	logoPath: string

	@Field(() => String, { nullable: true })
	about?: string="";
}

@ObjectType()
export class NestedProductBrand extends NestedBrand {
	@Field(() => Int)
	id: number

	@Field(() => String)
	name: string

	@Field(() => String)
	slug: string

	@Field(() => String)
	logoPath: string

	@Field(() => String)
	rating: string

	@Field(() => String, { nullable: true })
	phone?: string

	@Field(() => String, { nullable: true })
	whatsapp?: string

	@Field(() => String, { nullable: true })
	telegram?: string

	@Field(() => Boolean)
	isSubscribed: boolean

	@Field(() => Boolean)
	isBrandOwner: boolean

	@Field(() => String, { nullable: true })
	about?: string="";
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

	@Field(() => String, { nullable: true })
	phone?: string

	@Field(() => String, { nullable: true })
	whatsapp?: string

	@Field(() => String, { nullable: true })
	telegram?: string

	@Field(() => Boolean)
	isSubscribed: boolean

	@Field(() => Boolean)
	isBrandOwner: boolean

	@Field(() => String, { nullable: true })
	about: string="";

	@Field(() => String)
	slug: string;

	@Field(() => [ReviewCard])
	reviews: ReviewCard[]

	@Field(() => Int)
	reviewsCount: number

	@Field(() => String)
	createdAt: string
}

@ObjectType()
export class AccountBrand extends Id {
	@Field(() => String)
	name: string

	@Field(() => String, { nullable: true })
	about: string="";

	@Field(() => Int)
	balance: number

	@Field(() => String, { nullable: true })
	email?: string

	@Field(() => String, { nullable: true })
	phone?: string

	@Field(() => String, { nullable: true })
	whatsapp?: string

	@Field(() => String, { nullable: true })
	telegram?: string

	@Field(() => String)
	logoPath: string

	@Field(() => String)
	city: string

	@Field(() => Int)
	postedCount: number

	@Field(() => [String])
	subscribers: string[]

	@Field(() => SelectCategory)
	category: SelectCategory

	@Field(() => String)
	createdAt: string
}

@ObjectType()
export class Account {
	@Field(() => AccountBrand, { nullable: true })
	brand?: AccountBrand

	@Field(() => [Tariff])
	tariffs: Tariff[]

	@Field(() => [SelectCategory])
	categories: SelectCategory[]
}
