import { Injectable } from '@nestjs/common'
import { PaginationInput } from './input/pagination.input'

@Injectable()
export class PaginationService {
	getPagination(input: PaginationInput) {
		if (input.perPage && input.page) {
			const page = +input.page
			const perPage = +input.perPage
			const skip = (page - 1) * (perPage === -1 ? 1 : perPage)

			return { perPage, skip }
		}

		return { perPage: undefined, skip: 0 }
	}
}
