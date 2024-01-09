#!/usr/bin/env node

import { input } from '@inquirer/prompts'

init()
// 初始化
async function init() {
  const ret = await input({ message: 'Enter your name' })
  console.log(ret)
}
