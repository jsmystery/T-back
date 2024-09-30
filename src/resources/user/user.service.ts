import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { userFullSelect } from './selects/user.select'
import { UpdateUserInput } from './inputs/update-user.input' 


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

	async updateUserProfile(id: number, input: UpdateUserInput) {
		const { email, password, whatsapp, telegram, phone } = input // Highlight: Destructure the input values

		await this.prisma.profile.update({
			where: { userId: id },
			data: {
				email,
				password,
				whatsapp,
				telegram,
				phone,
			},
		})

		return true // Highlight: Return success status
	}
}
