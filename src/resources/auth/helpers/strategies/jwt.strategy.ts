import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PrismaService } from 'src/prisma/prisma.service'
import { User } from 'src/resources/user/entities/full/user.entity'
import { userFullSelect } from 'src/resources/user/selects/user.select'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly prisma: PrismaService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: true,
			secretOrKey: process.env.JWT_SECRET,
		})
	}

	async validate({ id }: Pick<User, 'id'>) {
		return this.prisma.user.findUnique({
			where: {
				id,
			},
			select: userFullSelect
		})
	}
}
