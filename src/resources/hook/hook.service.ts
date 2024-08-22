import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { generateSlug } from 'src/utils/helpers/generate-slug.util'

@Injectable()
export class HookService {
	constructor(private readonly prisma: PrismaService) {}

	async uniqueSlug(name: string, variant: string, number = 1) {
		const newName = `${name}-${number}`

		const isExist = await this.prisma[variant].findUnique({
			where: {
				slug: generateSlug(name),
			},
		})

		if (!isExist) {
			return newName
		} else {
			return this.uniqueSlug(name, variant, number + 1)
		}
	}
}
