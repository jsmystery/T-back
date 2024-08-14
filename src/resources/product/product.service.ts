import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { IS_PRODUCTION } from 'src/global/constants/global.constants'
import { PrismaService } from 'src/prisma/prisma.service'
import { dateFormat } from 'src/utils/formats/date-format.util'
import { queryProductFilters } from 'src/utils/query/query-product-filters.util'
import { HookService } from '../hook/hook.service'
import { NestedOrder } from '../order/entities/order.entity'
import { PaginationService } from '../pagination/pagination.service'
import { User } from '../user/entities/full/user.entity'
import { UserRole } from '../user/enums/user-role.enum'
import { AnnouncementCard } from './entity/announcement.entity'
import { Product, ProductCard } from './entity/product.entity'
import { ProductQueryInput } from './inputs/product-query.input'
import { ProductInput } from './inputs/product.input'
import { announcementCardSelect } from './selects/announcement.selec'
import { productCardSelect, productSelect } from './selects/product.select'

@Injectable()
export class ProductService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly paginationService: PaginationService,
		private readonly hookService: HookService
	) {}

	async getAllProducts(input: ProductQueryInput) {
		const { createFilter, getSortFilter } = queryProductFilters()
		const { perPage, skip } = this.paginationService.getPagination(input)
		const filters = createFilter(input)

		const [queriedProducts, count] = await Promise.all([
			this.prisma.product.findMany({
				where: filters,
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

	async getAllAnnouncements(input: ProductQueryInput) {
		const { createFilter, getSortFilter } = queryProductFilters()
		const { perPage, skip } = this.paginationService.getPagination(input)
		const filters = createFilter(input)

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
							expirationDate: dateFormat(order.expirationAt, 'DD.MM.YYYY'),
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

	// Admin and Provider Place
	async byId(id: number) {
		const product = await this.prisma.product.findUnique({
			where: {
				id,
			},
			select: productSelect,
		})

		if (!product) throw new NotFoundException('Продукт не найден.')

		return product
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
				price,
				minQuantity,
			})),
			rating: String(product.rating),
			reviews: product.reviews.map((review) => ({
				...review,
				createdAt: dateFormat(review.createdAt, 'DD MMMM YYYY'),
			})),
			reviewsCount: product._count.reviews,
			category: product.category,
			provider: {
				...product.brand,
				rating: String(product.brand.rating),
				isSubscribed: product.brand.subscribers.includes(user.profile.email),
				isBrandOwner:
					user.role === UserRole.PROVIDER && product.brand.userId === user.id,
			},
			views: product.views,
			createdAt: dateFormat(product.createdAt, 'DD MMMM YYYY'),
		} as Product
	}

	async create(input: ProductInput, brandId: number) {
		try {
			const { poster, video, images, ...inputData } = input

			const uploadPromises = [
				this.hookService.uploadFile('products', 'poster', poster),
				...(video
					? [this.hookService.uploadFile('products', 'video', video)]
					: []),
				...images.map((image, index) =>
					this.hookService.uploadFile('products', `image-${index}`, image)
				),
			]

			const [posterPath, videoPath, ...imagesPaths] = await Promise.all(
				uploadPromises
			)

			return this.prisma.product.create({
				data: {
					posterPath,
					videoPath,
					imagesPaths,
					name: inputData.name,
					about: inputData.about,
					sku: inputData.sku,
					prices: {
						create: inputData.prices.map((price) => ({
							price: price.price,
							minQuantity: price.minQuantity,
						})),
					},
					brand: {
						connect: {
							id: brandId,
						},
					},
					category: {
						connect: {
							id: inputData.category.value,
						},
					},
				},
				select: productCardSelect,
			})
		} catch (error) {
			if (!IS_PRODUCTION) {
				console.log(error)
			}
			throw new BadRequestException('Произошла ошибка при создании категории.')
		}
	}

	async update(id: number, input: ProductInput) {
		try {
			const product = await this.byId(id)

			const { poster, video, images, ...inputData } = input

			const uploadPromises = [
				this.hookService.uploadFile(
					'products',
					'poster',
					poster,
					product.posterPath
				),
				...(video
					? [
							this.hookService.uploadFile(
								'products',
								'video',
								video,
								product.videoPath
							),
					  ]
					: []),
				...images.map((image, index) =>
					this.hookService.uploadFile(
						'products',
						`image-${index}`,
						image,
						product.imagesPaths[index]
					)
				),
			]

			const [posterPath, videoPath, ...imagesPaths] = await Promise.all(
				uploadPromises
			)

			return this.prisma.product.update({
				where: {
					id,
				},
				data: {
					posterPath,
					videoPath,
					imagesPaths,
					name: inputData.name,
					about: inputData.about,
					sku: inputData.sku,
					prices: {
						deleteMany: {},
						create: inputData.prices.map((price) => ({
							price: price.price,
							minQuantity: price.minQuantity,
						})),
					},
					category: {
						connect: {
							id: inputData.category.value,
						},
					},
				},
				select: productCardSelect,
			})
		} catch (error) {
			if (!IS_PRODUCTION) {
				console.log(error)
			}
			throw new BadRequestException(
				'Произошла ошибка при обновлении категории.'
			)
		}
	}

	async delete(id: number) {
		try {
			const product = await this.prisma.product.delete({
				where: {
					id,
				},
			})

			return product.id
		} catch (error) {
			if (!IS_PRODUCTION) {
				console.log(error)
			}
			throw new BadRequestException('Произошла ошибка при создании категории.')
		}
	}
}
