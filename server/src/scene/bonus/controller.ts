import { Controller, Get } from '@nestjs/common'
import { QueryModel } from '@/decorator'
import { bonusEntity, type Bonus } from './model'
import { BonusService } from './service'

@Controller('bonus')
export class BonusController {
  constructor(private readonly bonusService: BonusService) {}

  // 列表
  @Get('list')
  async list(@QueryModel(bonusEntity) bonus: Bonus) {
    const result = await this.bonusService.list(bonus)
    return result
  }
}
