import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { Auth } from '../auth/helpers/decorators/auth.decorator'
import { CurrentUser } from '../user/decorators/user.decorator'
import { UserRole } from '../user/enums/user-role.enum'
import { YookassaPayment } from './entities/yookassa.entity'
import { YookassaInput } from './inputs/yookassa.input'
import { YookassaService } from './yookassa.service'

@Resolver()
export class YookassaResolver {
	constructor(private readonly yookassaService: YookassaService) {}

	@Auth(UserRole.PROVIDER)
	@Mutation(() => YookassaPayment, { name: 'balanceTopUp' })
	async balanceTopUp(
		@CurrentUser('id') userId: number,
		@Args('data') input: YookassaInput
	) {
		return this.yookassaService.balanceTopUp(userId, input)
	}
}
