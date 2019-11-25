import { dedupeDynamoKeys } from '../dedupeDynamoKeys'

describe('dedupe dynamo keys', () => {
  it('dedupes keys correctly', () => {
    const input = [
      { id: '1', name: 'John' },
      { id: '1', name: 'John' },
      { id: '2', name: 'John' },
      { id: '1', name: 'John' },
    ]
    expect(dedupeDynamoKeys(input)).toHaveLength(2)
  })
})
