import Router from 'koa-router'
import { generate, mysql } from '../share/'

const router = new Router()

// 获取表列表
router.get('/table/list', async (ctx) => {
  try {
    const [data] = await mysql.connection.query(
      `select table_name from information_schema.tables 
      where table_schema = 'chant' and table_name!='_prisma_migrations'`
    )
    ctx.body = {
      code: '1',
      data: (data as any[])?.map((item) => {
        const tableName = item.TABLE_NAME
        return { tableName }
      })
    }
  } catch (error) {
    console.error('error:', error)
  }
})
// 获取表字段
router.get('/table/field', async (ctx) => {
  const tableName = ctx.query.tableName
  try {
    const [data] = await mysql.connection.query(
      `select column_name,column_type, column_comment
      from information_schema.columns
      where table_name = '${tableName}' and table_schema = 'chant'`
    )
    console.log('data:', data)
    ctx.body = {
      code: '1',
      data
    }
  } catch (error) {
    console.error('error:', error)
  }
})
// 开始生成
router.post('/generate/start', async (ctx) => {
  const body = ctx.request.body
  // 生成代码
  generate(body)
  ctx.body = {
    code: '1',
    body
  }
})

export default router
