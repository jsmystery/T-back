import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Auth } from '../auth/helpers/decorators/auth.decorator'
import { CurrentUser } from '../user/decorators/user.decorator'
import { User } from '../user/entities/full/user.entity'
import { UserRole } from '../user/enums/user-role.enum'
import { BrandService } from './brand.service'
import {
	Account,
	AccountBrand,
	AllBrands,
	Brand,
} from './entities/brand.entity'
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

	@Auth(UserRole.PROVIDER)
	@Query(() => Account, { name: 'account' })
	async getAccountBrand(@CurrentUser('id') userId: number) {
		return this.brandService.byUserId(userId)
	}
}
