#!/usr/bin/env node

import { select } from '@inquirer/prompts'

init() // 初始化
// 初始化
async function init() {
  const ret = await select({
    message: '请选择生成的代码类型',
    choices: [
      { name: 'admin', value: 'admin' },
      { name: 'nodejs', value: 'nodejs' }
    ]
  })
  console.log(ret)
}
