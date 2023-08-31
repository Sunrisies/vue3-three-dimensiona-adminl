// import * as path from 'path'
// import * as fs from 'fs'
// const __dirname = path.dirname(import.meta.url)
// console.log(__dirname, '-__dirname')
// console.log(path)
// console.log(require, 'require')
// const files = require.context('./', true, /\Api.js$/)
// let allApi = {}
// files.keys().forEach((key) => {
//   const module = files(key)
//   const moduleExport = module.default || module
//   allApi = { ...allApi, ...moduleExport }
// })
// export default allApi
// 获取当前文件的 URL
// 获取当前文件所在的目录路径
// const currentDir = currentUrl.pathname.substring(0, currentUrl.pathname.lastIndexOf('/'))
// console.log(currentDir, '')
// 读取当前文件夹下的所有以 .ts 结尾的文件
// const storeFiles = fs.readdirSync(__dirname).filter((file: any) => {
//   return file.endsWith('Store.ts')
// })

// // 导入并统一导出所有 store
// storeFiles.forEach((storeFile: any) => {
//   const storeFilePath = path.join(__dirname, storeFile)
//   // eslint-disable-next-line @typescript-eslint/no-var-requires
//   const storeModule = require(storeFilePath) as { [key: string]: any }
//   const storeName = storeFile.replace('Store.ts', '')
//   console.log(storeName, 'storeName')
//   // exports[storeName] = storeModule[storeName]
//   if (storeModule[storeName]) {
//     exports[storeName] = storeModule[storeName]
//   }
// })
import { useCesiumStore } from './cesiumStore'
import { useLeafletStore } from './leafletStore'
export { useCesiumStore, useLeafletStore }
