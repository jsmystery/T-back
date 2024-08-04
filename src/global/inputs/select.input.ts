import { Field, InputType, Int } from '@nestjs/graphql'
import { AdvertisingType } from 'src/resources/advertising/enums/advertising-type.enum'

@InputType()
export class SelectInput {
	@Field(() => Int)
	value: number

	@Field(() => String)
	name: string
}

@InputType()
export class CreatableSelectInput {
	@Field(() => String)
	value: string

	@Field(() => String)
	name: string
}

@InputType()
export class AdvertisingTypeSelectInput {
	@Field(() => AdvertisingType)
	value: AdvertisingType

	@Field(() => String)
	name: string
}
