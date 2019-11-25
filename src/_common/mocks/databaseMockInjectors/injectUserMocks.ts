import { UserDB, UserEntity } from '../../database/entities/userEntity'
import { AuthEntity } from '../../database/entities/AuthEntity'
import { CredentialProvider } from '@appsimples/os-heimdall/build/src'
import { UserRoles } from '../../authorization/UserRoles'
import { AuthDynamoDataBase } from '../../../users/data/AuthDynamoDataBase'
import { UserDynamoDataBase } from '../../../users/data/UserDynamoDataBase'
import { UserGender } from '../../models/UserGender'

export const MOCK_USERS_ME: any = {
  id: 'ned',
  sort: UserDynamoDataBase.getSortPlaceholder(),
  email: 'ned@starks.com',
  name: 'Ned Stark',
  userName: 'nedstark',
  dateOfBirth: new Date(),
  gender: UserGender.male,
}

export const MOCK_USERS_SECONDARY: any = {
  id: 'jonsnow',
  sort: UserDynamoDataBase.getSortPlaceholder(),
  email: 'jon@snow.com',
  name: 'Jon Snow',
  userName: 'jon_snow',
  dateOfBirth: 123123,
  gender: UserGender.male,
  currentCity: 'the_wall',
  country: 'westeros',
  googlePlaceId: 'odldncndckn',
}

export const MOCK_USERS = {
  me: MOCK_USERS_ME,
  jonSnow: MOCK_USERS_SECONDARY as UserDB,
  arya: {
    id: 'arya',
    sort: UserDynamoDataBase.getSortPlaceholder(),
    email: 'arya@starks.com',
    name: 'Arya Stark',
    userName: 'arya',
    dateOfBirth: 123123,
    gender: 'feminino',
    currentCity: 'sp',
    country: 'brazil',
    googlePlaceId: 'odldncndckn',
  } as any,
  tywin: {
    id: 'tywin',
    sort: UserDynamoDataBase.getSortPlaceholder(),
    email: 'tywin@lannister.com',
    name: 'Tywin Lannister',
    userName: 'tywin',
    dateOfBirth: 123123,
    gender: 'feminino',
    currentCity: 'sp',
    country: 'brazil',
    googlePlaceId: 'odldncndckn',
  },
  jamie: {
    id: 'jamie',
    sort: UserDynamoDataBase.getSortPlaceholder(),
    email: 'jamie@lannister.com',
    name: 'Jamie Lannister',
    userName: 'jamie',
    dateOfBirth: 123123222,
    gender: 'feminino',
    currentCity: 'sp',
    country: 'brazil',
    googlePlaceId: 'odldncndckn',
  },
  rooseBolton: {
    id: 'roose',
    sort: UserDynamoDataBase.getSortPlaceholder(),
    email: 'roose@bolton.com',
    name: 'Roose Bolton',
    userName: 'roose',
    dateOfBirth: 3213123,
    gender: 'feminino',
    currentCity: 'sp',
    country: 'brazil',
    googlePlaceId: 'odldncndckn',
  },
}

export const MOCK_AUTH = Object.values(MOCK_USERS).map(
  (user) =>
    ({
      id: user.email,
      sort: AuthDynamoDataBase.getSortPlaceHolder(),
      authId: user.email,
      userId: user.id,
      encryptedPassword: 'U2FsdGVkX1+/6nfemfeqBEpOprhzSPkx5ogJiXWoShQ=', // hash for 123456
      provider: CredentialProvider.internal,
      userRole: UserRoles.user,
      queryPartition1: AuthDynamoDataBase.getPartition1PlaceHolder(),
      querySort1: user.userName,
    } as any)
)

export const injectUserMocks = async () => {
  await Promise.all([
    UserEntity.batchPut(Object.values(MOCK_USERS)).catch((e) => {
      console.log('Error injecting users mocks:', e)
    }),
    AuthEntity.batchPut(MOCK_AUTH).catch((e) => {
      console.log('Error injecting auth mocks:', e)
    }),
  ])
}
