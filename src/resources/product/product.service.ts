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
import { UpdateProductInput } from './inputs/update-product.input'
import { CreateProductInput } from './inputs/create-product.input'
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
		// logger.log('filters');
		// logger.log(JSON.stringify(filters));
		// logger.log("getSortFilter" + JSON.stringify(getSortFilter(input)));



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
			console.log(product.prices);
			
			const prices = product.prices.map((item) => item.price)
			const pricesFull = product.prices
			const minPrice = Math.min(...prices)
			const maxPrice = Math.max(...prices)

			return {
				id: product.id,
				name: product.name,
				posterPath: product.posterPath,
				about: product.about,
				minPrice,
				maxPrice,
				pricesFull:pricesFull,
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

	async currentProduct(id: number, user?: User) {
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
				isSubscribed:false,
				//  product.brand.subscribers.includes(user.profile?.email),
				isBrandOwner: false
					// user.role === UserRole.PROVIDER && product.brand.userId === user.id,
			},
			views: product.views,
			createdAt: dateFormat(product.createdAt, 'DD MMMM YYYY'),
		} as Product
	}



	// New method to delete a product
	async deleteProduct(id: number, brandId: number): Promise<boolean> {
		const product = await this.prisma.product.findUnique({
			where: { id },
		})

		// Check if product exists
		if (!product) {
			throw new NotFoundException('Продукт не найден.')
		}

		// Ensure that only the owner of the product's brand can delete it
		if (product.brandId !== brandId) {
			throw new NotFoundException('У вас нет прав для удаления этого продукта.') // Authorization check
		}

		// Delete the product
		await this.prisma.product.delete({
			where: { id },
		})

		return true
	}



	async updateProduct(id: number, data: UpdateProductInput, brandId: number): Promise<any> {
		const product = await this.prisma.product.findUnique({
		  where: { id },
		});
	 
		if (!product) {
		  throw new NotFoundException('Product not found.');
		}
	 
		// Ensure that only the owner of the product's brand can update it
		if (product.brandId !== brandId) {
		  throw new NotFoundException('You do not have permission to update this product.');
		}
	 
		const price = await this.prisma.price.findFirst({
		  where: { productId: id }, // Assuming price is linked to product by productId
		});
	 
		if (!price) {
		  throw new NotFoundException('Price not found for this product.');
		}
	 
		// Update the first price
		await this.prisma.price.update({
		  where: { id: price.id }, // Use the price ID to update the row
		  data: {
			 minQuantity: data.minQuantity,
			 price: data.price,
		  },
		});
	 
		// Update or create the second price
		if (data.price2 && data.minQuantity2) {
		  const price2 = await this.prisma.price.findFirst({
			 where: { productId: id, minQuantity: data.minQuantity2 },
		  });
	 
		  if (price2) {
			 // Update existing second price
			 await this.prisma.price.update({
				where: { id: price2.id },
				data: {
				  minQuantity: data.minQuantity2,
				  price: data.price2,
				},
			 });
		  } else {
			 // Create new second price
			 await this.prisma.price.create({
				data: {
				  minQuantity: data.minQuantity2,
				  price: data.price2,
				  productId: product.id,
				},
			 });
		  }
		}
	 
		// Update or create the third price
		if (data.price3 && data.minQuantity3) {
		  const price3 = await this.prisma.price.findFirst({
			 where: { productId: id, minQuantity: data.minQuantity3 },
		  });
	 
		  if (price3) {
			 // Update existing third price
			 await this.prisma.price.update({
				where: { id: price3.id },
				data: {
				  minQuantity: data.minQuantity3,
				  price: data.price3,
				},
			 });
		  } else {
			 // Create new third price
			 await this.prisma.price.create({
				data: {
				  minQuantity: data.minQuantity3,
				  price: data.price3,
				  productId: product.id,
				},
			 });
		  }
		}
	 
		return this.prisma.product.update({
		  where: { id }, // Find the product by ID
		  data: {
			 name: data.name,
			 about: data.about,
		  },
		});
	 }

	 

	async createProduct(createProductInput: CreateProductInput, brandId: number): Promise<any> {
		const { name, about, price, minQuantity, price2, minQuantity2, price3, minQuantity3 } = createProductInput;
	 
		const product = await this.prisma.product.create({ 
		  data: {
			 name,        
			 about,       
			 brandId,     // Brand ID from CurrentUser
			 categoryId:  1,
			 sku:  Math.random().toString().slice(2, 13),
			 rating:  1,
			 views:  0,
			 posterPath:  '/uploads/products/product-0-poster.png',
			 videoPath:  '/uploads/products/product-17-video.mp4',
			 imagesPaths: ["/uploads/products/product-17-image-1.png","/uploads/products/product-17-image-2.png"]
		  },
		  select: {
			 id: true,
			 name: true,
			 about: true,
			 sku: true,
			 posterPath: true,
			 imagesPaths: true,
			 rating: true,
			 views: true,
			 brandId: true,
			 categoryId: true,
			 createdAt: true,
			 updatedAt: true,
		  },
		});

		await this.prisma.price.create({
			data: {
				minQuantity: minQuantity, 
				price: price,     
				productId: product.id, 
			},
		});

		// Optionally create the second price entry if price2 is provided
		if (price2 && minQuantity2) {
			await this.prisma.price.create({
			  data: {
				 minQuantity: minQuantity2,
				 price: price2,
				 productId: product.id,
			  },
			});
		 }
	  
		 // Optionally create the third price entry if price3 is provided
		 if (price3 && minQuantity3) {
			await this.prisma.price.create({
			  data: {
				 minQuantity: minQuantity3,
				 price: price3,
				 productId: product.id, 
			  },
			});
		 }
	  

		return true 
	 }
	 
}
