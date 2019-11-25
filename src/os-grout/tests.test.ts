import './../../scripts/setupTestEnvironmentVariables'
import { GroupEntity } from '../grout-generated/GroupEntity'

const key = {
  id: '1a8sd39-20a12d9-83d312a-312ds2d2',
  sort: 'Group',
}

beforeAll(async () => {
  jest.setTimeout(1000000)
  await GroupEntity.delete(key)
})

test('Hey', async () => {
  const result = await GroupEntity.create({
    ...key,
    name: 'Group Heyyy',
    description: 'dsa',
    tags: ['Ho', 'Hey'],
    picture: {
      original: 'aaaa',
    },
    pictureList: [
      {
        original: 'aaaa',
      },
    ],
  })

  const group = await GroupEntity.get(key)

  console.log('Group', group)
})
