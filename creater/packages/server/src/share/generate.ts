import fs from 'fs/promises'
import handlebars from 'handlebars'
import path from 'path'
import { rimraf } from 'rimraf'
import type { Form, Type } from './type'

const typeDict = {
  1: 'web',
  2: 'server'
}
// 执行生成命令行所在的目录
const cmdPath = process.argv.pop()!
// 生成代码的目录
const codeDir = `${cmdPath}/chant-generate-code/`

// 生成代码
export async function generate(data: Form) {
  // 前端/后端的文件夹名称
  const typeDir = typeDict[data.type]
  // 路由文件夹
  const routerPath = `${codeDir}/${typeDir}/${data.path}`
  // 创建目录
  mkDir(routerPath)
  // 模版文件夹
  const templateDir = `${process.cwd()}/template/${typeDir}`
  // 遍历目录
  const files = await fs.readdir(templateDir)
  files.forEach(async (item) => {
    const fileName = item.replace('.hbs', '')
    const stats = await fs.stat(`${templateDir}/${item}`)
    console.log(stats)
    if (stats.isDirectory()) {
    } else {
    }
  })
  // const filePath = process.cwd() + '/src/template/web/index.hbs'
  // const source = fs.readFileSync(filePath, 'utf8')
  // const template = handlebars.compile(source)
  // const code = template(data)
  // const saveUrl = `${cmdPath}/index.vue`
  // console.log(saveUrl)
  // fs.writeFileSync(saveUrl, code)
}
// 创建目录
async function mkDir(dir: string) {
  try {
    await fs.statfs(dir)
    await rimraf(dir)
  } catch (error: any) {
    // 文件夹不存在
    if (error.code === 'ENOENT') {
      await fs.mkdir(dir, { recursive: true })
    } else {
      console.log(error)
    }
  }
}
// 生成文件
function createFile() {}
