import { Args, Query, Resolver } from '@nestjs/graphql'
import { BrandService } from './brand.service'
import { AllBrands, Brand } from './entities/brand.entity'
import { BrandQueryInput } from './input/brand-query.input'
import { CurrentUser } from '../user/decorators/user.decorator'
import { Profile } from '../user/entities/profile/profile.entity'
import { User } from '../user/entities/full/user.entity'

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
}
