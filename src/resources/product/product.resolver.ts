import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Auth } from '../auth/helpers/decorators/auth.decorator'
import { Brand } from '../brand/entities/brand.entity'
import { CurrentUser } from '../user/decorators/user.decorator'
import { User } from '../user/entities/full/user.entity'
import { UserRole } from '../user/enums/user-role.enum'
import {
	AllAnnouncements,
	Announcement,
	AnnouncementCard,
} from './entity/announcement.entity'
import {
	AllProducts,
	Product,
	ProductCard,
	ProductEdit,
} from './entity/product.entity'
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

	// Admin and Provider Place
	@Auth(UserRole.PROVIDER)
	@Query(() => ProductEdit, { name: 'productById' })
	async getProductById(@Args('id', { type: () => Int }) id: number) {
		return this.productService.productById(id)
	}

	@Auth(UserRole.PROVIDER)
	@Query(() => Announcement, { name: 'announcementById' })
	async getAnnouncementById(@Args('id', { type: () => Int }) id: number) {
		return this.productService.announcementById(id)
	}

	@Auth(UserRole.PROVIDER)
	@Mutation(() => ProductCard, { name: 'editProduct' })
	async editProduct(
		@Args('data') input: ProductInput,
		@CurrentUser('brand') { id: brandId }: Brand,
		@Args('productId', { type: () => Int, nullable: true }) productId?: number
	) {
		return this.productService.edit('product', input, brandId, productId)
	}

	@Auth(UserRole.PROVIDER)
	@Mutation(() => AnnouncementCard, { name: 'editAnnouncement' })
	async editAnnouncement(
		@Args('data') input: ProductInput,
		@CurrentUser('brand') { id: brandId }: Brand,
		@Args('announcementId', { type: () => Int, nullable: true })
		announcementId?: number
	) {
		return this.productService.edit(
			'announcement',
			input,
			brandId,
			announcementId
		)
	}

	@Auth(UserRole.PROVIDER)
	@Mutation(() => Int, { name: 'deleteProduct' })
	async delete(@Args('id', { type: () => Int }) id: number) {
		return this.productService.delete(id)
	}
}
