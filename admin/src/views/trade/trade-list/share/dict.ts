export default {
  // 提成(百分比)
  commission: new Map([
    [0.1, '10%'],
    [0.15, '15%']
  ]),
  // 状态
  status: {
    1: 'dict.normal', // 正常
    2: 'dict.void' // 作废
  }
}
