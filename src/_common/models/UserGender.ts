import { registerEnumType } from 'type-graphql'

export enum UserGender {
  female = 'female',
  male = 'male',
}

registerEnumType(UserGender, {
  name: 'UserGender',
  description: 'Gender of users',
})
