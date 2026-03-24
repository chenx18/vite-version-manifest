import type { VersionBuildMeta, VersionManifestPluginOptions } from './types'
export type { VersionBuildMeta, VersionManifestPluginOptions } from './types'
export { createVersionManifestPlugin } from './version-manifest.js'

// 统一生成构建期版本元信息，供 Vite define 与 version.json 共同使用。
export function createVersionBuildMeta(version: string, buildTime = new Date().toISOString()): VersionBuildMeta {
  const normalizedVersion = version || '0.0.0'
  const buildId = `${normalizedVersion}-${buildTime}`

  return {
    version: normalizedVersion,
    buildTime,
    buildId,
    define: {
      __APP_VERSION__: JSON.stringify(normalizedVersion),
      __APP_BUILD_TIME__: JSON.stringify(buildTime),
      __APP_BUILD_ID__: JSON.stringify(buildId)
    }
  }
}
