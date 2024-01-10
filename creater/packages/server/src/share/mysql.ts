import mysql from 'mysql2/promise'

class Mysql {
  // 连接实例
  connection!: mysql.Connection

  constructor() {
    // 连接数据库
    this.init()
  }
  // 连接数据库
  async init() {
    const connection = await mysql.createConnection({
      host: '127.0.0.1',
      password: '!Alone570628',
      user: 'root',
      database: 'chant'
    })
    this.connection = connection
  }
}

export default new Mysql()
