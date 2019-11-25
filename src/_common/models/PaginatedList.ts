import { ClassType, Field, ObjectType } from 'type-graphql'

export const PaginatedList = <TItem>(TItemClass: ClassType<TItem>) => {
  @ObjectType(`Paginated${TItemClass.name}List`)
  class PaginatedListClass {
    @Field((type) => [TItemClass])
    items: TItem[]

    @Field({ nullable: true })
    pageKey?: string

    @Field({ nullable: true })
    hasMore?: boolean
  }
  return PaginatedListClass
}
