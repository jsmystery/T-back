import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { userFullSelect } from './selects/user.select'

@Injectable()
export class UserService {
	constructor(private readonly prisma: PrismaService) {}

	async byId(id: number) {
		const user = await this.prisma.user.findUnique({
			where: {
				id,
			},
			select: userFullSelect,
		})

		if (!user) throw new NotFoundException('Пользователь не найден.')

		return user
	}
}
