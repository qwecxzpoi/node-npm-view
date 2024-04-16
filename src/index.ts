import fs from 'node:fs'
import { URL } from 'node:url'
import { execSync } from 'node:child_process'
import { compare, delDirectory, log, pathResolve } from './utils.ts'

const lockPath = pathResolve('package-lock.json')
const savedPath = pathResolve('tgz')
if (!fs.existsSync(savedPath))
  fs.mkdirSync(savedPath)

const dirPath = pathResolve('tgz/file')
const errorPath = pathResolve('tgz/error.txt')
const resultPath = pathResolve('tgz/result.txt')
delDirectory(resultPath)

try {
  log('检测是否存在配置文件')
  if (!fs.existsSync(lockPath))
    throw new Error(`${pathResolve('.')} 中未发现存在配置文件`)

  log('读取配置文件')
  const rawData = fs.readFileSync(lockPath, 'utf-8')
  const data = JSON.parse(rawData)

  const viewList: string[] = []

  log('获取依赖包地址')
  if (data.packages) {
    Object.keys(data.packages).forEach((item) => {
      if (item.length > 0)
        viewList.push(data.packages[item].resolved)
    })
  }
  delDirectory(dirPath)

  log('正在新建 file 文件夹')
  fs.mkdirSync(dirPath)
  log('file 文件夹创建成功')

  viewList
    .filter(Boolean)
    .forEach((src) => {
      const filename = new URL(src).pathname.split('/-/')[1]

      execSync(`curl -o ${dirPath}/${filename} ${src} -s -L`)
      log(`${filename} 下载完成`)
    })

  const downloadedList = fs.readdirSync(dirPath)
  const result = compare(viewList, downloadedList)
  const resultStr = result.join('\n')
  fs.writeFileSync(resultPath, `下载执行完毕，完成度${downloadedList.length}/${result.length}：\n${resultStr}`, 'utf-8')
}
catch (e) {
  fs.appendFileSync(errorPath, `${(e as any).message || e}\n`, 'utf-8')
}
