import { Field, InputType, ObjectType } from 'type-graphql'
import { IsEmail, MaxLength } from 'class-validator'

@InputType()
export class CheckUsernameAvailableInputs {
  @Field()
  @MaxLength(30)
  userName: string

  @Field()
  @IsEmail()
  email: string
}

@ObjectType()
export class CheckUsernameAvailableResult {
  @Field((type) => Boolean)
  userNameAvailable: boolean

  @Field((type) => Boolean)
  emailAvailable: boolean
}
