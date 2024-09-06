import { registerEnumType } from '@nestjs/graphql'

export enum Sort {
	ASC = 'ASC',
	DESC = 'DESC',
	RATE = 'RATE',
}

registerEnumType(Sort, {
	name: 'Sort',
})
