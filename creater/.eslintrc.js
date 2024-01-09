module.exports = {
  root: true,
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true
  },
  extend: ['eslint:recommended'],
  parser: 'babel-eslint',
  parserOptions: { ecmaVersion: 2016, sourceType: 'module' },
  plugins: ['prettier'],
  rules: {}
}
