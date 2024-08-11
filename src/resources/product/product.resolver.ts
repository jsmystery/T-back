import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Auth } from '../auth/helpers/decorators/auth.decorator'
import { Brand } from '../brand/entities/brand.entity'
import { CurrentUser } from '../user/decorators/user.decorator'
import { User } from '../user/entities/full/user.entity'
import { UserRole } from '../user/enums/user-role.enum'
import { AllAnnouncements } from './entity/announcement.entity'
import { AllProducts, Product, ProductCard } from './entity/product.entity'
import { ProductQueryInput } from './inputs/product-query.input'
import { ProductInput } from './inputs/product.input'
import { ProductService } from './product.service'

@Resolver()
export class ProductResolver {
	constructor(private readonly productService: ProductService) {}

	@Query(() => AllProducts, { name: 'products' })
	async getAllProducts(@Args('query') input: ProductQueryInput) {
		return this.productService.getAllProducts(input)
	}

	@Query(() => AllAnnouncements, { name: 'announcements' })
	async getAllAnnouncements(@Args('query') input: ProductQueryInput) {
		return this.productService.getAllAnnouncements(input)
	}

	@Query(() => Product, { name: 'currentProduct' })
	async getCurrentProduct(
		@Args('id', { type: () => Int }) id: number,
		@CurrentUser() user: User
	) {
		return this.productService.currentProduct(id, user)
	}

	// Admin and Provider Place
	@Auth(UserRole.PROVIDER)
	@Query(() => Product, { name: 'productById' })
	async getById(@Args('id', { type: () => Int }) id: number) {
		return this.productService.byId(id)
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
}
