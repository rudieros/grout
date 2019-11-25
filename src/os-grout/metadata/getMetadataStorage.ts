import { MetadataStorage } from './metadataStorage'

let metadataInstance: MetadataStorage

export const getMetadataStorage = () => {
  return !metadataInstance
    ? (metadataInstance = new MetadataStorage())
    : metadataInstance
}
