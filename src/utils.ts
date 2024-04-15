// 清空file文件
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { cwd } from 'node:process'
import { rimrafSync } from 'rimraf'

export const pathResolve = (p: string) => resolve(cwd(), p)
export const log = console.log

/**
 * 如果目录存在那么就删除
 * @param path
 */
export function delDirectory(path: string) {
  if (existsSync(path)) {
    log(`${path} 文件夹存在，正在删除中···`)
    rimrafSync(path)
    log(`${path} 文件夹删除成功`)
  }
}

/**
 * 对比需要下载的列表与已经下载的列表
 * @param sourceArr 需要下载的列表
 * @param downloadedList 已经下载的列表
 */
export function compare(sourceArr: string[], downloadedList: string[]) {
  return sourceArr.filter(item => !downloadedList.some(i => i.endsWith(`/-/${i}`)))
}
