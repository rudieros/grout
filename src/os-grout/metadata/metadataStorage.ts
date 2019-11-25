import { EntityMetadata } from './definitions/EntityMetadata'
import { EntityIDMetadata } from './definitions/EntityIDMetadata'
import { AttributeMetadata } from './definitions/AttributeMetadata'
import { ObjectAttributeMetadata } from './definitions/ObjectAttributeMetadata'
import { OneToOneMetadata } from './definitions/OneToOneMetadata'
import { getAvailableIndex } from '../helpers/getAvailableIndex'
import { OneToManyMetadata } from './definitions/OneToManyMetadata'
import { ManyToOneMetadata } from './definitions/ManyToOneMetadata'

export class MetadataStorage {
  entities: EntityMetadata[] = []
  entitiyIDs: EntityIDMetadata[] = []
  attributes: AttributeMetadata[] = []
  objectAttributes: ObjectAttributeMetadata[] = []
  oneToOneRelations: OneToOneMetadata[] = []
  oneToManyRelations: OneToManyMetadata[] = []
  manyToOneRelations: ManyToOneMetadata[] = []

  /**
   * Metadata collectors
   */
  collectEntityMetadata(definition: EntityMetadata) {
    this.entities.push(definition)
  }
  collectEntityIDMetadata(definition: EntityIDMetadata) {
    this.entitiyIDs.push(definition)
  }
  collectAttributeMetadata(definition: AttributeMetadata) {
    this.attributes.push(definition)
  }
  collectObjectAttributeMetadata(definition: ObjectAttributeMetadata) {
    this.objectAttributes.push(definition)
  }
  collectOneToOneMetadata(definition: OneToOneMetadata) {
    this.oneToOneRelations.push(definition)
  }
  collectOneToManyMetadata(definition: OneToManyMetadata) {
    this.oneToManyRelations.push(definition)
  }
  collectManyToOneMetadata(definition: ManyToOneMetadata) {
    this.manyToOneRelations.push(definition)
  }

  /**
   * Builder
   */
  build() {
    this.buildManyToOneMetadata()
    this.buildOneToOneMetadata()
    this.buildObjectAttributeMetadata()
    this.buildAttributeMetadata()
    this.buildEntityIDMetadata()
    this.buildEntityMetadata()
    return this
  }

  private buildManyToOneMetadata() {
    this.manyToOneRelations.forEach((manyToOneRelation) => {
      const ownerEntity = this.entities.find(
        (entity) => entity.target === manyToOneRelation.entityTarget
      )
      ownerEntity.manyToOneRelations = [
        ...(ownerEntity.manyToOneRelations || []),
        manyToOneRelation,
      ]

      const ownedEntity = this.entities.find(
        (entity) => entity.target === manyToOneRelation.type
      )
      if (!ownedEntity) {
        throw new Error(
          `Owned entity not found: ${ownerEntity.name}:${manyToOneRelation.truePropertyName}`
        )
      }
      const correspondingOneToMany = this.oneToManyRelations.find(
        (oneToMany) => {
          return (
            oneToMany.target.constructor === ownedEntity.target &&
            oneToMany.foreignKey === manyToOneRelation.truePropertyName
          )
        }
      )
      if (!correspondingOneToMany) {
        throw new Error(
          `One-to-many relation not found for Many-to-one relation declared in ${ownerEntity.name}:${manyToOneRelation.truePropertyName}`
        )
      }
      ownedEntity.oneToManyRelations = [
        ...(ownedEntity.oneToManyRelations || []),
        correspondingOneToMany,
      ]
      const relationName = `${manyToOneRelation.entityTarget.name}${ownedEntity.name}Relation`
      const target = () => undefined
      const idMetadata = {
        name: 'id',
        type: String,
        entityTarget: target,
        uuid: false,
      }
      this.collectEntityIDMetadata(idMetadata)
      const relationEntity: EntityMetadata = {
        name: relationName,
        className: relationName,
        target,
        tableDefinition: ownerEntity.tableDefinition,
        id: idMetadata,
        isRelationSynthetic: true,
        indexUse: [],
        attributes: [
          {
            unique: false,
            sortKeyName: 'sort',
            isSortKey: true,
            name: 'sort',
            truePropertyName: 'sort',
            type: String,
            entityTarget: target,
          },
        ],
      }
      this.collectEntityMetadata(relationEntity)
      if (manyToOneRelation.indexed) {
        const availableIndex = getAvailableIndex(ownerEntity)
        ownerEntity.indexUse.push({ name: availableIndex.name })
        this.attributes.push({
          entityTarget: ownerEntity.target,
          name: availableIndex.partition.name,
          truePropertyName: manyToOneRelation.truePropertyName,
          type: availableIndex.partition.type,
          isPartitionKey: true,
          partitionKeyName: availableIndex.partition.name,
          indexName: availableIndex.name,
          sortKeyName: availableIndex.sort.name,
          isRelationSynthetic: true,
          relationEntity,
        })
        this.attributes.push({
          entityTarget: ownerEntity.target,
          name: availableIndex.sort.name,
          truePropertyName: manyToOneRelation.truePropertyName,
          type: availableIndex.sort.type,
          isSortKey: true,
          sortKeyName: availableIndex.sort.name,
          default: manyToOneRelation.name,
          forceDefault: true,
          isRelationSynthetic: true,
          relationEntity,
        })
      } else {
        this.attributes.push({
          entityTarget: ownerEntity.target,
          type: String,
          truePropertyName: manyToOneRelation.truePropertyName,
          name: manyToOneRelation.name,
          isRelationSynthetic: true,
          relationEntity,
        })
      }
      if (correspondingOneToMany.counterField) {
        this.attributes.push({
          entityTarget: ownedEntity.target,
          type: Number,
          truePropertyName: correspondingOneToMany.truePropertyName,
          default: 0,
          isRelationSynthetic: true,
          name: correspondingOneToMany.counterField,
          isRelationCounter: true,
          relationEntity,
        })
      }
      this.attributes.push({
        entityTarget: ownedEntity.target,
        type: Array,
        dbType: [String],
        truePropertyName: correspondingOneToMany.truePropertyName,
        default: 0,
        isRelationSynthetic: true,
        skipDatabaseDeclaration: true,
        name: correspondingOneToMany.truePropertyName,
        isOneToMany: true,
        relationEntity,
      })
    })
  }

