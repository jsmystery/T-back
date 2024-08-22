import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { queryCategoryFilters } from 'src/utils/query/query-category-filters.util'
import { PaginationService } from '../pagination/pagination.service'
import { CategoryQueryInput } from './inputs/category-query.input'
import { categoryCardSelect } from './selects/category.select'

@Injectable()
export class CategoryService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly paginationService: PaginationService
	) {}

	async getAll(input: CategoryQueryInput) {
		const { createFilter, getSortFilter } = queryCategoryFilters()
		const { perPage, skip } = this.paginationService.getPagination(input)
		const filters = createFilter(input)

		const [categories, count] = await Promise.all([
			this.prisma.category.findMany({
				where: filters,
				orderBy: getSortFilter(input.sort),
				skip,
				take: perPage,
				select: categoryCardSelect,
			}),
			this.prisma.category.count({
				where: filters,
			}),
		])

		return {
			categories: categories || [],
			count: count || 0,
		}
	}

	async getSelectCategories() {
		return this.prisma.category.findMany({
			select: {
				id: true,
				name: true,
			},
		})
	}
}
