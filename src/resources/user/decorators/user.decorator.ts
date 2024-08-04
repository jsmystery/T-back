import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { User } from '../entities/full/user.entity'

export const CurrentUser = createParamDecorator(
	(data: keyof User, ctx: ExecutionContext) => {
		let user: User

		if (ctx.getType() === 'http') {
			user = ctx.switchToHttp().getRequest().user
		} else {
			const context = GqlExecutionContext.create(ctx)
			user = context.getContext().req.user
		}

		return data ? user[data] : user
	}
)
