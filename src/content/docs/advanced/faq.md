---
title: '常见问题解答 (FAQs)'
description: '常见问题解答'
order: 4
---

## 路径

### 博客专属路径

博客路由格式示例：`/blog/:年份/:id`

参考 [4.0.2-beta如何使文章链接中包含年份](https://github.com/cworld1/astro-theme-pure/discussions/37#discussioncomment-11905851)。

## 内容

### 为 `heroImage` 支持网络图片

使用网络图片时需配合 `inferSize: true` 来获取图片尺寸。示例：

```yaml
heroImage:
  { src: 'https://img.tukuppt.com/ad_preview/00/15/09/5e715a320b68e.jpg!/fw/980', inferSize: true }
```

## 构建

### Vite 请求被拦截

```log
Blocked request. This host ("xxx")is not allowed.
To allow this host, add "xxx" to `preview.allowedHosts` in vite.config.js.
```
> 日志翻译：
> 请求被拦截。不允许访问该主机（"xxx"）。
> 如需允许访问该主机，请在 vite.config.js 中把 "xxx" 添加到 `preview.allowedHosts` 配置项中。


参考 [option server.allowedHosts doesn't take into account "true"](https://github.com/vitejs/vite/issues/19242)（服务器 allowedHosts 配置项未正确识别 "true" 值问题）

### `BUN_LINK_PKG` 相关问题

参考 [BUN_LINK_PKG 环境变量无法设置成功](https://github.com/cworld1/astro-theme-pure/issues/51)

### 构建时报错 “未定义导出主入口”

```log
07:39:23 [ERROR] [@astrojs/vercel] An unhandled error occurred while running the "astro:build:done" hook
No "exports" main defined in /vercel/path0/node_modules/estree-walker/package.json
  Stack trace:
    ...
```


> 日志翻译：
> 07:39:23 [错误] [@astrojs/vercel] 运行 "astro:build:done" 钩子时发生未处理的错误
> 在 /vercel/path0/node_modules/estree-walker/package.json 中未定义 "exports" 主入口
> 堆栈跟踪：
> ...



尝试清除现有构建缓存后重新部署项目。

详情参考：[oven-sh/bun/issues: error No "exports" main defined in /vercel/path0/node_modules/estree-walker/package.json](https://github.com/oven-sh/bun/issues/7241)
```

### docs/integrations/unocss.md 翻译
```
---
title: 'UnoCSS & 样式配置'
description: '修改网站外观 & 创建自定义样式'
order: 6
---

## UnoCSS 调整外观

你可以通过修改 `src/assets/styles/app.css` 这个 CSS 文件来自定义主题默认的 UnoCSS 调色板。例如，若要修改默认主题色，可调整以下代码：

```css title="src/assets/styles/app.css"
:root {
  /* ... */
  --primary: 200 29% 45%; /* [!code --] */
  --primary: <你喜欢的 hsl 格式颜色值>; /* [!code ++] */
}
```

若要修改默认字体族，可通过同样方式调整以下代码：

```css title="src/assets/styles/app.css"
:root {
  /* ... */
  font-family: 'Satoshi'; /* [!code --] */
  src: url('/fonts/Satoshi-Variable.ttf'); /* [!code --] */
  font-family: '<你喜欢的字体族名称>'; /* [!code ++] */
  src: url('/fonts/<你喜欢的字体文件>.ttf'); /* [!code ++] */
}
```

请确保将自定义字体文件放在 `public/fonts` 目录下。

## UnoCSS 配置

配置文件路径：`uno.config.ts`

更多相关信息可参考：

- [UnoCSS: Astro 集成](https://unocss.dev/integrations/astro)
- [UnoCSS: 配置 UnoCSS](https://unocss.dev/config)

## `@unocss/preset-typography`（排版预设）

排版配置可在 `uno.config.ts` 中修改：

```js title="uno.config.ts"
const typographyConfig = {
  // prettier-ignore
  cssExtend: { // [!code highlight:3]
    // ...
  }
}
```

但如果你想通过 UnoCSS 自定义排版样式，或仅修改预设的排版主题，可在 `src/site.config.ts` 中操作：

```ts title="src/site.config.ts"
export const integ: IntegrationUserConfig = {
  // ...
  typography: {
    class: 'prose text-base text-muted-foreground' // [!code highlight]
  }
}
```

更多内容请查看 [排版预设文档](https://unocss.dev/presets/typography)。
```

### docs/setup/configuration.md 翻译
```
---
title: '配置说明'
description: '配置文件相关说明'
order: 4
---

## 主题配置

配置文件路径：`src/site.config.ts`

待更新...

## Astro 配置

配置文件路径：`astro.config.ts`

你可以通过该文件配置修改部署方式、添加 rehype 和 remark 插件等。

更多 Astro 配置相关内容请参考 [Astro 官方配置文档](https://docs.astro.build/en/guides/configuring-astro/)。

## ESLint 配置

配置文件路径：`eslint.config.mjs`

你可以通过该文件配置修改 ESLint 规则和安全检查项。

更多 ESLint 配置相关内容请参考 [ESLint 官方配置文档](https://eslint.org/docs/latest/use/configure/configuration-files)。

## Prettier 配置

配置文件路径：`prettier.config.mjs`

你可以通过该文件配置修改代码格式化规则，这会影响你使用 `format` 包命令的体验，以及你常用 IDE 的插件适配效果。

可配置的选项请参考 [Prettier 官方选项文档](https://prettier.io/docs/en/options)。

## UnoCSS 配置

配置文件路径：`uno.config.ts`

UnoCSS 是一个优先考虑实用性的 CSS 框架，用于构建自定义设计。本主题也使用了其 `typography`（排版）预设来实现文字样式设置。

更多信息请查看 [UnoCSS & 样式配置](/docs/integrations/unocss)。

## TypeScript 配置

配置文件路径：`tsconfig.json`
