import { Field, ObjectType } from 'type-graphql'
import '../../../_common/models/FacebookAuthStatus'
import { FacebookAuthStatus } from '@appsimples/os-heimdall/build/src'

@ObjectType()
export class FacebookUserResponse {
  @Field()
  name: string

  @Field({ nullable: true })
  email?: string

  @Field({ nullable: true })
  profilePicture?: string

  @Field({ nullable: true })
  emailAvailable?: boolean
}

@ObjectType()
export class FacebookSignInResponse {
  @Field()
  message: string

  @Field((returns) => FacebookAuthStatus)
  status: FacebookAuthStatus

  @Field({ nullable: true })
  facebookUser?: FacebookUserResponse
}
