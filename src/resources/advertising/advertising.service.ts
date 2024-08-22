import { Injectable } from '@nestjs/common'
import { FullestQueryInput } from 'src/global/inputs/query.input'
import { PrismaService } from 'src/prisma/prisma.service'
import { queryFullestFilters } from 'src/utils/query/query-fullest-filters.util'
import { PaginationService } from '../pagination/pagination.service'
import { AdvertisingType } from './enums/advertising-type.enum'
import { advertisingCardSelect } from './selects/advertising.select'

@Injectable()
export class AdvertisingService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly paginationService: PaginationService
	) {}

	async getAll(input: FullestQueryInput) {
		const { createFilter, getSortFilter } = queryFullestFilters()
		const { perPage, skip } = this.paginationService.getPagination(input)
		const filters = createFilter(input)

		const [advertisements, count] = await Promise.all([
			this.prisma.advertising.findMany({
				where: filters,
				orderBy: getSortFilter(input.sort),
				skip,
				take: perPage,
				select: advertisingCardSelect,
			}),
			this.prisma.advertising.count({
				where: filters,
			}),
		])

		return {
			advertisements: advertisements || [],
			count: count || 0,
		}
	}

	async byTypes(types: AdvertisingType[]) {
		const advertisementsPromises = types.map(async (type) => {
			const count = await this.prisma.advertising.count({
				where: {
					type,
				},
			})

			if (count === 0) return null

			const randomIndex = Math.floor(Math.random() * count)

			return this.prisma.advertising.findFirst({
				where: {
					type,
				},
				skip: randomIndex,
				select: advertisingCardSelect,
			})
		})

		const advertisements = await Promise.all(advertisementsPromises)

		const filteredAdvertisements = advertisements.filter(
			(advertisement) => advertisement !== null
		)

		if (filteredAdvertisements.length === 0) {
			return []
		}

		return filteredAdvertisements
	}
}
