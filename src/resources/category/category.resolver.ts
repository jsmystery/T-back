import { Args, Query, Resolver } from '@nestjs/graphql'
import { CategoryService } from './category.service'
import { AllCategories, SelectCategory } from './entities/category.entity'
import { CategoryQueryInput } from './inputs/category-query.input'

@Resolver()
export class CategoryResolver {
	constructor(private readonly categoryService: CategoryService) {}

	@Query(() => AllCategories, { name: 'categories' })
	async getAll(@Args('query') input: CategoryQueryInput) {
		return this.categoryService.getAll(input)
	}

	@Query(() => [SelectCategory], { name: 'selectCategories' })
	async getSelectCategories() {
		return this.categoryService.getSelectCategories()
	}
}
