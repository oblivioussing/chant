import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
// @ts-ignore
import cors from '@koa/cors'
import router from './router'

const app = new Koa()

// use
app.use(cors())
app.use(router.allowedMethods())
app.use(bodyParser())
app.use(router.routes())
// listen
app.listen(7200, () => {
  console.log('koa服务启动成功')
})
