import { EntityMetadata } from '../metadata/definitions/EntityMetadata'

export const getAvailableIndex = (entityMetadata: EntityMetadata) => {
  if (
    (entityMetadata.indexUse || []).length ===
    entityMetadata.tableDefinition.indexes.length
  ) {
    throw new Error(`Not enough indexes!`)
  }
  const index = entityMetadata.tableDefinition.indexes.find(
    (indexCandidate) => {
      if (
        (entityMetadata.indexUse || []).find(
          (usedIndex) => usedIndex.name === indexCandidate.name
        )
      ) {
        return false
      }
      return true
    }
  )
  if (!index) {
    throw new Error(`Not enough indexes!`)
  }
  return index
}
