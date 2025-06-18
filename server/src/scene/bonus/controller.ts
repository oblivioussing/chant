import { Controller, Get } from '@nestjs/common'
import { QueryModel } from '@/components'
import { bonusEntity, type BonusEntity } from './model'
import { BonusService } from './service'

@Controller('bonus')
export class BonusController {
  constructor(private readonly bonusService: BonusService) {}

  // 列表
  @Get('list')
  async list(@QueryModel(bonusEntity) bonus: BonusEntity) {
    const result = await this.bonusService.list(bonus)
    return result
  }
}
