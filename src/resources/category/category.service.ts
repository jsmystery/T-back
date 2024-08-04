import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { IS_PRODUCTION } from 'src/global/constants/global.constants'
import { Visibility } from 'src/global/enums/query.enum'
import { PrismaService } from 'src/prisma/prisma.service'
import { generateSlug } from 'src/utils/helpers/generate-slug.util'
import { queryCategoryFilters } from 'src/utils/query/query-category-filters.util'
import { HookService } from '../hook/hook.service'
import { PaginationService } from '../pagination/pagination.service'
import { CategoryQueryInput } from './inputs/category-query.input'
import { CategoryInput } from './inputs/category.input'
import {
	categoryCardSelect,
	categoryFullSelect,
} from './selects/category.select'

@Injectable()
export class CategoryService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly paginationService: PaginationService,
		private readonly hookService: HookService
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

	// Admin Place
	async byId(id: number) {
		const category = await this.prisma.category.findUnique({
			where: {
				id,
			},
			select: categoryFullSelect,
		})

		if (!category) throw new NotFoundException('Категория не найдена.')

		return category
	}

	async toggleVisibility(id: number) {
		try {
			const category = await this.byId(id)

			await this.prisma.category.update({
				where: {
					id,
				},
				data: {
					visibility:
						category.visibility === Visibility.VISIBLE
							? Visibility.HIDDEN
							: Visibility.VISIBLE,
				},
			})

			return true
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
			const category = await this.byId(id)
			const name = await this.hookService.uniqueSlug(category.name, 'category')

			await this.prisma.category.create({
				data: {
					name: name,
					slug: generateSlug(name),
					smallImagePath: category.smallImagePath,
					bigImagePath: category.bigImagePath,
					seo: category.seo
						? {
								create: {
									title: category.seo.title,
									description: category.seo.description,
								},
						  }
						: undefined,
					visibility: Visibility.VISIBLE,
				},
			})

			return true
		} catch (error) {
			if (!IS_PRODUCTION) {
				console.log(error)
			}
			throw new BadRequestException('Произошла ошибка при создании дубликата.')
		}
	}

	async create() {
		try {
			const isExists = await this.prisma.category.findUnique({
				where: {
					slug: '',
				},
			})

			if (isExists) throw new BadRequestException('Категория уже существует.')

			await this.prisma.category.create({
				data: {
					name: '',
					slug: '',
					smallImagePath: undefined,
					bigImagePath: undefined,
				},
			})

			return true
		} catch (error) {
			if (!IS_PRODUCTION) {
				console.log(error)
			}
			throw new BadRequestException('Произошла ошибка при создании категории.')
		}
	}

	async update(id: number, input: CategoryInput) {
		try {
			const category = await this.byId(id)

			const isExists = await this.prisma.category.findUnique({
				where: {
					slug: generateSlug(input.name),
					NOT: {
						slug: category.slug,
					},
				},
			})

			if (isExists) throw new BadRequestException('Категория уже существует.')

			await this.prisma.category.update({
				where: {
					id,
				},
				data: {
					name: input.name,
					slug: generateSlug(input.name),
					smallImagePath: input.smallImagePath,
					bigImagePath: input.bigImagePath,
					seo: {
						delete: category.seo ? true : false,
						create: input.seo
							? {
									title: input.seo.title,
									description: input.seo.description,
							  }
							: undefined,
					},
					visibility: Visibility.VISIBLE,
				},
			})
			return true
		} catch (error) {
			if (!IS_PRODUCTION) {
				console.log(error)
			}
			throw new BadRequestException('Произошла ошибка при обновлении категории.')
		}
	}

	async delete(id: number) {
		try {
			await this.prisma.category.delete({
				where: {
					id,
				},
			})

			return true
		} catch (error) {
			if (!IS_PRODUCTION) {
				console.log(error)
			}
			throw new BadRequestException('Произошла ошибка при создании категории.')
		}
	}
}
