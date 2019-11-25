import { Field, InputType } from 'type-graphql'

@InputType()
export class SignInInput {
  @Field()
  authId: string

  @Field()
  password: string
}
