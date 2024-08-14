import { Resolver } from '@nestjs/graphql'
import { TariffService } from './tariff.service'

@Resolver()
export class TariffResolver {
	constructor(private readonly tariffService: TariffService) {}
}
