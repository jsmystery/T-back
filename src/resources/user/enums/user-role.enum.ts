import { registerEnumType } from '@nestjs/graphql'

export enum UserRole {
	ADMIN = 'ADMIN',
	PROVIDER = 'PROVIDER',
}

registerEnumType(UserRole, {
	name: 'UserRole',
})
