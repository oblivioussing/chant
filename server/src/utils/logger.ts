import { createLogger, format, transports } from 'winston'
import 'winston-daily-rotate-file'

type Level = 'error' | 'info'

const options = {
  datePattern: 'YYYY-MM-DD',
  maxSize: '50m',
  maxFiles: '14d',
  zippedArchive: true
}
// 时间戳转日期
const timestamp = format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
// 文件首行
const printf = format.printf((info) => {
  return `${info.level}: ${info.timestamp}:${info.message}`
})
// 等级过滤,用于覆盖winston默认的低等级会写入高等级文件
function levelFilter(level: Level) {
  return format((info) => {
    return info.level === level ? info : false
  })()
}
// 格式化
function formatFactory(level: Level) {
  return format.combine(levelFilter(level), timestamp, printf)
}

export default createLogger({
  level: 'info',
  transports: [
    new transports.DailyRotateFile({
      filename: 'logs/error/%DATE%.log',
      format: formatFactory('error'),
      level: 'error',
      ...options
    }),
    new transports.DailyRotateFile({
      filename: 'logs/info/%DATE%.log',
      format: formatFactory('info'),
      level: 'info',
      ...options
    })
  ]
})
