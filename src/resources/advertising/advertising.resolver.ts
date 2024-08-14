import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Id } from 'src/global/entities/global.entity'
import { FullestQueryInput } from 'src/global/inputs/query.input'
import { Auth } from '../auth/helpers/decorators/auth.decorator'
import { UserRole } from '../user/enums/user-role.enum'
import { AdvertisingService } from './advertising.service'
import {
	Advertising,
	AllAdvertisements,
	CurrentAdvertising,
} from './entities/advertising.entity'
import { AdvertisingType } from './enums/advertising-type.enum'
import { AdvertisingInput } from './inputs/advertising.input'

@Resolver()
export class AdvertisingResolver {
	constructor(private readonly advertisingService: AdvertisingService) {}

	@Query(() => AllAdvertisements, { name: 'advertisements' })
	async getAll(@Args('query') input: FullestQueryInput) {
		return this.advertisingService.getAll(input)
	}

	@Query(() => [Advertising], { name: 'advertisementsByTypes' })
	async getByTypes(
		@Args('types', { type: () => [AdvertisingType] }) types: AdvertisingType[]
	) {
		return this.advertisingService.byTypes(types)
	}

	// Admin Place
	@Auth(UserRole.ADMIN)
	@Query(() => CurrentAdvertising, { name: 'advertisingById' })
	async getById(@Args('id', { type: () => Int }) id: number) {
		return this.advertisingService.byId(id)
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Id, { name: 'createAdvertising' })
	async create() {
		return this.advertisingService.create()
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Boolean, { name: 'updateAdvertising' })
	async update(
		@Args('id', { type: () => Int }) id: number,
		@Args('data') input: AdvertisingInput
	) {
		return this.advertisingService.update(+id, input)
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Boolean, { name: 'deleteAdvertising' })
	async delete(@Args('id', { type: () => Int }) id: number) {
		return this.advertisingService.delete(id)
	}
}
