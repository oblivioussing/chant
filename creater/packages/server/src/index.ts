import Koa from 'koa'
import Router from 'koa-router'
import mysql from './share/mysql'

const app = new Koa()
const router = new Router()

// 获取表列表
router.get('/table/list', async (ctx) => {
  try {
    const [data] = await mysql.connection.query(
      `select table_name from information_schema.tables where table_schema = 'chant' and table_name!='_prisma_migrations'`
    )
    ctx.body = {
      code: '1',
      data: (data as any[])?.map((item) => {
        const tableName = item.TABLE_NAME
        return { [tableName]: tableName }
      })
    }
  } catch (error) {
    console.error('error:', error)
  }
})
// use
app.use(router.routes())
app.use(router.allowedMethods())
// listen
app.listen(7200, () => {
  console.log('koa服务启动成功')
})
