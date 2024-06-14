import { Prisma } from '@prisma/client'
import { prisma, BaseService, Result } from '@/share'
import { type Bonus, type BonusVo } from './model'

export class BonusService extends BaseService {
  // 列表
  async list(salary: Bonus) {
    const result = new Result<BonusVo[]>()
    let rows = await prisma.$queryRaw<Bonus[]>`
      SELECT 
        user_id AS userId,
        SUM(CAST(amount * commission AS DECIMAL (10 , 2 ))) AS bonus,
        DATE_FORMAT(create_time, '%Y-%m') AS date
      FROM
          chant.trade
      WHERE status = 1 
        ${
          salary.userId
            ? Prisma.sql`AND user_id=${salary.userId}`
            : Prisma.empty
        }
      GROUP BY user_id , date
        ${salary.date ? Prisma.sql`HAVING date=${salary.date}` : Prisma.empty}
      ORDER BY date DESC;
    `
    if (rows) {
      rows = await this.userIdsToName(rows, ['userId'])
      result.success({ data: rows, msg: '奖金列表查询成功' })
    } else {
      result.fail('奖金列表查询失败')
    }
    return result
  }
}
