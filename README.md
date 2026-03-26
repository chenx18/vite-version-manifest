# vite-version-manifest

`vite-version-manifest` 是一个面向 `Vite` 项目的构建期版本清单插件，用于统一处理版本元信息注入与 `version.json` 生成。

## 作用

它负责在构建阶段完成以下工作：

- 生成标准化的版本元信息
- 注入 `__APP_VERSION__`
- 注入 `__APP_BUILD_TIME__`
- 注入 `__APP_BUILD_ID__`
- 注入 `__APP_BASE_URL__`
- 在构建产物中输出版本清单文件

这个包通常与 `vue3-version-update` 配套使用，但也可以单独使用。

## 安装

```bash
npm install -D vite-version-manifest
```

## 快速开始

```ts
import fs from 'fs'
import path from 'path'
import { defineConfig } from 'vite'
import { createVersionBuildMeta, createVersionManifestPlugin } from 'vite-version-manifest'

const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'))
const versionMeta = createVersionBuildMeta(pkg.version || '0.0.0')

export default defineConfig({
  define: versionMeta.define,
  plugins: [createVersionManifestPlugin(versionMeta)]
})
```

## 构建输出

默认会生成以下内容：

- `__APP_VERSION__`
- `__APP_BUILD_TIME__`
- `__APP_BUILD_ID__`
- `__APP_BASE_URL__`
- `dist/version.json`

示例：

```json
{
  "version": "1.0.0",
  "buildTime": "2026-03-24T10:00:00.000Z",
  "buildId": "1.0.0-2026-03-24T10:00:00.000Z"
}
```

## API

### `createVersionBuildMeta(version, buildTime?)`

统一生成构建期版本元信息，供 `define` 和版本清单文件复用。

### `createVersionManifestPlugin(meta, options?)`

创建一个 Vite 插件，在生产构建时输出版本清单文件。

```ts
import { createVersionBuildMeta, createVersionManifestPlugin } from 'vite-version-manifest'

const meta = createVersionBuildMeta('1.0.0')

export default defineConfig({
  define: meta.define,
  plugins: [
    createVersionManifestPlugin(meta, {
      fileName: 'version.json',
      pretty: true
    })
  ]
})
```

#### `options.fileName`

- 类型：`string`
- 默认值：`version.json`
- 说明：自定义输出的版本清单文件名。

#### `options.pretty`

- 类型：`boolean`
- 默认值：`true`
- 说明：是否格式化输出版本清单内容。

### `VersionBuildMeta`

```ts
interface VersionBuildMeta {
  version: string
  buildTime: string
  buildId: string
  define: Record<string, string>
}
```

### `VersionManifestPluginOptions`

```ts
interface VersionManifestPluginOptions {
  fileName?: string
  pretty?: boolean
}
```

## 设计说明

### 为什么不只使用 `package.json` 的 `version`

如果只依赖 `version`：

- 每次发版都必须手动改版本号
- 不改版本号时无法识别“新构建”

因此这里使用：

- `version`
- `buildTime`
- `buildId = version + buildTime`

这样即使版本号没有变化，只要重新构建，`buildId` 也会变化。

### 为什么要生成版本清单文件

因为很多项目的真正缓存问题来自固定路径资源，例如：

- `index.html`
- `version.json`

而不是带 hash 的 `assets/*.js`。运行时主动请求一个轻量版本清单，比依赖整页刷新后才知道新版本更稳。

## 常见问题

### 1. 这个包是否只能和 `vue3-version-update` 一起使用

不是。它可以单独用于任何 Vite 项目，只要你需要在构建产物里生成标准化版本清单。

### 2. 这个包是否会改动缓存策略

不会。它只负责生成版本数据。真正的缓存头仍然需要部署层配置。

### 3. 开发环境是否也能访问 `version.json`

可以。当前版本会在 `vite serve` 阶段直接通过中间件返回 `version.json`，这样开发环境和生产环境都能统一请求同一个版本清单地址。

### 4. 为什么还要注入 `__APP_BASE_URL__`

在微前端场景里，子应用请求 `version.json` 时不能简单依赖基座域名。插件会把当前项目的 `base` 作为 `__APP_BASE_URL__` 注入到运行时，配合 `vue3-version-update` 可以正确拼出子应用自己的版本清单地址。

## 相关包

- `vue3-version-update`：Vue 3 运行时版本检测与更新提示包
