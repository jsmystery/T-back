import { Field, InputType } from '@nestjs/graphql'
import { AdvertisingType } from '../enums/advertising-type.enum'

@InputType()
export class AdvertisingQueryInput {
	@Field(() => [AdvertisingType])
	types?: AdvertisingType[]
}
