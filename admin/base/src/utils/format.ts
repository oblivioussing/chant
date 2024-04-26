// 千分位
export function thousand(val: string | number) {
  if (val) {
    val = Number(val).toFixed(2).toString()
    return val.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
}
