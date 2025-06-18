import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common'
import { BodyModel, QueryModel, ZodValidation } from '@/components'
import { IdVali, IdsVali } from '@/validator'
import { routerEntity, type RouterEntity } from './model'
import { RouterService } from './service'
import { AddVali, TransferVali, UpdateVali } from './validator'

@Controller('router')
export class RouterController {
  constructor(private readonly routerService: RouterService) {}

  // 新增
  @Post('add')
  @UsePipes(new ZodValidation(AddVali))
  async add(@BodyModel(routerEntity) router: RouterEntity) {
    const result = await this.routerService.add(router)
    return result
  }
  // 删除
  @Post('delete')
  @UsePipes(new ZodValidation(IdVali))
  async delete(@Body() router: RouterEntity) {
    const result = await this.routerService.delete(router.id)
    return result
  }
  // 详情
  @Get('detail')
  @UsePipes(new ZodValidation(IdVali))
  async detail(@Query() router: RouterEntity) {
    const result = await this.routerService.detail(router.id)
    return result
  }
  // 列表
  @Get('list')
  async list(@QueryModel(routerEntity) router: RouterEntity) {
    const result = await this.routerService.list(router)
    return result
  }
  // 根节点初始化
  @Post('root')
  async root() {
    const result = await this.routerService.root()
    return result
  }
  // 排序
  @Post('sort')
  @UsePipes(new ZodValidation(IdsVali))
  async sort(@Body() params: { ids: string[] }) {
    const result = await this.routerService.sort(params.ids)
    return result
  }
  // 树
  @Get('tree')
  async tree(@QueryModel(routerEntity) router: RouterEntity) {
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
  @UsePipes(new ZodValidation(TransferVali))
  async transfer(@Body() params: { id: string; ids: string[] }) {
    const result = await this.routerService.transfer(params)
    return result
  }
  // 更新
  @Post('update')
  @UsePipes(new ZodValidation(UpdateVali))
  async update(@BodyModel(routerEntity) router: RouterEntity) {
    const result = await this.routerService.update(router)
    return result
  }
}
