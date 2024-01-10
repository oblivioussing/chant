#!/usr/bin/env node

import shell from 'shelljs'
import { fileURLToPath } from 'url'

init() // 初始化
// 初始化
async function init() {
  // 获取web目录地址
  const webPath = await getDirPath('web')
  // 启动web服务
  shell.exec(`cd ${webPath} && npm run dev`)
}
// 获取文件夹地址
function getDirPath(name: string) {
  const url = new URL(`../../${name}`, import.meta.url)
  return fileURLToPath(url)
}
