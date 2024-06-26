import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { type Router } from '@prisma/client'
import { QueryModel } from '@/decorator'
import { IdVali } from '@/validator'
import { routerEntity } from './model'
import { RouterService } from './service'
import { AddVali, TransferVali, UpdateVali } from './validator'

@Controller('router')
export class RouterController {
  constructor(private readonly routerService: RouterService) {}

  // 根节点初始化
  @Post('root')
  async root() {
    const result = await this.routerService.root()
    return result
  }
  // 新增
  @Post('add')
  async add(@Body() router: AddVali) {
    const result = await this.routerService.add(router as Router)
    return result
  }
  // 更新
  @Post('update')
  async update(@Body() router: UpdateVali) {
    const result = await this.routerService.update(router as Router)
    return result
  }
  // 删除
  @Post('delete')
  async delete(@Body() router: IdVali) {
    const result = await this.routerService.delete(router.id)
    return result
  }
  // 详情
  @Get('detail')
  async detail(@Query() router: IdVali) {
    const result = await this.routerService.detail(router.id)
    return result
  }
  // 列表
  @Get('list')
  async list(@QueryModel(routerEntity) router: Router) {
    const result = await this.routerService.list(router)
    return result
  }
  // 排序
  @Post('sort')
  async sort(@Body() ids: string[]) {
    const result = await this.routerService.sort(ids)
    return result
  }
  // 树
  @Get('tree')
  async tree(@QueryModel(routerEntity) router: Router) {
    const result = await this.routerService.tree(router)
    return result
  }
  // 源
  @Get('source')
  async source() {
    const result = await this.routerService.source()
    return result
  }
  // 目标
  @Get('target')
  async target() {
    const result = await this.routerService.target()
    return result
  }
  // 转移
  @Post('transfer')
  async transfer(@Body() params: TransferVali) {
    const result = await this.routerService.transfer(params as any)
    return result
  }
}
