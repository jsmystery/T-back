import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Seo } from 'src/resources/seo/entities/seo.entity'

@ObjectType()
export class CategoryCard {
	@Field(() => String)
	name: string

	@Field(() => String)
	slug: string

	@Field(() => String)
	smallImagePath: string

	@Field(() => String)
	bigImagePath: string
}

@ObjectType()
export class AllCategories {
	@Field(() => [CategoryCard])
	categories: CategoryCard[]

	@Field(() => Int)
	count: number
}

@ObjectType()
export class NestedCategory {
	@Field(() => String)
	name: string

	@Field(() => String)
	slug: string
}

@ObjectType()
export class SelectCategory {
	@Field(() => Int)
	id: number

	@Field(() => String)
	name: string
}

@ObjectType()
export class Category extends CategoryCard {
	@Field(() => Seo)
	seo: Seo
}
