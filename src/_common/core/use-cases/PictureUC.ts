import { Service } from 'typedi'
import { BaseUseCase } from '../../../_common/architecture/BaseUseCase'
import { Picture } from '../../../_common/models/Picture'
import { Config } from '../../../config'

@Service()
export class PictureUC extends BaseUseCase<Picture, Picture | undefined> {
  async execute(input: Picture): Promise<Picture | undefined> {
    const StoragePath = Config.StorageBaseURL
    if (!input || !input.original) {
      return
    }
    return {
      medium: input.medium && `${StoragePath}/${input.medium}`,
      small: input.small && `${StoragePath}/${input.small}`,
      original: input.original && `${StoragePath}/${input.original}`,
    }
  }
}
