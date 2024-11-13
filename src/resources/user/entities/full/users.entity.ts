import { Field, ObjectType, Int } from '@nestjs/graphql'
import { UserRole } from '../../enums/user-role.enum'

@ObjectType()
export class UserList {
  @Field(() => Int)
  id: number

  @Field(() => String, { nullable: true })
  login: string

  @Field(() => String, { nullable: true })
  email?: string

  @Field(() => String, { nullable: true })
  phone?: string

  @Field(() => String, { nullable: true })
  whatsapp?: string

  @Field(() => String, { nullable: true })
  telegram?: string

  @Field(() => UserRole)
  role: UserRole

  @Field(() => Date)
  createdAt: Date
}

// import { Field, ObjectType, Int } from '@nestjs/graphql'
// import { UserRole } from '../../enums/user-role.enum'
// import { Profile } from '../full/profile.entity'


// @ObjectType()
// export class UserList {
//   @Field(() => Int)
//   id: number

//   @Field(() => UserRole)
//   role: UserRole

//   @Field(() => Date)
//   createdAt: Date

// //   @Field(() => Profile)
// //   profile?: Profile;  
// }


