import handlebars from 'handlebars'

handlebars.registerHelper({
  comma: (val: boolean) => {
    return val ? undefined : ','
  },
  dictNote: (val: any) => {
    let str = ''
    for (const item in val) {
      str += item + '-' + val[item] + ' '
    }
    return str
  },
  equal: (a, b) => {
    return a === b
  },
  upper: (str) => {
    if (typeof str === 'string') {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
    return str
  },
  valueType: (type: string) => {
    if (type.includes('datetime')) {
      return `new Date()`
    }
    if (type.includes('decimal')) {
      return `new Prisma.Decimal(0)`
    }
    if (type.includes('int')) {
      return `0`
    }
    return new handlebars.SafeString(`''`)
  }
})
