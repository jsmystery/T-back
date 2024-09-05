import { registerEnumType } from '@nestjs/graphql'

export enum Sort {
	ASC = 'ASC',
	DESC = 'DESC',
	RATE = 'RATE',
	CITY = 'CITY',
	BRAND = 'BRAND',
}

registerEnumType(Sort, {
	name: 'Sort',
})