  private buildOneToOneMetadata() {
    this.oneToOneRelations.forEach((oneToOne) => {
      const entity = this.entities.find((ent) => {
        return ent.target === oneToOne.entityTarget
      })
      if (!entity) {
        console.warn(
          `Failed to parse the one-to-one relation ${oneToOne.name}. Could not find the entity associated`
        )
        return
      }
      if (oneToOne.indexed) {
        const availableIndex = getAvailableIndex(entity)
        entity.indexUse.push({ name: availableIndex.name })
        this.attributes.push({
          entityTarget: entity.target,
          name: availableIndex.partition.name,
          truePropertyName: oneToOne.truePropertyName,
          type: availableIndex.partition.type,
          isPartitionKey: true,
          partitionKeyName: availableIndex.partition.name,
          indexName: availableIndex.name,
          sortKeyName: availableIndex.sort.name,
        })
        this.attributes.push({
          entityTarget: entity.target,
          name: availableIndex.sort.name,
          truePropertyName: oneToOne.truePropertyName,
          type: availableIndex.sort.type,
          isSortKey: true,
          sortKeyName: availableIndex.sort.name,
          // default: oneToOne.name,
          forceDefault: true,
        })
      } else {
        this.attributes.push({
          entityTarget: entity.target,
          name: oneToOne.name,
          truePropertyName: oneToOne.truePropertyName,
          type: String,
        })
      }
    })
  }

  private buildEntityMetadata() {
    this.entities.forEach((entity) => {
      const id = this.entitiyIDs.find((id) => id.entityTarget === entity.target)
      if (!id) {
        throw new Error(
          `Entity '${entity.name}' has no ID associated. Use the decorator @EntityID() to assign an id property.`
        )
      }
      entity.id = id
      entity.attributes = this.attributes.filter((attr) => {
        return attr.entityTarget === entity.target
      })
    })
  }
  private buildEntityIDMetadata() {
    // this.entities.push(definition)
  }
  private buildObjectAttributeMetadata() {
    this.objectAttributes.forEach((objectAttribute) => {
      objectAttribute.attributes = this.attributes.filter((attr) => {
        const doestAttributeBelongToObject =
          attr.entityTarget === objectAttribute.target
        // if (doestAttributeBelongToObject) {
        //   attr.objectAttributeTarget = objectAttribute.target
        // }
        return doestAttributeBelongToObject
      })
    })
  }

  private buildAttributeMetadata() {
    this.attributes.forEach((attr) => {
      this.objectAttributes.forEach((objAttr) => {
        if (attr.type === objAttr.target) {
          attr.objectAttribute = objAttr
        }
        if (
          attr.dbType &&
          attr.dbType.constructor === Array &&
          attr.dbType[0] &&
          attr.dbType[0] === objAttr.target
        ) {
          attr.objectAttribute = [objAttr]
        }
      })
    })
  }
}
