#!/usr/bin/env node

import { $ } from 'execa'
import { fileURLToPath } from 'url'

const $$ = $({ stdio: 'inherit', shell: true })

init() // 初始化
// 初始化
async function init() {
  // 获取web目录地址
  const webPath = getDirPath('web')
  $$`cd ${webPath} && npm run dev`
  //  获取server目录地址
  const serverPath = getDirPath('server')
  $$`cd ${serverPath} && npm run start ${process.cwd()}`
}
// 获取文件夹地址
function getDirPath(name) {
  const url = new URL(`../packages/${name}`, import.meta.url)
  return fileURLToPath(url)
}
