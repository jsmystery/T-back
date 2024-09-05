import { Sort } from 'src/global/enums/query.enum'
import { ProductQueryInput } from 'src/resources/product/inputs/product-query.input'

export const queryProductFilters = () => {
	const createFilter = (input: ProductQueryInput) => {
		const filters = []

		if (input.searchTerm) filters.push(getSearchTermFilter(input.searchTerm))

		if (input.brandId) filters.push(getBrandFilter(input.brandId))

		if (input.brandCity) filters.push(getBrandCityFilter(input.brandCity))

		return filters.length ? { AND: filters } : {}
	}

	const getSortFilter = (input: ProductQueryInput) => {
		const orderBy = []

		if (input.views) {
			orderBy.push(getViewsSortFilter(input.views))
		} else if (input.sort) {
			orderBy.push(getCreatedSortFilter(input.sort))
		}

		return orderBy
	}

	const getCreatedSortFilter = (sort: Sort) => {
		return { createdAt: sort === Sort.DESC ? 'desc' : 'asc' }
	}

	const getViewsSortFilter = (views: Sort) => {
		return { views: views === Sort.DESC ? 'desc' : 'asc' }
	}

	const getBrandFilter = (brandId: number) => {
		return { brandId }
	}

	const getBrandCityFilter = (city: String) => {
		return {
			brand: {
				city: city,
			},
		};
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
