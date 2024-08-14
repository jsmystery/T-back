import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Id {
	@Field(() => Int)
	id: number
}

@ObjectType()
export class FileUpload {
  @Field(() => String)
  filename: string;

  @Field(() => String)
  mimetype: string;

  @Field(() => String)
  encoding: string;
}