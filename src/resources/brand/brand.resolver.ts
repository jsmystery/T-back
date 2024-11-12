import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Auth } from '../auth/helpers/decorators/auth.decorator'
import { UpdateBrandInput } from './input/update-brand.input'
import { UpdateBrandInputAdmin } from './input/update-brand-admin.input'
import { CreateBrandInput } from './input/create-brand.input'
import { CurrentUser } from '../user/decorators/user.decorator'
import { User } from '../user/entities/full/user.entity'
import { UserRole } from '../user/enums/user-role.enum'
import { BrandService } from './brand.service'
import {
	Account,
	AccountBrand,
	BrandCard,
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


	@Auth(UserRole.PROVIDER)
	@Mutation(() => Brand)
	async updateBrand(
	  @Args('id') id: number, 
	  @Args('input') input: UpdateBrandInput
	): Promise<Brand> {
	  return this.brandService.updateBrand(id, input)
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Brand)
	async updateBrandAdmin(
	  @Args('id') id: number, 
	  @Args('input') input: UpdateBrandInputAdmin
	): Promise<Brand> {
	  return this.brandService.updateBrandAdmin(id, input)
	}




	@Auth(UserRole.PROVIDER)
	@Mutation(() => BrandCard)
	async createBrand(
	  @Args('input') input: CreateBrandInput,
	  @CurrentUser('id') userId: number  // Retrieve the current user's ID
	): Promise<BrandCard> {
	  return this.brandService.createBrand(input, userId);  // Pass the userId to the service
	}

	@Auth(UserRole.ADMIN)
@Mutation(() => Boolean)
async deleteBrand(
  @Args('id') id: number
): Promise<boolean> {
  return this.brandService.deleteBrand(id);
}
}
