// 隐藏手机中间4位
export function hidePhone(val: string | number) {
  if (val) {
    return val.toString().replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3')
  }
}
// 手机号码分段
export function mobileCut(val: string) {
  let tpl = ''
  for (let i = 0; i < val.length; i++) {
    if (i == 2 || i == 6) {
      tpl = tpl + val.charAt(i) + ' '
    } else {
      tpl = tpl + val.charAt(i)
    }
  }
  return tpl
}
// 金额
export function money(val: string | number) {
  if (val) {
    return Math.floor(Number(val) * 100) / 100
  } else {
    return 0
  }
}
// 千分位
export function thousand(val: string | number) {
  if (val) {
    val = Number(val).toFixed(2).toString()
    return val.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
}
