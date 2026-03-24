import type { Plugin } from 'vite'
import type { VersionBuildMeta, VersionManifestPluginOptions } from './types'

// 生成发布版本清单，供运行时轮询 version.json 判断是否出现新构建。
export function createVersionManifestPlugin(meta: VersionBuildMeta, options: VersionManifestPluginOptions = {}): Plugin {
  const fileName = options.fileName || 'version.json'
  const pretty = options.pretty ?? true
  const manifest = JSON.stringify(
    {
      version: meta.version,
      buildTime: meta.buildTime,
      buildId: meta.buildId
    },
    null,
    pretty ? 2 : 0
  )

  return {
    name: 'shared-version-manifest',
    apply: 'build',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName,
        source: manifest
      })
    }
  }
}
