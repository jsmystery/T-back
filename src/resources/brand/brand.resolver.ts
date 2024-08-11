import { Args, Query, Resolver } from '@nestjs/graphql'
import { CurrentUser } from '../user/decorators/user.decorator'
import { User } from '../user/entities/full/user.entity'
import { BrandService } from './brand.service'
import { AccountBrand, AllBrands, Brand } from './entities/brand.entity'
import { BrandQueryInput } from './input/brand-query.input'

@Resolver()
export class BrandResolver {
	constructor(private readonly brandService: BrandService) {}

	@Query(() => AllBrands, { name: 'brands' })
	async getAll(@Args('query') input: BrandQueryInput) {
		return this.brandService.getAll(input)
	}

	@Query(() => Brand, { name: 'brand' })
	async getBySlug(@Args('slug') slug: string, @CurrentUser() user: User) {
		return this.brandService.bySlug(slug, user)
	}

	@Query(() => AccountBrand, { name: 'accountBrand' })
	async getAccountBrand(@CurrentUser() user: User) {
		return this.brandService.byUserId(user.id)
	}
}
