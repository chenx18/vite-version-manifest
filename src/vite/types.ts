export interface VersionBuildMeta {
  version: string
  buildTime: string
  buildId: string
  define: Record<string, string>
}

export interface VersionManifestPluginOptions {
  fileName?: string
  pretty?: boolean
}
