import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Auth } from '../auth/helpers/decorators/auth.decorator'
import { UserRole } from '../user/enums/user-role.enum'
import { CategoryService } from './category.service'
import { AllCategories, Category } from './entities/category.entity'
import { CategoryQueryInput } from './inputs/category-query.input'
import { CategoryInput } from './inputs/category.input'

@Resolver()
export class CategoryResolver {
	constructor(private readonly categoryService: CategoryService) {}

	@Query(() => AllCategories, { name: 'categories' })
	async getAll(@Args('query') input: CategoryQueryInput) {
		return this.categoryService.getAll(input)
	}

	// Admin Place
	@Auth(UserRole.ADMIN)
	@Query(() => Category, { name: 'categoryById' })
	async getById(@Args('id', { type: () => Int }) id: number) {
		return this.categoryService.byId(id)
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Boolean, { name: 'toggleCategory' })
	async toggleVisibility(@Args('id', { type: () => Int }) id: number) {
		return this.categoryService.toggleVisibility(id)
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Boolean, { name: 'duplicateCategory' })
	async duplicate(@Args('id', { type: () => Int }) id: number) {
		return this.categoryService.duplicate(id)
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Boolean, { name: 'createCategory' })
	async create() {
		return this.categoryService.create()
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Boolean, { name: 'updateCategory' })
	async update(
		@Args('id', { type: () => Int }) id: number,
		@Args('data') input: CategoryInput
	) {
		return this.categoryService.update(+id, input)
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Boolean, { name: 'deleteCategory' })
	async delete(@Args('id', { type: () => Int }) id: number) {
		return this.categoryService.delete(id)
	}
}
