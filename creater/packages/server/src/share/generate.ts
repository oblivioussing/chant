import fs from 'fs'
import handlebars from 'handlebars'

// 生成代码
export function generate() {
  console.log(process.cwd())
  const url = import.meta.url
  const fileUrl = new URL(`./template/web/index.hbs`, url)
  const source = fs.readFileSync(fileUrl, 'utf8')
  const template = handlebars.compile(source)
  const code = template({ name: 123456 })
  const saveUrl = new URL('../dist/index.vue', url)
  fs.writeFileSync(saveUrl, code)
}
