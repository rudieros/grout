import { Field, InputType, Int } from 'type-graphql'
import { Max } from 'class-validator'

const PAGINATION_LIMIT = 30

@InputType()
export class PaginationArgs {
  @Field({ nullable: true })
  pageKey?: string = null

  @Field((type) => Int)
  @Max(PAGINATION_LIMIT)
  limit?: number = 25
}
