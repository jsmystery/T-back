import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class YookassaPayment {
	@Field(() => String)
	paymentUrl: string
}
