import { UseGuards, applyDecorators } from '@nestjs/common'
import { UserRole } from 'src/resources/user/enums/user-role.enum'
import { OnlyAdminGuard } from '../guards/admin.guard'
import { AuthGuard } from '../guards/auth.guard'
import { OnlyProviderGuard } from '../guards/provider.guard'

export const Auth = (role?: UserRole) =>
	applyDecorators(
		role === UserRole.ADMIN
			? UseGuards(AuthGuard, OnlyAdminGuard)
			: role === UserRole.PROVIDER
			? UseGuards(AuthGuard, OnlyProviderGuard)
			: UseGuards(AuthGuard)
	)
