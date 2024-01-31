import handlebars from 'handlebars'

handlebars.registerHelper('equal', (a, b) => {
  return a === b
})

handlebars.registerHelper('upper', (str) => {
  if (typeof str === 'string') {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
  return str
})
