export interface SearchDataSource<ModelInputDS, ModelOutputDS> {
  bulkItems(input: ModelInputDS[]): Promise<void>
  queryItems(input: QueryInput): Promise<QueryOutput>
  createItem(input: ModelInputDS): Promise<void>
  updateItem(input: ModelInputDS): Promise<void>
}

export interface QueryInput {
  size: number
  from?: number
  query: any
  sort?: any
  _source?: string[] | boolean
}

export interface QueryOutput {
  output: any[]
  total?: number
}
