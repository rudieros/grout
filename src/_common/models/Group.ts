import {
  Field,
  GraphQLISODateTime,
  GraphQLTimestamp,
  ID,
  Int,
  ObjectType,
} from 'type-graphql'
import { User } from './User'
import { Picture } from './Picture'
import { MaxLength } from 'class-validator'
import { Entity } from '../../os-grout/decorators/Entity'
import { EntityID } from '../../os-grout/decorators/EntityID'
import { Attribute } from '../../os-grout/decorators/Attribute'
import { OneToOne } from '../../os-grout/decorators/OneToOne'
import { ManyToOne } from '../../os-grout/decorators/ManyToOne'
import { OneToMany } from '../../os-grout/decorators/OneToMany'

@ObjectType()
@Entity({ tableName: 'GroutTable' })
export class Group {
  @Field(() => ID)
  @EntityID()
  id: string

  @Field()
  @Attribute()
  name: string

  @Field((returns) => Picture, { nullable: true })
  @Attribute({ name: 'picture' })
  coverPicture?: Picture

  @Field()
  @Attribute({ default: '' })
  description: string

  @Field()
  @Attribute()
  googlePlaceGroupId?: string

  @Field((type) => [String])
  @Attribute({ type: [String], default: ['Hello'] })
  tags: string[]

  @Field((type) => [Number])
  @Attribute({ type: [Number], default: [122, 123] })
  numbers?: number[]

  @Field((type) => GraphQLISODateTime)
  @Attribute({ type: Date, default: new Date().toISOString() })
  date?: Date

  @Field((type) => GraphQLTimestamp)
  @Attribute({ type: Number, default: 0 })
  timestamp?: number

  @Field((type) => [Picture])
  @Attribute({ type: [Picture], default: [] })
  pictureList?: Picture[]

  @Field((type) => String)
  creatorId: string

  @Field((type) => Boolean)
  isCreatedByLoggedUser?: boolean

  // @Field((type) => User)
  // @ManyToOne({ type: User, name: 'creatorId', indexed: true })
  // creator?: User
  //
  // @Field((type) => User)
  // @ManyToOne({ type: User, name: 'coCreatorId', indexed: true })
  // coOwner?: User

  // // TODO this relation should be many-to-many
  // @Field((type) => User)
  // @OneToMany({
  //   type: User,
  //   counterField: 'memberCounter',
  //   foreignKey: 'groupThatIsMember',
  // })
  // members: User[]

  @Field()
  @Attribute()
  currentCity?: string

  @Field()
  @MaxLength(2)
  @Attribute()
  country?: string

  @Field((type) => [User])
  participants?: User[]

  @Field((type) => Boolean)
  isLoggedUserParticipant?: boolean

  @Field({ nullable: true })
  followersCounter?: number
}
