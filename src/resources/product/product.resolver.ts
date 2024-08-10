import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Visibility } from 'src/global/enums/query.enum'
import { Auth } from '../auth/helpers/decorators/auth.decorator'
import { Brand } from '../brand/entities/brand.entity'
import { CurrentUser } from '../user/decorators/user.decorator'
import { UserRole } from '../user/enums/user-role.enum'
import { AllProducts, Product, ProductCard } from './entity/product.entity'
import { ProductQueryInput } from './inputs/product-query.input'
import { ProductInput } from './inputs/product.input'
import { ProductService } from './product.service'
import { User } from '../user/entities/full/user.entity'

@Resolver()
export class ProductResolver {
	constructor(private readonly productService: ProductService) {}

	@Query(() => AllProducts, { name: 'products' })
	async getAll(@Args('query') input: ProductQueryInput) {
		return this.productService.getAll(input)
	}

	@Query(() => Product, { name: 'currentProduct' })
	async getCurrentProduct(@Args('id', { type: () => Int }) id: number, @CurrentUser() user: User) {
		return this.productService.currentProduct(id, user)
	}

	// Admin and Provider Place
	@Auth(UserRole.PROVIDER)
	@Query(() => Product, { name: 'productById' })
	async getById(@Args('id', { type: () => Int }) id: number) {
		return this.productService.byId(id)
	}

	@Auth(UserRole.PROVIDER)
	@Mutation(() => ProductCard, { name: 'duplicateProduct' })
	async duplicate(@Args('id', { type: () => Int }) id: number) {
		return this.productService.duplicate(id)
	}

	@Auth(UserRole.PROVIDER)
	@Mutation(() => ProductCard, { name: 'updateProduct' })
	async update(
		@Args('id', { type: () => Int }) id: number,
		@Args('data') input: ProductInput
	) {
		return this.productService.update(+id, input)
	}

	@Auth(UserRole.PROVIDER)
	@Mutation(() => Int, { name: 'deleteProduct' })
	async delete(@Args('id', { type: () => Int }) id: number) {
		return this.productService.delete(id)
	}

	// Admin Place
	@Auth(UserRole.PROVIDER)
	@Mutation(() => ProductCard, { name: 'createProduct' })
	async create(
		@Args('data') input: ProductInput,
		@CurrentUser('brand') { id }: Brand
	) {
		return this.productService.create(input, id)
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Visibility, { name: 'toggleProduct' })
	async toggleVisibility(@Args('id', { type: () => Int }) id: number) {
		return this.productService.toggleVisibility(id)
	}
}
