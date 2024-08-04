import type { Prisma } from '@prisma/client'
import { Sort, Visibility } from 'src/global/enums/query.enum'
import { CategoryQueryInput } from 'src/resources/category/inputs/category-query.input'

export const queryCategoryFilters = () => {
	const createFilter = (input: CategoryQueryInput) => {
		const filters = []

		if (input.searchTerm) filters.push(getSearchTermFilter(input.searchTerm))

		if (input.visibility) filters.push(getVisibilityFilter(input.visibility))

		if (input.popular) filters.push(getPopularFilter())

		return filters.length ? { AND: filters } : {}
	}

	const getSortFilter = (sort: Sort): any[] => {
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

	const getVisibilityFilter = (visibility: Visibility) => {
		return {
			visibility,
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
