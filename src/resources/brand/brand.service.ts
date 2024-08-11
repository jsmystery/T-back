import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { dateFormat } from 'src/utils/formats/date-format.util'
import { queryBrandFilters } from 'src/utils/query/query-brand-filters.util'
import { PaginationService } from '../pagination/pagination.service'
import { reviewCardSelect } from '../review/selects/review.select'
import { User } from '../user/entities/full/user.entity'
import { UserRole } from '../user/enums/user-role.enum'
import { AccountBrand, Brand, BrandCard } from './entities/brand.entity'
import { BrandQueryInput } from './input/brand-query.input'
import {
	accountBrandSelect,
	brandCardSelect,
	brandSelect,
} from './selects/brand.select'

@Injectable()
export class BrandService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly paginationService: PaginationService
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

		if (!brand) throw new BadRequestException('Бренд не найден.')

		return {
			id: brand.id,
			name: brand.name,
			balance: brand.balance,
			email: brand.user.profile.email,
			phone: brand.user.profile.phone,
			whatsapp: brand.user.profile.whatsapp,
			telegram: brand.user.profile.telegram,
			logoPath: brand.logoPath,
			city: brand.city,
			postedCount: brand._count.products,
			subscribers: brand.subscribers,
			createdAt: dateFormat(brand.createdAt, 'DD.MM.YYYY'),
		} as AccountBrand
	}
}
