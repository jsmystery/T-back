import type { Prisma } from '@prisma/client'
import { Sort } from 'src/global/enums/query.enum'
import { CategoryQueryInput } from 'src/resources/category/inputs/category-query.input'

export const queryCategoryFilters = () => {
	const createFilter = (input: CategoryQueryInput) => {
		const filters = []

		if (input.searchTerm) filters.push(getSearchTermFilter(input.searchTerm))

		if (input.popular) filters.push(getPopularFilter())

		return filters.length ? { AND: filters } : {}
	}

	const getSortFilter = (sort: Sort): any[] => {
		// if (sort === Sort.RATE) {
		// 	return [{ rating:'desc'}]
		// }
		return [{ createdAt: sort === Sort.DESC ? 'desc' : 'asc' }]
	}

	const getPopularFilter = (): Prisma.CategoryWhereInput => {
		return {
			products: {
				some: {
					views: {
						gt: 0,
					},
				},
			},
		}
	}

	const getSearchTermFilter = (searchTerm: string) => {
		return {
			name: {
				contains: searchTerm,
				mode: 'insensitive',
			},
		}
	}

	return { createFilter, getSortFilter }
}
