import { registerEnumType } from '@nestjs/graphql'

export enum Visibility{
	VISIBLE = 'VISIBLE',
	HIDDEN = 'HIDDEN',
}

export enum Sort {
	ASC = 'ASC',
	DESC = 'DESC',
}

registerEnumType(Sort, {
	name: 'Sort',
})

registerEnumType(Visibility, {
	name: 'Visibility',
})
