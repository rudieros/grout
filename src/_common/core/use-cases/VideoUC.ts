import { Service } from 'typedi'
import { BaseUseCase } from '../../../_common/architecture/BaseUseCase'
import { Config } from '../../../config'

@Service()
export class VideoUC extends BaseUseCase<string, string | undefined> {
  async execute(input?: string): Promise<string> {
    if (!input) {
      return
    }
    const StoragePath = Config.StorageBaseURL
    return `${StoragePath}/${input}`
  }
}
