import fs from 'fs'
import path from 'path'

function walkSync(currentDirPath, callback) {
  fs.readdirSync(currentDirPath, { withFileTypes: true }).forEach((dirent) => {
    var filePath = path.join(currentDirPath, dirent.name)
    if (dirent.isFile()) {
      callback(filePath, dirent)
    } else if (dirent.isDirectory()) {
      walkSync(filePath, callback)
    }
  })
}
walkSync('./', (filePath) => {
  console.log(filePath)
})
