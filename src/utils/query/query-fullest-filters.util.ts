import { Sort, Visibility } from 'src/global/enums/query.enum'
import { FullestQueryInput } from 'src/global/inputs/query.input'

export const queryFullestFilters = () => {
	const createFilter = (input: FullestQueryInput) => {
		const filters = []

		if (input.searchTerm) filters.push(getSearchTermFilter(input.searchTerm))

		if (input.visibility) filters.push(getVisibilityFilter(input.visibility))

		return filters.length ? { AND: filters } : {}
	}

	const getSortFilter = (sort: Sort): any[] => {
		return [{ createdAt: sort === Sort.DESC ? 'desc' : 'asc' }]
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
