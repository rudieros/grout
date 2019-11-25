export interface DatabasePaginatedList<T> {
  items: T[]
  hasMore?: boolean
  pageKey?: string
  total?: number
}
