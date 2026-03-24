import { rm } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const packageRoot = path.resolve(__dirname, '..')
const nodeExec = process.execPath
const tscCli = path.resolve(packageRoot, 'node_modules/typescript/bin/tsc')

function run(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: 'inherit', shell: false })
    child.on('close', (code) => {
      if (code === 0) {
        resolve()
        return
      }
      reject(new Error(`${command} ${args.join(' ')} 执行失败，退出码: ${code}`))
    })
  })
}

async function build() {
  await rm(path.resolve(packageRoot, 'dist'), { recursive: true, force: true })
  await run(nodeExec, [tscCli, '-p', 'tsconfig.build.json'], packageRoot)
  await run(nodeExec, [tscCli, '-p', 'tsconfig.types.json'], packageRoot)
}

build().catch((error) => {
  console.error('[vite-version-manifest] 构建失败')
  console.error(error)
  process.exit(1)
})
