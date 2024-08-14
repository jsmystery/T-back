import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { IS_PRODUCTION } from 'src/global/constants/global.constants'
import { FullestQueryInput } from 'src/global/inputs/query.input'
import { PrismaService } from 'src/prisma/prisma.service'
import { queryFullestFilters } from 'src/utils/query/query-fullest-filters.util'
import { HookService } from '../hook/hook.service'
import { PaginationService } from '../pagination/pagination.service'
import { AdvertisingType } from './enums/advertising-type.enum'
import { AdvertisingInput } from './inputs/advertising.input'
import {
	advertisingCardSelect,
	advertisingFullSelect,
} from './selects/advertising.select'

@Injectable()
export class AdvertisingService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly paginationService: PaginationService,
		private readonly hookService: HookService
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

	// Admin Place
	async byId(id: number) {
		const advertising = await this.prisma.advertising.findUnique({
			where: {
				id,
			},
			select: advertisingFullSelect,
		})

		if (!advertising) throw new NotFoundException('Реклама не найдена.')

		return advertising
	}

	async create() {
		try {
			return this.prisma.advertising.create({
				data: {
					bigImagePath: '',
					weekPrice: 3000,
					monthPrice: 10000,
					type: AdvertisingType.LARGE,
				},
				select: {
					id: true,
				},
			})
		} catch (error) {
			if (!IS_PRODUCTION) {
				console.log(error)
			}
			throw new BadRequestException('Произошла ошибка при создании рекламы.')
		}
	}

	async update(id: number, input: AdvertisingInput) {
		try {
			const advertising = await this.byId(id)

			const { smallImage, bigImage, ...inputData } = input

			const [smallImagePath, bigImagePath] = await Promise.all([
				this.hookService.uploadFile(
					'advertisements',
					'small-image',
					smallImage,
					advertising.smallImagePath
				),
				this.hookService.uploadFile(
					'advertisements',
					'big-image',
					bigImage,
					advertising.bigImagePath
				),
			])

			await this.prisma.advertising.update({
				where: {
					id,
				},
				data: {
					smallImagePath,
					bigImagePath,
					resolution: +inputData.resolution,
					url: inputData.url,
					alt: inputData.alt,
					weekPrice: +inputData.weekPrice,
					monthPrice: +inputData.monthPrice,
					type: inputData.type.value,
				},
			})

			return true
		} catch (error) {
			if (!IS_PRODUCTION) {
				console.log(error)
			}
			throw new BadRequestException('Произошла ошибка при обновлении рекламы.')
		}
	}

	async delete(id: number) {
		try {
			const advertising = await this.prisma.advertising.delete({
				where: {
					id,
				},
			})

			await Promise.all([
				this.hookService.deleteFile(advertising.smallImagePath),
				this.hookService.deleteFile(advertising.bigImagePath),
			])

			await this.prisma.advertising.delete({
				where: {
					id,
				},
			})

			return true
		} catch (error) {
			if (!IS_PRODUCTION) {
				console.log(error)
			}
			throw new BadRequestException('Произошла ошибка при создании рекламы.')
		}
	}
}
