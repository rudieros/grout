import { Field, ID, ObjectType } from 'type-graphql'
import { Group } from './Group'
import { MaxLength } from 'class-validator'
import { Picture } from './Picture'
import { UserGender } from './UserGender'
import { Entity } from '../../os-grout/decorators/Entity'
import { EntityID } from '../../os-grout/decorators/EntityID'
import { Attribute } from '../../os-grout/decorators/Attribute'
import { OneToOne } from '../../os-grout/decorators/OneToOne'
import { OneToMany } from '../../os-grout/decorators/OneToMany'
import { ManyToOne } from '../../os-grout/decorators/ManyToOne'

@ObjectType()
@Entity()
export class User {
  @Field(() => ID)
  @EntityID()
  id: string

  @Field()
  @Attribute()
  name: string

  @Field()
  @Attribute({ unique: true })
  userName: string

  @Field()
  @Attribute()
  email: string

  @Field()
  @Attribute()
  dateOfBirth: number

  @Field(type => [String])
  @Attribute({ type: [String] })
  favoriteTags: string[]

  @Field()
  gender: string

  @Field()
  currentCity: string

  @Field()
  @MaxLength(2)
  country: string

  @Field()
  googlePlaceId: string

  @Field((returns) => Picture, { nullable: true })
  profilePicture?: Picture

  @Field({ nullable: true })
  followerUserCounter?: number

  @Field({ nullable: true })
  followingUserCounter?: number

  @Field({ nullable: true })
  followingGroupCounter?: number

  @Field({ nullable: true })
  createdGroupCounter?: number

  @Field({ nullable: true })
  isFollowedByMe?: boolean

  @Field({ nullable: true })
  isMemberOfGroup?: boolean

  @Field({ nullable: true })
  isInvitedToGroup?: boolean

  // @Field(type => [Group])
  // @OneToMany({ type: Group, counterField: 'ownedGroupsCounter', foreignKey: 'creator' })
  // ownedGroups: Group[]
  //
  // @Field((type) => Group)
  // @ManyToOne({ type: Group, name: 'groupThatIsMemberId', indexed: true })
  // groupThatIsMember?: Group
  //
  // @Field()
  // ownedGroupsCounter: number
  //
  // @OneToMany({ type: Group, counterField: 'coOwnedGroupsCounter', foreignKey: 'coOwner' })
  // coOwnedGroups: Group[]

  @Field()
  coOwnedGroupsCounter: number
}
