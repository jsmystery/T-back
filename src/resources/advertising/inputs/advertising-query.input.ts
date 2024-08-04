import { Field, InputType, Int } from '@nestjs/graphql'
import { Visibility } from 'src/global/enums/query.enum'
import { AdvertisingType } from '../enums/advertising-type.enum'

@InputType()
export class AdvertisingQueryInput {
	@Field(() => [AdvertisingType])
	types?: AdvertisingType[]

	@Field(() => Visibility)
	visibility: Visibility
}
