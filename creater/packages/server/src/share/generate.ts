import fs from 'fs/promises'
import handlebars from 'handlebars'
import type { Form } from './type'
import './handlebar'

// var
const typeDict = {
  1: 'web',
  2: 'server'
}
// 执行生成命令行所在的目录
const cmdPath = process.argv.pop()!
// 生成代码的目录
const codeDir = `${cmdPath}/chant-generate`

// 生成代码
export async function generate(data: Form) {
  data.list?.forEach((item) => {
    item.required = !!item.required
    item.search = !!item.search
    if (['datePicker', 'dynamicPicker'].includes(item.type)) {
      Reflect.deleteProperty(item, 'type')
    }
  })
  const routePath = data.routePath?.replace(/^\/+|\/+$/g, '')
  const routes = routePath?.split('/') || []
  const module = routes[routes.length - 1]
  // 前端/后端的文件夹名称
  const typeDir = typeDict[data.type]
  // 保存目录路径
  const path = data.type === '1' ? data.routePath : data.tableName
  const savePath = `${codeDir}/${typeDir}/${path}`
  // 创建目录
  await mkDir(savePath)
  // 模版文件夹
  const templateDir = `${process.cwd()}/template/${typeDir}`
  // 递归目录(调用)
  dirRecursion(templateDir, savePath)
  // 递归目录
  async function dirRecursion(templateDir: string, codePath: string) {
    const files = await fs.readdir(templateDir)
    for (let item of files) {
      const hbs = `${templateDir}/${item}`
      const stats = await fs.stat(hbs)
      if (stats.isDirectory()) {
        // 创建目录
        await mkDir(`${codePath}/${item}`)
        dirRecursion(`${templateDir}/${item}`, `${codePath}/${item}`)
      } else {
        createFile({
          data: { module: module || data.tableName, ...data },
          templateName: item,
          hbs,
          codePath
        })
      }
    }
  }
}

// 生成文件
async function createFile(config: {
  data: any
  templateName: string
  hbs: string
  codePath: string
}) {
  const source = await fs.readFile(config.hbs, 'utf8')
  try {
    const template = handlebars.compile(source)
    const fileName = config.templateName.replace('.hbs', '')
    const saveUrl = `${config.codePath}/${fileName}`
    fs.writeFile(saveUrl, template(config.data))
  } catch (error) {
    console.error(error)
  }
}
// 创建目录
async function mkDir(dir: string) {
  try {
    await fs.statfs(dir)
  } catch (error: any) {
    // 文件夹不存在
    if (error.code === 'ENOENT') {
      await fs.mkdir(dir, { recursive: true })
    } else {
      console.log(error)
    }
  }
}
