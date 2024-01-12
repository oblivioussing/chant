import fs from 'fs'
import handlebars from 'handlebars'

// 生成代码
export function generate(data: any) {
  const filePath = process.cwd() + '/src/template/web/index.hbs'
  const source = fs.readFileSync(filePath, 'utf8')
  const template = handlebars.compile(source)
  const code = template(data)
  const cmdPath = process.argv.pop()
  const saveUrl = `${cmdPath}/index.vue`
  console.log(saveUrl)
  fs.writeFileSync(saveUrl, code)
}
