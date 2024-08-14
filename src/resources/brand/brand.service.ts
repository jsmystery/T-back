import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { IS_PRODUCTION } from 'src/global/constants/global.constants'
import { PrismaService } from 'src/prisma/prisma.service'
import { dateFormat } from 'src/utils/formats/date-format.util'
import { generateSlug } from 'src/utils/helpers/generate-slug.util'
import { queryBrandFilters } from 'src/utils/query/query-brand-filters.util'
import { CategoryService } from '../category/category.service'
import { HookService } from '../hook/hook.service'
import { PaginationService } from '../pagination/pagination.service'
import { reviewCardSelect } from '../review/selects/review.select'
import { TariffService } from '../tariff/tariff.service'
import { User } from '../user/entities/full/user.entity'
import { UserRole } from '../user/enums/user-role.enum'
import {
	Account,
	AccountBrand,
	Brand,
	BrandCard,
} from './entities/brand.entity'
import { BrandQueryInput } from './input/brand-query.input'
import { BrandInput } from './input/brand.input'
import {
	accountBrandSelect,
	brandCardSelect,
	brandSelect,
} from './selects/brand.select'

@Injectable()
export class BrandService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly paginationService: PaginationService,
		private readonly categoryService: CategoryService,
		private readonly tariffService: TariffService,
		private readonly hookService: HookService
	) {}

	async getAll(input: BrandQueryInput) {
		const { createFilter, getSortFilter } = queryBrandFilters()
		const { perPage, skip } = this.paginationService.getPagination(input)
		const filters = createFilter(input)

		const [queriedBrands, count] = await Promise.all([
			this.prisma.brand.findMany({
				where: filters,
				orderBy: getSortFilter(input),
				skip,
				take: perPage,
				select: brandCardSelect,
			}),
			this.prisma.brand.count({
				where: filters,
			}),
		])

		const brands = queriedBrands.map((brand) => {
			return {
				id: brand.id,
				name: brand.name,
				slug: brand.slug,
				logoPath: brand.logoPath,
				rating: String(brand.rating),
				reviewsCount: brand._count.reviews,
				category: brand.category,
			}
		}) as BrandCard[]

		return {
			brands: brands || [],
			count: count || 0,
		}
	}

	async bySlug(slug: string, user: User) {
		const brand = await this.prisma.brand.findUnique({
			where: {
				slug,
			},
			select: {
				...brandSelect,
				reviews: {
					select: reviewCardSelect,
					take: 3,
					orderBy: {
						createdAt: 'desc',
					},
				},
				user: {
					select: {
						id: true,
						profile: {
							select: {
								phone: true,
							},
						},
					},
				},
			},
		})

		if (!brand) throw new NotFoundException('Поставщик не найден.')

		return {
			id: brand.id,
			name: brand.name,
			logoPath: brand.logoPath,
			city: brand.city,
			postedCount: brand._count.products,
			rating: String(brand.rating),
			phoneNumber: brand.user.profile.phone,
			isSubscribed: brand.subscribers.includes(user.profile.email),
			isBrandOwner:
				user.role === UserRole.PROVIDER && brand.user.id === user.id,
			about: brand.about,
			reviews: brand.reviews.map((review) => ({
				...review,
				createdAt: dateFormat(review.createdAt, 'DD MMMM YYYY'),
			})),
			reviewsCount: brand._count.reviews,
			createdAt: dateFormat(brand.createdAt, 'DD-MM-YYYY'),
		} as Brand
	}

	async byUserId(userId: number) {
		const brand = await this.prisma.brand.findUnique({
			where: {
				userId,
			},
			select: accountBrandSelect,
		})

		const tariffs = await this.tariffService.getAll()
		const categories = await this.categoryService.getSelectCategories()

		if (!brand)
			return {
				brand: null,
				tariffs,
				categories,
			} as Account

		return {
			brand: {
				id: brand.id,
				name: brand.name,
				about: brand.about,
				balance: brand.balance,
				email: brand.user.profile.email,
				phone: brand.user.profile.phone,
				whatsapp: brand.user.profile.whatsapp,
				telegram: brand.user.profile.telegram,
				logoPath: brand.logoPath,
				city: brand.city,
				postedCount: brand._count.products,
				subscribers: brand.subscribers,
				category: {
					id: brand.category.id,
					name: brand.category.name,
				},
				createdAt: dateFormat(brand.createdAt, 'DD.MM.YYYY'),
			},
			tariffs,
			categories,
		} as Account
	}

	// Admin place
	async create(userId: number, input: BrandInput) {
		if (!input.logoFile && !input.logoPath)
			throw new BadRequestException('Выберите логотип.')

		try {
			const newBrand = await this.prisma.brand.create({
				data: {
					user: {
						connect: {
							id: userId,
						},
					},
					name: input.name,
					slug: generateSlug(input.name),
					city: input.city.value,
					logoPath: '',
					about: input.about,
					category: {
						connect: {
							id: input.category.value,
						},
					},
				},
				select: {
					id: true,
				},
			})

			let logoPath = null

			if (input.logoFile) {
				logoPath = await this.hookService.uploadFile(
					`brands/${newBrand.id}`,
					'logo',
					input.logoFile
				)
			} else {
				logoPath = input.logoPath
			}

			const brand = await this.prisma.brand.update({
				where: {
					id: newBrand.id,
				},
				data: {
					logoPath,
				},
				select: accountBrandSelect,
			})

			return {
				id: brand.id,
				name: brand.name,
				about: brand.about,
				balance: brand.balance,
				email: brand.user.profile.email,
				phone: brand.user.profile.phone,
				whatsapp: brand.user.profile.whatsapp,
				telegram: brand.user.profile.telegram,
				logoPath: brand.logoPath,
				city: brand.city,
				postedCount: brand._count.products,
				subscribers: brand.subscribers,
				category: {
					id: brand.category.id,
					name: brand.category.name,
				},
				createdAt: dateFormat(brand.createdAt, 'DD.MM.YYYY'),
			} as AccountBrand
		} catch (error) {
			if (!IS_PRODUCTION) console.log(error)

			throw new BadRequestException(
				'Возникла ошибка.Пожалуйста попробуйте позже.'
			)
		}
	}

	async update(userId: number, input: BrandInput) {
		try {
			const brand = await this.prisma.brand.findUnique({
				where: {
					userId,
				},
				select: {
					id: true,
					logoPath: true,
				},
			})

			let logoPath = null

			if (input.logoFile) {
				logoPath = await this.hookService.uploadFile(
					`brands/${brand.id}`,
					'logo',
					input.logoFile,
					brand.logoPath
				)
			} else {
				logoPath = input.logoPath
			}

			const updatedBrand = await this.prisma.brand.update({
				where: {
					id: brand.id,
				},
				data: {
					name: input.name,
					slug: generateSlug(input.name),
					city: input.city.value,
					about: input.about,
					logoPath,
					user: {
						update: {
							profile: {
								update: {
									email: input.email,
									phone: input.phone,
									whatsapp: input.whatsapp,
									telegram: input.telegram,
								},
							},
						},
					},
					category: {
						connect: {
							id: input.category.value,
						},
					},
				},
				select: accountBrandSelect,
			})

			return {
				id: updatedBrand.id,
				name: updatedBrand.name,
				about: updatedBrand.about,
				balance: updatedBrand.balance,
				email: updatedBrand.user.profile.email,
				phone: updatedBrand.user.profile.phone,
				whatsapp: updatedBrand.user.profile.whatsapp,
				telegram: updatedBrand.user.profile.telegram,
				logoPath: updatedBrand.logoPath,
				city: updatedBrand.city,
				postedCount: updatedBrand._count.products,
				subscribers: updatedBrand.subscribers,
				category: {
					id: updatedBrand.category.id,
					name: updatedBrand.category.name,
				},
				createdAt: dateFormat(updatedBrand.createdAt, 'DD.MM.YYYY'),
			} as AccountBrand
		} catch (error) {
			if (!IS_PRODUCTION) console.log(error)

			throw new BadRequestException(
				'Возникла ошибка.Пожалуйста попробуйте позже.'
			)
		}
	}
}
