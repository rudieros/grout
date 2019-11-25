import { ClassDeclaration, Project, SourceFile } from 'ts-morph'
import { getMetadataStorage } from '../metadata/getMetadataStorage'
import { MetadataStorage } from '../metadata/metadataStorage'
import { DatabaseEntityGenerator } from './DatabaseEntityGenerator'
import { DatabaseInterfaceGenerator } from './DatabaseInterfaceGenerator'

const path = require('path')

export class RootGenerator {
  existingProject: Project = new Project()
  files: SourceFile[] = []
  private metadata: MetadataStorage

  constructor(
    private config: {
      modelsPaths: string[]
    }
  ) {
    // collect all annotation metadata
    this.config.modelsPaths.forEach((modelPath) =>
      require(path.join(process.cwd(), modelPath))
    )
    this.metadata = getMetadataStorage().build()
    this.config.modelsPaths.forEach((modelPath) =>
      this.files.push(
        this.existingProject.addExistingSourceFile(
          path.join(process.cwd(), modelPath)
        )
      )
    )
  }

  generate() {
    this.metadata.entities.forEach((entity) => {
      let entityClass: ClassDeclaration
      const f = this.files
      const entityFile = f.find((file) => {
        let error = false
        try {
          entityClass = file.getClassOrThrow(entity.className)
        } catch (e) {
          error = true
        }
        return !error
      })
      if (!entityFile) {
        // throw new Error(`Could not find entity class ${entity.className}`)
      }
      const generator = new DatabaseEntityGenerator(
        entityClass,
        entity,
        this.existingProject
      )
      generator.generate()

      const dbInterfaceGenerator = new DatabaseInterfaceGenerator(
        entityClass,
        entity,
        this.existingProject
      )
      dbInterfaceGenerator.generate()
    })
  }
}
