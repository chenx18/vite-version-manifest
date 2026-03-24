# 发布步骤

## 1. 登录 npm

```bash
npm login
```

## 2. 构建并检查打包内容

### vue3-version-update

```bash
cd E:\npm-packages\vue3-version-update
npm install
npm run build
npm run pack:check
```

### vite-version-manifest

```bash
cd E:\npm-packages\vite-version-manifest
npm install
npm run build
npm run pack:check
```

## 3. 发布

### 发布 vue3-version-update

```bash
cd E:\npm-packages\vue3-version-update
npm publish
```

### 发布 vite-version-manifest

```bash
cd E:\npm-packages\vite-version-manifest
npm publish
```

## 4. 如果只是修复兼容问题

先调整版本号后再发布，例如：

- `1.0.0` -> `1.0.1`
- `1.0.1` -> `1.1.0`

建议遵循：

- 修复兼容性问题：补丁版本
- 新增兼容配置：次版本
- 破坏性调整：主版本

## 5. 业务项目安装

```bash
npm install vue3-version-update vite-version-manifest
```

如果只使用其中一部分能力，也可以单独安装对应包。
