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
import {
	announcementCardSelect,
	announcementSelect,
} from './selects/announcement.select'
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
	async byId(id: number, type: 'product' | 'announcement') {
		const product = await this.prisma.product.findUnique({
			where: {
				id,
			},
			select: type === 'product' ? productSelect : announcementSelect,
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

	async edit(
		type: 'product' | 'announcement',
		input: ProductInput,
		brandId: number,
		productId?: number
	) {
		const isProduct = type === 'product'

		try {
			if (!productId) {
				if (isProduct) {
					return this.createProduct(input, brandId)
				} else {
					return this.createAnnouncement(input, brandId)
				}
			} else {
				if (isProduct) {
					return this.updateProduct(productId, input)
				} else {
					return this.updateAnnouncement(productId, input)
				}
			}
		} catch (error) {
			if (!IS_PRODUCTION) {
				console.log(error)
			}
			throw new BadRequestException(
				'Возникла ошибка. Пожалуйста попробуйте позже.'
			)
		}
	}

	async createAnnouncement(input: ProductInput, brandId: number) {
		let posterPath = ''
		let videoPath
		let imagesPaths = []

		const product = await this.prisma.product.create({
			data: {
				posterPath,
				videoPath,
				imagesPaths,
				name: input.name,
				about: input.about,
				sku: input.sku,
				prices: {
					create: input.prices.map((price) => ({
						price: +price.price,
						minQuantity: +price.minQuantity,
					})),
				},
				brand: {
					connect: {
						id: brandId,
					},
				},
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

		if (input.posterFile) {
			posterPath = await this.hookService.uploadFile(
				`products/${product.id}`,
				'poster',
				input.posterFile
			)
		} else {
			posterPath = input.posterPath
		}

		if (input.videoFile) {
			videoPath = await this.hookService.uploadFile(
				`products/${product.id}`,
				'video',
				input.videoFile
			)
		} else {
			videoPath = input.videoPath
		}

		if (input.imagesFiles) {
			imagesPaths = input.imagesFiles.map(async (path, index) => {
				await this.hookService.uploadFile(
					`products/${product.id}`,
					`image-${index}`,
					path
				)
			})
		} else {
			imagesPaths = input.imagesPaths
		}

		const createdProduct = await this.prisma.product.update({
			where: {
				id: product.id,
			},
			data: {
				posterPath,
				videoPath,
				imagesPaths,
			},
			select: announcementCardSelect,
		})

		const prices = createdProduct.prices.map((item) => item.price)
		const minPrice = Math.min(...prices)
		const maxPrice = Math.max(...prices)

		return {
			id: createdProduct.id,
			name: createdProduct.name,
			posterPath: createdProduct.posterPath,
			minPrice,
			maxPrice,
			city: createdProduct.brand.city,
			sku: createdProduct.sku,
			views: createdProduct.views,
			createdAt: dateFormat(createdProduct.createdAt, 'DD MMMM YYYY'),
			orders: createdProduct.orders.map((order) => {
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
		} as AnnouncementCard
	}

	async updateAnnouncement(id: number, input: ProductInput) {
		const product = await this.byId(id, 'announcement')

		let posterPath = ''
		let videoPath
		let imagesPaths = []

		if (input.posterFile) {
			posterPath = await this.hookService.uploadFile(
				`products/${product.id}`,
				'poster',
				input.posterFile,
				product.posterPath
			)
		} else {
			posterPath = input.posterPath
		}

		if (input.videoFile) {
			videoPath = await this.hookService.uploadFile(
				`products/${product.id}`,
				'video',
				input.videoFile,
				product.videoPath
			)
		} else {
			videoPath = input.videoPath
		}

		if (input.imagesFiles) {
			imagesPaths = input.imagesFiles.map(async (path, index) => {
				await this.hookService.uploadFile(
					`products/${product.id}`,
					`image-${index}`,
					path,
					product.imagesPaths[index]
				)
			})
		} else {
			imagesPaths = input.imagesPaths
		}

		const updatedProduct = await this.prisma.product.update({
			where: {
				id,
			},
			data: {
				posterPath,
				videoPath,
				imagesPaths,
				name: input.name,
				about: input.about,
				sku: input.sku,
				prices: {
					deleteMany: {},
					create: input.prices.map((price) => ({
						price: +price.price,
						minQuantity: +price.minQuantity,
					})),
				},
				category: {
					connect: {
						id: input.category.value,
					},
				},
			},
			select: announcementCardSelect,
		})

		const prices = updatedProduct.prices.map((item) => item.price)
		const minPrice = Math.min(...prices)
		const maxPrice = Math.max(...prices)

		return {
			id: updatedProduct.id,
			name: updatedProduct.name,
			posterPath: updatedProduct.posterPath,
			minPrice,
			maxPrice,
			city: updatedProduct.brand.city,
			sku: updatedProduct.sku,
			views: updatedProduct.views,
			createdAt: dateFormat(updatedProduct.createdAt, 'DD MMMM YYYY'),
			orders: updatedProduct.orders.map((order) => {
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
		} as AnnouncementCard
	}

	async createProduct(input: ProductInput, brandId: number) {
		let posterPath = ''
		let videoPath
		let imagesPaths = []

		const product = await this.prisma.product.create({
			data: {
				posterPath,
				videoPath,
				imagesPaths,
				name: input.name,
				about: input.about,
				sku: input.sku,
				prices: {
					create: input.prices.map((price) => ({
						price: +price.price,
						minQuantity: +price.minQuantity,
					})),
				},
				brand: {
					connect: {
						id: brandId,
					},
				},
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

		if (input.posterFile) {
			posterPath = await this.hookService.uploadFile(
				`products/${product.id}`,
				'poster',
				input.posterFile
			)
		} else {
			posterPath = input.posterPath
		}

		if (input.videoFile) {
			videoPath = await this.hookService.uploadFile(
				`products/${product.id}`,
				'video',
				input.videoFile
			)
		} else {
			videoPath = input.videoPath
		}

		if (input.imagesFiles) {
			imagesPaths = input.imagesFiles.map(async (path, index) => {
				await this.hookService.uploadFile(
					`products/${product.id}`,
					`image-${index}`,
					path
				)
			})
		} else {
			imagesPaths = input.imagesPaths
		}

		const createdProduct = await this.prisma.product.update({
			where: {
				id: product.id,
			},
			data: {
				posterPath,
				videoPath,
				imagesPaths,
			},
			select: productCardSelect,
		})

		const prices = createdProduct.prices.map((item) => item.price)
		const minPrice = Math.min(...prices)
		const maxPrice = Math.max(...prices)

		return {
			id: createdProduct.id,
			name: createdProduct.name,
			posterPath: createdProduct.posterPath,
			minPrice,
			maxPrice,
			rating: createdProduct.rating,
			ratesCount: createdProduct._count.reviews,
			category: createdProduct.category,
			provider: createdProduct.brand,
		}
	}

	async updateProduct(id: number, input: ProductInput) {
		const product = await this.byId(id, 'announcement')

		let posterPath = ''
		let videoPath
		let imagesPaths = []

		if (input.posterFile) {
			posterPath = await this.hookService.uploadFile(
				`products/${product.id}`,
				'poster',
				input.posterFile,
				product.posterPath
			)
		} else {
			posterPath = input.posterPath
		}

		if (input.videoFile) {
			videoPath = await this.hookService.uploadFile(
				`products/${product.id}`,
				'video',
				input.videoFile,
				product.videoPath
			)
		} else {
			videoPath = input.videoPath
		}

		if (input.imagesFiles) {
			imagesPaths = input.imagesFiles.map(async (path, index) => {
				await this.hookService.uploadFile(
					`products/${product.id}`,
					`image-${index}`,
					path,
					product.imagesPaths[index]
				)
			})
		} else {
			imagesPaths = input.imagesPaths
		}

		const updatedProduct = await this.prisma.product.update({
			where: {
				id,
			},
			data: {
				posterPath,
				videoPath,
				imagesPaths,
				name: input.name,
				about: input.about,
				sku: input.sku,
				prices: {
					deleteMany: {},
					create: input.prices.map((price) => ({
						price: +price.price,
						minQuantity: +price.minQuantity,
					})),
				},
				category: {
					connect: {
						id: input.category.value,
					},
				},
			},
			select: productCardSelect,
		})

		const prices = updatedProduct.prices.map((item) => item.price)
		const minPrice = Math.min(...prices)
		const maxPrice = Math.max(...prices)

		return {
			id: updatedProduct.id,
			name: updatedProduct.name,
			posterPath: updatedProduct.posterPath,
			minPrice,
			maxPrice,
			rating: updatedProduct.rating,
			ratesCount: updatedProduct._count.reviews,
			category: updatedProduct.category,
			provider: updatedProduct.brand,
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
