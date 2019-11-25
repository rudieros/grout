import { Field, InputType } from 'type-graphql'
import { IsEmail, Length, Matches, Max, MinLength } from 'class-validator'
import { UserGender } from '../../../_common/models/UserGender'

@InputType()
export class SignUpInput {
  @Field()
  name: string

  @Field()
  userName: string

  @Field()
  @IsEmail()
  email: string

  @Field({ nullable: true })
  profilePicturePath?: string

  @Field()
  password: string

  @Field()
  @Max(Date.now())
  dateOfBirth: number

  @Field(() => UserGender)
  gender: UserGender

  @Field()
  lat: number

  @Field()
  lon: number

  @Field()
  locationNickname: string
}
