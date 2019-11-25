import { Field, ID, ObjectType } from 'type-graphql'

@ObjectType()
export class Tag {
  @Field(() => ID)
  id: string

  @Field()
  en: string

  @Field()
  pt: string
}
