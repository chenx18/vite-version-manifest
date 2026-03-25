import type { Plugin } from 'vite'
import type { VersionBuildMeta, VersionManifestPluginOptions } from './types'

function buildManifest(meta: VersionBuildMeta, pretty: boolean) {
  return JSON.stringify(
    {
      version: meta.version,
      buildTime: meta.buildTime,
      buildId: meta.buildId
    },
    null,
    pretty ? 2 : 0
  )
}

function normalizeRequestPath(pathname: string, base: string, fileName: string) {
  const normalizedBase = base.endsWith('/') ? base : `${base}/`
  const normalizedFileName = fileName.startsWith('/') ? fileName.slice(1) : fileName
  const expectedPath = `${normalizedBase}${normalizedFileName}`.replace(/\/+/g, '/')
  return pathname === expectedPath || pathname === `/${normalizedFileName}`
}

// 统一在开发与构建阶段提供 version.json，供运行时轮询判断是否出现新构建。
export function createVersionManifestPlugin(meta: VersionBuildMeta, options: VersionManifestPluginOptions = {}): Plugin {
  const fileName = options.fileName || 'version.json'
  const pretty = options.pretty ?? true
  const manifest = buildManifest(meta, pretty)

  return {
    name: 'shared-version-manifest',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url) {
          next()
          return
        }

        const requestUrl = new URL(req.url, 'http://localhost')
        if (!normalizeRequestPath(requestUrl.pathname, server.config.base, fileName)) {
          next()
          return
        }

        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        res.end(manifest)
      })
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName,
        source: manifest
      })
    }
  }
}
