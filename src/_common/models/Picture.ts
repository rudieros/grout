import { Field, ObjectType } from 'type-graphql'
import { ObjectAttribute } from '../../os-grout/decorators/ObjectAttribute'
import { Attribute } from '../../os-grout/decorators/Attribute'

@ObjectType()
@ObjectAttribute()
export class Picture {
  @Field({ nullable: true, deprecationReason: '' })
  smallSize?: string

  @Field({ nullable: true, deprecationReason: '' })
  mediumSize?: string

  @Field({ nullable: true, deprecationReason: '' })
  largeSize?: string

  @Field({ nullable: true })
  small?: string

  @Field({ nullable: true })
  @Attribute()
  medium?: string

  @Field({ nullable: true })
  @Attribute()
  large?: string

  @Field()
  @Attribute()
  original: string
}
