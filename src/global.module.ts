import { Global, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthModule } from 'src/resources/auth/auth.module'
import { AuthService } from 'src/resources/auth/auth.service'
import { JwtStrategy } from 'src/resources/auth/helpers/strategies/jwt.strategy'
import { PaginationService } from 'src/resources/pagination/pagination.service'
import { UserService } from 'src/resources/user/user.service'
import { HookService } from './resources/hook/hook.service'
import { ConfigModule } from '@nestjs/config'

@Global()
@Module({
	providers: [
		AuthService,
		JwtStrategy,
		UserService,
		PrismaService,
		PaginationService,
		HookService,
	],
	imports: [
		ConfigModule.forRoot(),
		JwtModule.register({
			secret: process.env.JWT_SECRET,
		}),
		AuthModule,
	],
	exports: [
		AuthService,
		JwtStrategy,
		UserService,
		PrismaService,
		HookService,
		PaginationService,
		JwtModule,
		AuthModule,
	],
})
export class GlobalModule {}
