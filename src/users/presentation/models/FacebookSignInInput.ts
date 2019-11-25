import { Field, InputType } from 'type-graphql'
import { UserGender } from '../../../_common/models/UserGender'
import { IsEmail, Length, Max } from 'class-validator'

@InputType()
export class FacebookSignUpInput {
  @Field()
  name: string

  @Field()
  userName: string

  @Field()
  @IsEmail()
  email: string

  @Field()
  @Max(Date.now())
  dateOfBirth: number

  @Field(() => UserGender)
  gender: UserGender

  @Field()
  currentCity: string

  @Field()
  @Length(2, 2)
  country: string

  @Field()
  googlePlaceId: string
}

@InputType()
export class FacebookSignInInput {
  @Field()
  facebookToken: string

  @Field({ nullable: true })
  signUp?: FacebookSignUpInput
}
