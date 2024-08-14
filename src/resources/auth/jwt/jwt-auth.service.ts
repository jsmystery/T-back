import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { hash, verify } from 'argon2'
import { IS_PRODUCTION } from 'src/global/constants/global.constants'
import { PrismaService } from 'src/prisma/prisma.service'
import { MailService } from 'src/resources/mail/mail.service'
import {
	userCheckSelect,
	userLoginSelect,
	userRegisterSelect,
} from 'src/resources/user/selects/user.select'
import { AuthService } from '../auth.service'
import { JwtAuthConfirmationInput } from './inputs/jwt-auth-confirmation.input'
import { JwtAuthLoginInput } from './inputs/jwt-auth-login.input'
import { JwtAuthResetInput } from './inputs/jwt-auth-reset.input'
import { JwtAuthVerificationInput } from './inputs/jwt-auth-verification.input'

@Injectable()
export class JwtAuthService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly authService: AuthService,
		private readonly mailService: MailService,
		private readonly jwtService: JwtService
	) {}

	async sendConfirmation(input: JwtAuthConfirmationInput) {
		await this.checkUser(input)

		const confirmationToken = await this.jwtService.signAsync(input, {
			expiresIn: `6h`,
		})

		await this.mailService.sendEmail(
			{
				email: input.email,
				subject: `Подтверждения аккаунта`,
				template: 'confirmation.pug',
			},
			{
				url: process.env.REACT_APP_URL,
				token: confirmationToken,
			}
		)

		return true
	}

	async sendVerification(input: JwtAuthVerificationInput) {
		try {
			const user = await this.prisma.profile.findUnique({
				where: {
					email: input.email,
				},
			})

			if (!user)
				throw new BadRequestException('Пользователь с таким E-mail не найден.')

			const verificationToken = await this.jwtService.signAsync(input, {
				expiresIn: `6h`,
			})

			await this.mailService.sendEmail(
				{
					email: input.email,
					subject: `Сбросить пароль`,
					template: 'verification.pug',
				},
				{
					url: process.env.REACT_APP_URL,
					token: verificationToken,
				}
			)

			return true
		} catch (error) {
			if (!IS_PRODUCTION) {
				console.log(error)
			}

			if (error.response.error === 'Bad Request') {
				throw new BadRequestException(error.response.message)
			} else {
				throw new BadRequestException('Произошла ошибка во время верификации.')
			}
		}
	}

	async reset(input: JwtAuthResetInput) {
		const result = await this.jwtService.verifyAsync(input.token)

		if (!result)
			throw new BadRequestException('Токен истек или недействителен.')

		const user = await this.prisma.user.findFirst({
			where: {
				profile: {
					email: result.email,
				},
			},
		})

		await this.prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				profile: {
					update: {
						password: await hash(input.newPassword),
					},
				},
			},
		})

		return true
	}

	async register(token: string) {
		if (!token) throw new NotFoundException('Токен не найден.')

		const input: JwtAuthConfirmationInput = await this.jwtService.verifyAsync(
			token
		)

		if (!input) throw new BadRequestException('Токен истек или недействителен.')

		await this.checkUser(input)

		const newUser = await this.prisma.user.create({
			data: {
				profile: {
					create: {
						email: input.email,
						login: input.login,
						phone: input.phone,
						password: await hash(input.password),
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
	}

	async login(input: JwtAuthLoginInput) {
		const user = await this.prisma.user.findFirst({
			where: {
				profile: {
					login: input.login,
				},
			},
			select: userLoginSelect,
		})

		if (!user) throw new BadRequestException('Пользователь не найден.')

		const isValidPassword = await verify(user.profile.password, input.password)
		if (!isValidPassword)
			throw new BadRequestException('Пользователь не найден.')
		const tokens = await this.authService.issueTokens(user.id)

		return {
			user,
			...tokens,
		}
	}

	async checkUser(input: JwtAuthConfirmationInput) {
		if (input.password !== input.confirmPassword)
			throw new BadRequestException('Пароли не совпадают.')

		const existingUser = await this.prisma.user.findFirst({
			where: {
				OR: [
					{ profile: { email: input.email } },
					{ profile: { login: input.login } },
					{ profile: { phone: input.phone } },
				],
			},
			select: userCheckSelect,
		})

		if (existingUser) {
			if (existingUser.profile.email === input.email) {
				throw new BadRequestException(
					'Пользователь с таким E-mail уже зарегистрирован.'
				)
			} else if (existingUser.profile.login === input.login) {
				throw new BadRequestException(
					'Пользователь с таким логином уже зарегистрирован.'
				)
			} else if (existingUser.profile.phone === input.phone) {
				throw new BadRequestException(
					'Пользователь с таким телефоном уже зарегистрирован.'
				)
			}
		}
	}
}
