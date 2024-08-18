import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { Auth } from '../auth/helpers/decorators/auth.decorator'
import { CurrentUser } from '../user/decorators/user.decorator'
import { UserRole } from '../user/enums/user-role.enum'
import { NestedOrder } from './entities/order.entity'
import { OrderInput } from './inputs/order.input'
import { OrderService } from './order.service'

@Resolver()
export class OrderResolver {
	constructor(private readonly orderService: OrderService) {}

	@Auth(UserRole.PROVIDER)
	@Mutation(() => NestedOrder, { name: 'placeOrder' })
	async buyTariff(
		@CurrentUser('id') userId: number,
		@Args('data') input: OrderInput
	) {
		return this.orderService.buyTariff(userId, input)
	}
}
