import fs from 'fs/promises'
import handlebars from 'handlebars'
import type { Form } from './type'

const typeDict = {
  1: 'web',
  2: 'server'
}
// 执行生成命令行所在的目录
const cmdPath = process.argv.pop()!
// 生成代码的目录
const codeDir = `${cmdPath}/chant-generate-code`

// 生成代码
export async function generate(data: Form) {
  const routePath = data.routePath?.replace(/^\/+|\/+$/g, '')
  const [module, route] = routePath?.split('/') || []
  // 前端/后端的文件夹名称
  const typeDir = typeDict[data.type]
  // 保存目录路径
  const savePath = `${codeDir}/${typeDir}/${data.routePath}`
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
          data: { module, route, ...data },
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
  const template = handlebars.compile(source)
  const fileName = config.templateName.replace('.hbs', '')
  const saveUrl = `${config.codePath}/${fileName}`
  await fs.writeFile(saveUrl, template(config.data))
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
