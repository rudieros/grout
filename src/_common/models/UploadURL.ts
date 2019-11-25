import {
  Arg,
  Authorized,
  Field,
  InputType,
  ObjectType,
  Query,
  registerEnumType,
  Resolver,
} from 'type-graphql'
import { Inject, Service } from 'typedi'
import { OSContext } from '../../context'
import { UserRoles } from '../authorization/UserRoles'
import { UploadUrlUC } from '../core/use-cases/UploadUrlUC'

@ObjectType()
export class UploadURL {
  @Field()
  url: string

  @Field()
  key: string

  @Field()
  bucket: string

  @Field()
  xAmzAlgorithm: string

  @Field()
  xAmzCredential: string

  @Field()
  xAmzDate: string

  @Field()
  policy: string

  @Field()
  xAmzSignature: string

  @Field()
  xAmzSecurityToken: string
}

@InputType()
export class GetUploadUrlInput {
  @Field(() => UploadURLType)
  type: UploadURLType
}

@Resolver(UploadURL)
@Service()
export class UploadURLResolver {
  @Inject(OSContext)
  context: OSContext

  @Authorized(UserRoles.user)
  @Query((returns) => UploadURL)
  async getUploadUrl(@Arg('input') input: GetUploadUrlInput) {
    const useCase = this.context.container.get(UploadUrlUC)
    return useCase.execute(input)
  }
}

export enum UploadURLType {
  ProfilePicture = 'profilePicture',
  GroupCover = 'groupCover',
  PostImage = 'postImage',
  PostVideo = 'postVideo',
}

registerEnumType(UploadURLType, {
  name: 'UploadURLType',
  description: 'Types of files you can upload',
})
