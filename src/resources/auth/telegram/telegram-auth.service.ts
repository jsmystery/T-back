import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { SessionUser } from 'src/resources/user/entities/session/session-user.entity'
import {
	profileBaseSelect,
	userBaseSelect,
	userRegisterSelect,
} from 'src/resources/user/selects/user.select'
import { AuthService } from '../auth.service'
import { TelegramAuthInput } from './inputs/telegram-auth.input'

@Injectable()
export class TelegramAuthService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly authService: AuthService
	) {}

	async auth({ login, password }: TelegramAuthInput) {
		try {
			const oldUser = await this.prisma.profile.findUnique({
				where: {
					login,
				},
				select: {
					...profileBaseSelect,
					password: true,
					user: {
						select: userBaseSelect,
					},
				},
			})

			if (oldUser) {
				const tokens = await this.authService.issueTokens(oldUser.user.id)

				return {
					user: {
						id: oldUser.user.id,
						profile: {
							login: oldUser.login,
							email: oldUser.email,
							phone: oldUser.phone,
						},
						role: oldUser.user.role,
					} as SessionUser,
					...tokens,
				}
			}

			const newUser = await this.prisma.user.create({
				data: {
					profile: {
						create: {
							login,
							password,
						},
					},
				},
				select: userRegisterSelect,
			})

			const tokens = await this.authService.issueTokens(newUser.id)

			return {
				user: newUser,
				...tokens,
			}
		} catch (err) {
			console.log(err)
		}
	}
}
