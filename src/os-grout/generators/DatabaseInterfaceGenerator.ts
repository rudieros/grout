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
import { generateId } from '../../_common/utils/generateId'

export class DatabaseInterfaceGenerator {
  files: SourceFile[] = []
  fileEntityClass: ClassDeclaration
  dbClass: ClassDeclaration
  sourceFile: SourceFile
  entityVariableName: string

  constructor(
    private classDeclaration: ClassDeclaration,
    private entity: EntityMetadata,
    private existingProject: Project
  ) {
    this.fileEntityClass = classDeclaration
    this.entityVariableName = `${this.entity.name}Entity`
  }

  generate() {
    if (this.entity.isRelationSynthetic) {
      return
    }
    const entity = this.entity
    this.sourceFile = this.existingProject.createSourceFile(
      `./src/grout-generated/${entity.name}Database.ts`,
      undefined,
      { overwrite: true }
    )
    this.addImports()
    this.createDatabaseClass()
    this.createCreator()
    // this.createDataInterface(entitySourceFile, entity)
    // this.createSchema(entitySourceFile, entity)
    // this.addEntityModel(entitySourceFile, entity)

    this.sourceFile.fixMissingImports()
    this.sourceFile.formatText()
    this.sourceFile.saveSync()
  }

  private addImports = () => {
    this.sourceFile.addImportDeclaration({
      kind: StructureKind.ImportDeclaration,
      namedImports: [this.entityVariableName],
      moduleSpecifier: `./entities/${this.entityVariableName}`,
    })
    this.sourceFile.addImportDeclaration({
      kind: StructureKind.ImportDeclaration,
      defaultImport: '* as dynamoose',
      moduleSpecifier: '@appsimples/dynamoose',
    })
  }

  private createDatabaseClass = () => {
    this.dbClass = this.sourceFile.addClass({
      name: `${this.entity.name}Database`,
      isExported: true,
    })
  }

  private createCreator = () => {
    const createInterfaceName = `Create${this.entity.name}Input`
    const createInterface = this.sourceFile.addInterface({
      name: createInterfaceName,
    })
    let createObjectString = ''
    this.entity.attributes.forEach((attr) => {
      if (attr.isSortKey || attr.isPartitionKey) {
        return
      }
      const node = attr.isRelationSynthetic
        ? undefined
        : (this.fileEntityClass.getInstanceMembers().find((property) => {
            return (
              (property as PropertyDeclaration).getName() ===
              attr.truePropertyName
            )
          }) as PropertyDeclaration)
      let hasQuestionToken = (node && node.hasQuestionToken()) || false
      if (attr.isRelationCounter || attr.isOneToMany) {
        hasQuestionToken = true
      }
      createInterface.addProperty({
        name: attr.name,
        type: findTypeForDBInterface(
          attr.dbType || attr.type,
          undefined,
          attr.name
        ),
        hasQuestionToken,
      })
      if (attr.isOneToMany) {
      } else {
        createObjectString = `${createObjectString}${attr.name}: input.${attr.name},\n`
      }
    })
    const createMethod = this.dbClass.addMethod({
      name: 'create',
      parameters: [
        {
          type: createInterfaceName,
          name: 'input',
        },
      ],
      isAsync: true,
      statements: 'const transactions = []',
    })
    createMethod.addStatements([
      `const createTransaction = ${this.entityVariableName}.transaction.create({
        id: generateId(),
        sort: '${this.entity.name}',
        ${createObjectString}
      })`,
      `transactions.push(createTransaction)`,
    ])
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
      const node = this.fileEntityClass
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
        hasQuestionToken: node.hasQuestionToken(),
      })
    })
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
              attr.default
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
