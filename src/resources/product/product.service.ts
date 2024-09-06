import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { dateFormat } from 'src/utils/formats/date-format.util'
import { queryProductFilters } from 'src/utils/query/query-product-filters.util'
import { NestedOrder } from '../order/entities/order.entity'
import { PaginationService } from '../pagination/pagination.service'
import { User } from '../user/entities/full/user.entity'
import { UserRole } from '../user/enums/user-role.enum'
import { AnnouncementCard } from './entity/announcement.entity'
import { Product, ProductCard } from './entity/product.entity'
import { ProductQueryInput } from './inputs/product-query.input'
import { announcementCardSelect } from './selects/announcement.select'
import { productCardSelect, productSelect } from './selects/product.select'
import { Logger } from '@nestjs/common';

const logger = new Logger('MyService');

@Injectable()
export class ProductService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly paginationService: PaginationService
	) {}

	async getAllProducts(input: ProductQueryInput) {
		logger.log('input' + JSON.stringify(input));

		const { createFilter, getSortFilter } = queryProductFilters()
		const { perPage, skip } = this.paginationService.getPagination(input)
		const filters = createFilter(input)
		logger.log('filters');
		logger.log(JSON.stringify(filters));
		logger.log("getSortFilter" + JSON.stringify(getSortFilter(input)));



		const [queriedProducts, count] = await Promise.all([
			this.prisma.product.findMany({
				where: filters, //createFilter / array
				orderBy: getSortFilter(input),
				skip,
				take: perPage,
				select: productCardSelect,
			}),
			this.prisma.product.count({ where: filters }),
		])

		const products = queriedProducts.map((product) => {
			const prices = product.prices.map((item) => item.price)
			const minPrice = Math.min(...prices)
			const maxPrice = Math.max(...prices)

			return {
				id: product.id,
				name: product.name,
				posterPath: product.posterPath,
				minPrice,
				maxPrice,
				rating: product.rating,
				ratesCount: product._count.reviews,
				category: product.category,
				provider: product.brand,
			}
		}) as ProductCard[]

		return {
			products: products || [],
			count: count || 0,
		}
	}

	async getAllAnnouncements(input: ProductQueryInput, brandId: number) {
		const { createFilter, getSortFilter } = queryProductFilters()
		const { perPage, skip } = this.paginationService.getPagination(input)
		const filters = createFilter({
			...input,
			brandId,
		})

		const [queriedAnnouncements, count] = await Promise.all([
			this.prisma.product.findMany({
				where: filters,
				orderBy: getSortFilter(input),
				skip,
				take: perPage,
				select: announcementCardSelect,
			}),
			this.prisma.product.count({ where: filters }),
		])

		const announcements = queriedAnnouncements.map((product) => {
			const prices = product.prices.map((item) => item.price)
			const minPrice = Math.min(...prices)
			const maxPrice = Math.max(...prices)

			return {
				id: product.id,
				name: product.name,
				posterPath: product.posterPath,
				minPrice,
				maxPrice,
				city: product.brand.city,
				sku: product.sku,
				views: product.views,
				createdAt: dateFormat(product.createdAt, 'DD MMMM YYYY'),
				orders: product.orders.map((order) => {
					let data = {}

					if (order.expirationAt) {
						const now = new Date()
						const timeDifference = order.expirationAt.getTime() - now.getTime()
						const isLittleLeft = timeDifference < 24 * 60 * 60 * 1000

						data = {
							expirationDate: dateFormat(order.expirationAt, 'DD.MM HH:mm'),
							isLittleLeft,
						}
					}

					return {
						...data,
						tariff: {
							type: order.tariff.type,
						},
					} as NestedOrder
				}),
			}
		}) as AnnouncementCard[]

		return {
			announcements: announcements || [],
			count: count || 0,
		}
	}

	async currentProduct(id: number, user: User) {
		const product = await this.prisma.product.findUnique({
			where: {
				id,
			},
			select: productSelect,
		})

		if (!product) throw new NotFoundException('Продукт не найден.')

		return {
			id: product.id,
			name: product.name,
			about: product.about,
			sku: product.sku,
			posterPath: product.posterPath,
			videoPath: product.videoPath,
			imagesPaths: product.imagesPaths,
			prices: product.prices.map(({ price, minQuantity }) => ({
				price: String(price),
				minQuantity: String(minQuantity),
			})),
			rating: String(product.rating),
			reviews: product.reviews.map((review) => ({
				...review,
				createdAt: dateFormat(review.createdAt, 'DD MMMM YYYY'),
			})),
			reviewsCount: product._count.reviews,
			category: product.category,
			provider: {
				id: product.brand.id,
				name: product.brand.name,
				slug: product.brand.slug,
				city: '',
				logoPath: product.brand.logoPath,
				phone: product.brand.user.profile.phone,
				whatsapp: product.brand.user.profile.whatsapp,
				telegram: product.brand.user.profile.telegram,
				rating: String(product.brand.rating),
				isSubscribed: product.brand.subscribers.includes(user.profile.email),
				isBrandOwner:
					user.role === UserRole.PROVIDER && product.brand.userId === user.id,
			},
			views: product.views,
			createdAt: dateFormat(product.createdAt, 'DD MMMM YYYY'),
		} as Product
	}
}
