import { Injectable, NotFoundException } from '@nestjs/common'
import { UpdateBrandInput } from './input/update-brand.input'
import { PrismaService } from 'src/prisma/prisma.service'
import { UpdateBrandInputAdmin } from './input/update-brand-admin.input'

import { dateFormat } from 'src/utils/formats/date-format.util'
import { queryBrandFilters } from 'src/utils/query/query-brand-filters.util'
import { CategoryService } from '../category/category.service'
import { PaginationService } from '../pagination/pagination.service'
import { reviewCardSelect } from '../review/selects/review.select'
import { TariffService } from '../tariff/tariff.service'
import { User } from '../user/entities/full/user.entity'
import { UserRole } from '../user/enums/user-role.enum'
import { Account, Brand, BrandCard } from './entities/brand.entity'
import { BrandQueryInput } from './input/brand-query.input'
import { CreateBrandInput } from './input/create-brand.input';
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
		private readonly tariffService: TariffService
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
				about: brand.about,
				city: brand.city,
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
								whatsapp: true,
								telegram: true,
							},
						},
					},
				},
			},
		})


		if (!brand) throw new NotFoundException('Поставщик не найден.')

		console.log(brand);
		

		return {
			id: brand.id,
			name: brand.name,
			logoPath: brand.logoPath,
			city: brand.city,
			postedCount: brand._count.products,
			rating: String(brand.rating),
			phone: brand.user.profile.phone,
			whatsapp: brand.user.profile.whatsapp,
			telegram: brand.user.profile.telegram ?? null,
			isSubscribed: false,
			// isSubscribed: brand.subscribers.includes(user.profile.email),
			isBrandOwner:false,
				// user.role === UserRole.PROVIDER && brand.user.id === user.id,
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


	async updateBrand(id: number, input: UpdateBrandInput): Promise<any> {
		const brand = await this.prisma.brand.findUnique({ where: { id } })
		if (!brand) {
		  throw new NotFoundException('Brand not found')
		}
  
		return this.prisma.brand.update({
		  where: { id },
		  data: {
			 name: input.name,
			 city: input.city,
			 about: input.about,
		  },
		  select: {
			 id: true,
			 name: true,
			 city: true,
			 about: true,
		  },
		})
	 }

	async updateBrandAdmin(id: number, input: UpdateBrandInputAdmin): Promise<any> {
		const brand = await this.prisma.brand.findUnique({ where: { id } })
		if (!brand) {
		  throw new NotFoundException('Brand not found')
		}
  
		return this.prisma.brand.update({
		  where: { id },
		  data: {
			 name: input.name,
			 city: input.city,
			 about: input.about,
			 slug: input.slug,
			 logoPath: input.logoPath,
		  },
		  select: {
			 id: true,
			 name: true,
			 city: true,
			 slug: true,
			 about: true,
			 logoPath: true,
		  },
		})
	 }

	 async createBrand(createBrandInput: CreateBrandInput, userId: number): Promise<any> {
		const { name, slug, city, logoPath, about } = createBrandInput;
  
		return this.prisma.brand.create({
		  data: {
			 name,             // Brand name
			 slug,             // Brand slug
			 city,             // Brand city
			 logoPath: '',         // Brand logo path
			 about,            // Brand description
			 subscribers: [],      // List of subscribers
			 rating: 0,           // Brand rating
			 balance: 0,          // Brand balance
			 categoryId: 1,       // Category ID
			//  createdAt: dateFormat(brand.createdAt, 'DD-MM-YYYY'),
			 userId,           // Set the userId from CurrentUser decorator as the brand owner
			//  reviews: [],         // Empty reviews initially
			//  postedCount: 0,      // Default postedCount
			//  reviewsCount: 0      // Default reviewsCount
		  },
		  select: {
			 id: true,
			 name: true,
			 slug: true,
			 city: true,
			 logoPath: true,
			 about: true,
			 subscribers: true,
			 rating: true,
			 balance: true,
			 categoryId: true,
			 userId: true,
			 reviews: true,
			//  postedCount: true,
			//  reviewsCount: true,
			 createdAt: true,
			 updatedAt: true
		  }
		});
	 }
}
