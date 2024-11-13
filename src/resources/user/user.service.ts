import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { userFullSelect } from './selects/user.select'
import { UpdateUserInput } from './inputs/update-user.input'
import { hash, verify } from 'argon2'  

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
		console.log(input);
		
		const { email, password, whatsapp, telegram, phone, newPassword } = input // Destructure input fields

		// Fetch the current user along with their password
		const user = await this.prisma.user.findUnique({
			where: { id },
			select: {
				profile: {
					select: {
						password: true,  // Fetch the user's current hashed password
					},
				},
			},
		})

		if (!user) throw new NotFoundException('Пользователь не найден.')

		//If newPassword is provided, validate the current password first
		if (newPassword) {
			// Check if the provided `password` matches the stored password
			const isPasswordValid = await verify(user.profile.password, password)
			
			if (!isPasswordValid) {
				throw new BadRequestException('Неверный текущий пароль.')
			}

			// Hash the new password
			input.password = await hash(newPassword)  // Hash and update the input password field
		}

		// Update the user profile
		await this.prisma.profile.update({
			where: { userId: id },
			data: {
				email,
				password: input.password || user.profile.password,  // Use the updated (hashed) password or the old one if unchanged
				whatsapp,
				telegram,
				phone,
			},
		})

		return true // Return success status
	}

	async getAllUsers() {
		const users = await this.prisma.user.findMany({
		  select: {
			 id: true,
			 createdAt: true,
			 role: true,
			 profile: {
				select: {
				  login: true,
				  email: true,
				  whatsapp: true,
				  telegram: true,
				  phone: true,
				},
			 },
		  },
		});
	 
		// Flatten profile fields into the main object
		return users.map(user => ({
		  id: user.id,
		  createdAt: user.createdAt,
		  role: user.role,
		  login: user.profile?.login,
		  email: user.profile?.email,
		  whatsapp: user.profile?.whatsapp,
		  telegram: user.profile?.telegram,
		  phone: user.profile?.phone,
		}));
	 }
	 
}
