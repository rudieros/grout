import {
  ClassDeclaration,
  Project,
  PropertyDeclaration,
  SourceFile,
  StructureKind,
  VariableDeclarationKind,
} from 'ts-morph'
import { findTypeForDBInterface } from '../helpers/findTypeForDbInterface'
import { EntityMetadata } from '../metadata/definitions/EntityMetadata'
import { AttributeMetadata } from '../metadata/definitions/AttributeMetadata'
import { findTypeForDBSchema } from '../helpers/findTypeForDbSchema'
import { parseDefaultSchemaValue } from '../helpers/parseDefaultSchemaValue'
import { ObjectAttributeMetadata } from '../metadata/definitions/ObjectAttributeMetadata'

export class DatabaseEntityGenerator {
  files: SourceFile[] = []
  fileEntityClass: ClassDeclaration

  constructor(
    private classDeclaration: ClassDeclaration,
    private entity: EntityMetadata,
    private existingProject: Project
  ) {
    this.fileEntityClass = classDeclaration
  }

  generate() {
    const entity = this.entity
    const entitySourceFile = this.existingProject.createSourceFile(
      `./src/grout-generated/entities/${entity.name}Entity.ts`,
      undefined,
      { overwrite: true }
    )
    this.addImports(entitySourceFile)
    this.createKeyInterface(entitySourceFile, entity)
    this.createDataInterface(entitySourceFile, entity)
    this.createSchema(entitySourceFile, entity)
    this.addEntityModel(entitySourceFile, entity)

    entitySourceFile.fixMissingImports()
    entitySourceFile.formatText()
    entitySourceFile.saveSync()
  }

  private addImports = (entitySourceFile: SourceFile) => {
    entitySourceFile.addImportDeclaration({
      kind: StructureKind.ImportDeclaration,
      defaultImport: '* as dynamoose',
      moduleSpecifier: '@appsimples/dynamoose',
    })
  }

  private createKeyInterface = (
    entitySourceFile: SourceFile,
    entity: EntityMetadata
  ) => {
    const dbInterface = entitySourceFile.addInterface({
      name: `${entity.name}KeySchema`,
      isExported: true,
    })
    dbInterface.addProperty({
      name: entity.id.name,
      type: findTypeForDBInterface(entity.id.type),
    })
    dbInterface.addProperty({
      // todo make this not mocked
      name: 'sort',
      type: 'string',
    })
  }

  private createDataInterface = (
    entitySourceFile: SourceFile,
    entity: EntityMetadata
  ) => {
    const dbInterface = entitySourceFile.addInterface({
      name: `${entity.name}View`,
      extends: [`${entity.name}KeySchema`],
    })
    dbInterface.addProperty({
      name: entity.id.name,
      type: findTypeForDBInterface(entity.id.type),
    })
    dbInterface.addProperty({
      // todo make this not mocked
      name: 'sort',
      type: 'string',
    })
    entity.attributes.forEach((attr) => {
      if (attr.skipDatabaseDeclaration) {
        return
      }
      const node = attr.isRelationSynthetic ? undefined : this.fileEntityClass
        .getInstanceMembers()
        .find((property) => {
          return (
            (property as PropertyDeclaration).getName() ===
            attr.truePropertyName
          )
        }) as PropertyDeclaration
      dbInterface.addProperty({
        name: attr.name,
        type: findTypeForDBInterface(
          attr.dbType || attr.type,
          undefined,
          attr.name
        ),
        hasQuestionToken: node ? node.hasQuestionToken() : false,
      })
    })
    // entity.oneToManyRelations.forEach((oneToMany) => {
    //   if (oneToMany.counterField) {
    //     dbInterface.addProperty({
    //       name: oneToMany.counterField,
    //       type: 'Number',
    //       default: 0,
    //     })
    //   }
    // })
  }

  private createSchema = (
    entitySourceFile: SourceFile,
    entity: EntityMetadata
  ) => {
    const schemaVariable = entitySourceFile.addVariableStatement({
      kind: StructureKind.VariableStatement,
      declarationKind: VariableDeclarationKind.Const,
      declarations: [
        {
          name: 'schema',
          initializer: `{
          ${entity.id.name}: { type: String, hashKey: true },
          sort: { type: String, rangeKey: true },
          ${this.buildSchemaAttributes(entity.attributes)}}`,
        },
      ],
    })
  }

  private buildSchemaAttributes = (attrs: AttributeMetadata[]) => {
    return attrs.reduce((acc, attr) => {
      if (attr.skipDatabaseDeclaration) {
        return acc
      }
      const node = this.fileEntityClass
        .getInstanceMembers()
        .find((property) => {
          return (
            (property as PropertyDeclaration).getName() ===
            attr.truePropertyName
          )
        }) as PropertyDeclaration
      const hasQuestionToken = node && node.hasQuestionToken()
      return `${acc}${attr.name}: {
            ${this.buildSchemaAttributeType(attr)}
            ${!hasQuestionToken ? 'required: true,\n' : ``}\
            ${
              attr.default !== undefined
                ? `default: ${parseDefaultSchemaValue(attr.default)},\n`
                : ``
            }\
            ${attr.forceDefault ? `forceDefault: true,\n` : ``}\
            ${
              attr.isPartitionKey
                ? `hasKey: true,\nindex: { \nname: '${attr.indexName}',\nrangeKey: '${attr.sortKeyName}',\nglobal: true\n},\n`
                : ``
            }\
            },\n`
    }, '')
  }

  private buildSchemaAttributeType = (attr: AttributeMetadata) => {
    if (attr.dbType && !attr.objectAttribute) {
      return `type: ${findTypeForDBSchema(attr.dbType)},`
    } else if (attr.objectAttribute) {
      if (attr.objectAttribute.constructor === Array) {
        return `type: 'list',\nlist: [{\ntype: 'map',\nmap: {${this.buildSchemaAttributes(
          (attr.objectAttribute as ObjectAttributeMetadata[])[0].attributes
        )}}\n}],`
      } else {
        return `type: 'map',\nmap: {\n${this.buildSchemaAttributes(
          (attr.objectAttribute as ObjectAttributeMetadata).attributes
        )}},`
      }
    }
    return `type: ${findTypeForDBSchema(attr.type)},`
  }

  private addEntityModel = (
    entitySourceFile: SourceFile,
    entity: EntityMetadata
  ) => {
    entitySourceFile.addVariableStatement({
      kind: StructureKind.VariableStatement,
      declarationKind: VariableDeclarationKind.Const,
      isExported: true,
      declarations: [
        {
          name: `${entity.name}Entity`,
          initializer: `dynamoose.model<${`${entity.name}View`}, ${`${entity.name}KeySchema`}>('${`${entity.name}Entity`}', new dynamoose.Schema(schema), { \ntableName: '${
            entity.tableDefinition.name
          }' \n} )`,
        },
      ],
    })
  }
}
