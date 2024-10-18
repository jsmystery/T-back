import { Args, Int, Query, Resolver, Mutation } from '@nestjs/graphql'
import { Auth } from '../auth/helpers/decorators/auth.decorator'
import { Brand } from '../brand/entities/brand.entity'
import { CurrentUser } from '../user/decorators/user.decorator'
import { User } from '../user/entities/full/user.entity'
import { AllAnnouncements } from './entity/announcement.entity'
import { AllProducts, Product } from './entity/product.entity'
import { ProductQueryInput } from './inputs/product-query.input'
import { ProductService } from './product.service'
import { UpdateProductInput } from './inputs/update-product.input'
import { CreateProductInput } from './inputs/create-product.input'


@Resolver()
export class ProductResolver {
	constructor(private readonly productService: ProductService) {}

	@Query(() => AllProducts, { name: 'products' })
	async getAllProducts(@Args('query') input: ProductQueryInput) {
		return this.productService.getAllProducts(input)
	}

	@Auth()
	@Query(() => AllAnnouncements, { name: 'announcements' })
	async getAllAnnouncements(
		@Args('query') input: ProductQueryInput,
		@CurrentUser('brand') { id }: Brand
	) {
		return this.productService.getAllAnnouncements(input, id)
	}

	@Query(() => Product, { name: 'currentProduct' })
	async getCurrentProduct(
		@Args('id', { type: () => Int }) id: number,
		@CurrentUser() user: User
	) {
		return this.productService.currentProduct(id, user)
	}

	@Auth()
	@Mutation(() => Boolean, { name: 'deleteProduct' })
	async deleteProduct(
		@Args('id', { type: () => Int }) id: number, 
		@CurrentUser('brand') { id: brandId }: Brand // Get the brand of the current user
	) {
		return this.productService.deleteProduct(id, brandId)
	}


	@Auth()
	@Mutation(() => Product, { name: 'updateProduct' }) 
	async updateProduct( 
		@Args('id', { type: () => Int }) id: number, 
		@Args('data') data: UpdateProductInput, 
		@CurrentUser('brand') { id: brandId }: Brand 
	) { 
		return this.productService.updateProduct(id, data, brandId); 
	} 


	@Auth()
	@Mutation(() => Boolean, { name: 'createProduct' })
	async createProduct(
		@Args('input') input: CreateProductInput, 
		@CurrentUser('brand') { id: brandId }: Brand  // Ensuring the user has a brand
	): Promise<any> {
		return this.productService.createProduct(input, brandId)  // Passing data to the service
	}

}
