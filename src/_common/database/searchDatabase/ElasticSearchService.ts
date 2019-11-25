import { Client } from 'elasticsearch'
import { SearchDataSource, QueryInput, QueryOutput } from './SearchDataSource'
import { ApolloError } from 'apollo-server-lambda'
import { ErrorCodes } from '../../../errorCodes'

export abstract class ElasticSearchService<
  ModelInputDS,
  ModelOutputDS,
  IndexSchema
> implements SearchDataSource<ModelInputDS, ModelOutputDS> {
  public es: Client
  public indexName: string
  public idKey: string
  public type: string

  constructor(client: Client, index: string, idKey: string) {
    this.es = client
    this.indexName = index
    this.idKey = idKey
    this.type = '_doc'
  }

  public abstract toES(dsInputModel: Partial<ModelInputDS>): IndexSchema

  public abstract toDS(dbInputModel: IndexSchema): ModelOutputDS

  public toESCollection(dsInputModels: ModelInputDS[]): IndexSchema[] {
    return dsInputModels.map(this.toES)
  }

  public toDSCollection(dbOutputModels: IndexSchema[]): ModelOutputDS[] {
    return dbOutputModels.map(this.toDS)
  }

  public async bulkItems(input: ModelInputDS[]): Promise<void> {
    const elasticInput = this.formatBulkInput(input)
    await this.es.bulk({ body: elasticInput }).catch((err) => {
      throw new ApolloError(ErrorCodes.ELASTIC_ERROR, JSON.stringify(err))
    })
    return
  }

  public async queryItems(input: QueryInput): Promise<QueryOutput> {
    const result = await this.es
      .search({
        index: this.indexName,
        body: {
          size: input.size,
          from: input.from || 0,
          query: input.query,
          sort: input.sort,
          _source: input._source,
        },
      })
      .catch((err) => {
        throw new ApolloError('ElasticsearchError', JSON.stringify(err))
      })
    if (result && result.hits && result.hits.hits) {
      const output = await this.toDSCollection(
        this.hitsToSource(result.hits.hits as any)
      )
      return {
        output,
        total: result.hits.total,
      }
    } else {
      throw new ApolloError(ErrorCodes.ELASTIC_ERROR)
    }
  }

  public async createItem(input: ModelInputDS): Promise<void> {
    const formattedInput = this.formatCreateInput(input)
    await this.es.create(formattedInput).catch((err) => {
      throw new ApolloError(ErrorCodes.ELASTIC_ERROR, JSON.stringify(err))
    })
    return
  }

  public async updateItem(input: ModelInputDS): Promise<void> {
    await this.es.update(this.formatUpdateInput(input)).catch((err) => {
      throw new ApolloError(ErrorCodes.ELASTIC_ERROR, JSON.stringify(err))
    })
    return
  }

  public async putTable(): Promise<void> {
    await this.es.indices.create(
      {
        index: this.indexName,
        type: this.type,
        body: {
          settings: {
            analysis: {
              filter: {
                autocomplete_filter: {
                  type: 'edge_ngram',
                  min_gram: 1,
                  max_gram: 20,
                },
                my_ascii_folding: {
                  type: 'asciifolding',
                  preserve_original: true,
                },
              },
              analyzer: {
                autocomplete: {
                  filter: [
                    'lowercase',
                    'autocomplete_filter',
                    'my_ascii_folding',
                  ],
                  type: 'custom',
                  tokenizer: 'standard',
                },
              },
              normalizer: {
                keyword_text: {
                  filter: ['lowercase', 'my_ascii_folding'],
                  type: 'custom',
                },
              },
            },
          },
          mappings: {
            _doc: {
              properties: {
                tags: {
                  type: 'keyword',
                  normalizer: 'keyword_text',
                },
                id: {
                  type: 'keyword',
                },
                name: {
                  type: 'text',
                  analyzer: 'autocomplete',
                  search_analyzer: 'standard',
                  fields: {
                    term: {
                      type: 'keyword',
                      normalizer: 'keyword_text',
                    },
                  },
                },
              },
            },
          },
        },
      },
      (err, resp) => {
        if (err) {
          console.log('failed to create ElasticSearch index, ')
        } else {
          console.log('successfully created ElasticSearch index')
        }
      }
    )
    return
  }

  private hitsToSource(input: any[]): any[] {
    return input.map((item: any) => {
      const source = { ...item._source }
      source[this.idKey] = item._id
      source._score = item._score
      return source
    })
  }

  private formatBulkInput(input: ModelInputDS[]): any[] {
    const newArray: any[] = []
    input.forEach((item: any) => {
      newArray.push({
        index: {
          _index: this.indexName,
          _type: this.type,
          _id: `${item[this.idKey]}`,
        },
      })
      delete item[this.idKey]
      newArray.push({
        ...item,
      })
    })
    return newArray
  }

  private formatCreateInput(input: any): any {
    const id = input[this.idKey]
    delete input[this.idKey]
    return {
      index: this.indexName,
      type: this.type,
      id,
      body: input,
    }
  }

  private formatUpdateInput(input: any): any {
    const id = input[this.idKey]
    delete input[this.idKey]
    return {
      index: this.indexName,
      type: this.type,
      id,
      body: {
        doc: input,
        doc_as_upsert: true,
      },
    }
  }
}
