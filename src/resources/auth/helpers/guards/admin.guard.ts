import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { User } from 'src/resources/user/entities/full/user.entity'
import { UserRole } from 'src/resources/user/enums/user-role.enum'
import { AuthService } from '../../auth.service'

@Injectable()
export class OnlyAdminGuard implements CanActivate {
	constructor(private readonly authService: AuthService) {}

	async canActivate(context: ExecutionContext) {
		const ctx = GqlExecutionContext.create(context)
		const response = ctx.getContext().res
		const user = ctx.getContext().req.user as User

		if (user.role === UserRole.ADMIN) return true

		await this.logout(response)
	}

	private logout = async (response: any) => {
		await this.authService.removeRefreshTokenFromCookies(response)
		await this.authService.removeAccessTokenFromCookies(response)
		throw new UnauthorizedException('Logout')
	}
}
