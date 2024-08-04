import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { IS_PRODUCTION } from 'src/global/constants/global.constants'
import { Visibility } from 'src/global/enums/query.enum'
import { PrismaService } from 'src/prisma/prisma.service'
import { queryProductFilters } from 'src/utils/query/query-product-filters.util'
import { HookService } from '../hook/hook.service'
import { PaginationService } from '../pagination/pagination.service'
import { ProductCard } from './entity/product.entity'
import { ProductQueryInput } from './inputs/product-query.input'
import { ProductInput } from './inputs/product.input'
import { productCardSelect, productFullSelect } from './selects/product.select'

@Injectable()
export class ProductService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly paginationService: PaginationService,
		private readonly hookService: HookService
	) {}

	async getAll(input: ProductQueryInput) {
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
				visibility: product.visibility
			}
		}) as ProductCard[]

		return {
			products: products || [],
			count: count || 0,
		}
	}

	// Admin and Provider Place
	async byId(id: number) {
		const product = await this.prisma.product.findUnique({
			where: {
				id,
			},
			select: productFullSelect,
		})

		if (!product) throw new NotFoundException('Продукт не найден.')

		return product
	}

	async toggleVisibility(id: number) {
		try {
			const product = await this.byId(id)
			const visibility =
				product.visibility === Visibility.VISIBLE
					? Visibility.HIDDEN
					: Visibility.VISIBLE

			await this.prisma.product.update({
				where: {
					id,
				},
				data: {
					visibility,
				},
			})

			return visibility
		} catch (error) {
			if (!IS_PRODUCTION) {
				console.log(error)
			}
			throw new BadRequestException(
				'Произошла ошибка при обновлении статуса видимости.'
			)
		}
	}

	async duplicate(id: number) {
		try {
			const product = await this.byId(id)
			const name = await this.hookService.uniqueSlug(product.name, 'product')

			return this.prisma.product.create({
				data: {
					name: name,
					about: product.about,
					sku: product.sku,
					posterPath: product.posterPath,
					videoPath: product.videoPath,
					imagesPaths: product.imagesPaths,
					prices: {
						create: product.prices.map((price) => ({
							price: price.price,
							minQuantity: price.minQuantity,
						})),
					},
					brand: {
						connect: {
							id: product.brand.id,
						},
					},
					category: {
						connect: {
							id: product.category.id,
						},
					},
				},
				select: productCardSelect
			})
		} catch (error) {
			if (!IS_PRODUCTION) {
				console.log(error)
			}
			throw new BadRequestException('Произошла ошибка при создании дубликата.')
		}
	}

	async create(input: ProductInput, brandId: number) {
		try {
			const { poster, video, images, ...inputData } = input

			const uploadPromises = [
				this.hookService.uploadFile('products', poster),
				...(video ? [this.hookService.uploadFile('products', video)] : []),
				...images.map((image) =>
					this.hookService.uploadFile('products', image)
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
				select: productCardSelect
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
				this.hookService.uploadFile('products', poster, product.posterPath),
				...(video
					? [this.hookService.uploadFile('products', video, product.videoPath)]
					: []),
				...images.map((image, index) =>
					this.hookService.uploadFile(
						'products',
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
				select: productCardSelect
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
