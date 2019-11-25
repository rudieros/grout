import 'reflect-metadata'
import { RootGenerator } from './generators/rootGenerator'

const sync = () => {
  const generator = new RootGenerator({
    modelsPaths: ['src/_common/models/Group.ts', 'src/_common/models/User.ts'],
  })
  generator.generate()
}

sync()
