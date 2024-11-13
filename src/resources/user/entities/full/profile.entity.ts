import { Field, ObjectType, Int } from '@nestjs/graphql'

@ObjectType()
export class Profile {
	@Field(() => String, { nullable: true })
	login?: string;
	
	@Field(() => String, { nullable: true })
	email?: string
 
	@Field(() => String, { nullable: true })
	phone?: string
 
	@Field(() => String, { nullable: true })
	whatsapp?: string
 
	@Field(() => String, { nullable: true })
	telegram?: string
}

