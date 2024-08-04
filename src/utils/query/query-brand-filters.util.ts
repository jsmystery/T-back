import { Visibility } from '@prisma/client'
import { Sort } from 'src/global/enums/query.enum'
import { BrandQueryInput } from 'src/resources/brand/input/brand-query.input'

export const queryBrandFilters = () => {
	const createFilter = (input: BrandQueryInput) => {
		const filters = []

		if (input.searchTerm) filters.push(getSearchTermFilter(input.searchTerm))

		if (input.visibility) filters.push(getVisibilityFilter(input.visibility))

		return filters.length ? { AND: filters } : {}
	}

	const getSortFilter = (input: BrandQueryInput) => {
		const orderBy = []

		if (input.rating) orderBy.push(getRatingFilter(input.rating))

		if (input.reviewsCount) orderBy.push(getReviewsFilter(input.reviewsCount))

		if (input.sort) orderBy.push(getCreatedSortFilter(input.sort))

		return orderBy
	}

	const getCreatedSortFilter = (sort: Sort) => {
		return { createdAt: sort === Sort.DESC ? 'desc' : 'asc' }
	}

	const getRatingFilter = (rating: Sort) => {
		return { rating: rating === Sort.DESC ? 'desc' : 'asc' }
	}

	const getReviewsFilter = (reviewsCount: Sort) => {
		return {
			reviews: {
				_count: reviewsCount === Sort.DESC ? 'desc' : 'asc',
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
