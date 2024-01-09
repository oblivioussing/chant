#!/usr/bin/env node

import { select } from '@inquirer/prompts'

init() // 初始化
// 初始化
async function init() {
  const ret = await select({ message: 'Enter your name' })
  console.log(ret)
}
