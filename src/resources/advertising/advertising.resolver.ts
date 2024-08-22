import { Args, Query, Resolver } from '@nestjs/graphql'
import { FullestQueryInput } from 'src/global/inputs/query.input'
import { AdvertisingService } from './advertising.service'
import { Advertising, AllAdvertisements } from './entities/advertising.entity'
import { AdvertisingType } from './enums/advertising-type.enum'

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
}
