# ETLCHINA UI 版本管理与工程打包指南

本文用于规范 ETLCHINA UI 组件更新后的版本号、验证、打包、本地联调和发布流程。

## 1. 判断版本号

组件更新完成后，先判断本次变更属于哪一类：

- `patch`：修复 bug、样式微调、内部实现优化，组件 API 和默认行为不变。
- `minor`：新增组件、新增 Prop、新增 Mock 能力或新增工具函数，保持向后兼容。
- `major`：删除或重命名 Prop、改变默认行为、移除导出、破坏旧项目调用方式。

ETLCHINA UI 默认优先保持向后兼容。除非必须清理旧 API，否则不要轻易升 `major`。

## 2. 更新代码与文档

每次组件更新需要同步检查：

- 组件源码、`index.ts`、Storybook stories、测试文件是否完整。
- `src/index.ts` 是否已经导出新增组件、工具函数和关键 Props 类型。
- `CHANGELOG.md` 是否记录本次新增、变更或修复。
- `README.md` 是否需要补充安装、使用、Mock、API 或本地联调说明。
- 如涉及操作流程变化，是否需要更新用户操作手册。

## 3. 运行验证管道

发布前必须运行完整验证：

```bash
npm run test:run
npm run typecheck
npm run build
npm run build-storybook
npm audit --omit=dev && npm audit --audit-level=moderate
rg "#[0-9A-Fa-f]{3,8}" src/components || true
```

验证重点：

- `npm run test:run`：确认所有组件行为和回归测试通过。
- `npm run typecheck`：确认 Props、导出类型和业务泛型没有断裂。
- `npm run build`：确认库模式打包成功。
- `npm run build-storybook`：确认 Storybook 静态站点可构建。
- `npm audit`：确认生产依赖和整体依赖没有中高风险漏洞。
- `rg` 颜色扫描：确认组件内部没有硬编码 hex 色值。

## 4. 工程打包产物

ETLCHINA UI 使用 Vite Library Mode 打包，入口为 `src/index.ts`。

运行：

```bash
npm run build
```

构建后核心产物：

- `dist/index.js`：ESM，供现代打包工具 Tree-shaking。
- `dist/index.cjs`：CommonJS，兼容旧工具链。
- `dist/index.d.ts`：根类型入口。
- `dist/components/**/*.d.ts`：与源码目录对应的组件类型声明。
- `dist/utils/**/*.d.ts`：Mock、行政区划等工具类型声明。

`dist/` 是构建产物，不提交到 git。发布 npm 包时通过 `package.json` 的 `files` 字段进入 tarball。

## 5. 更新版本号

确认验证通过后，根据变更类型更新版本。

推荐在准备发布时执行：

```bash
npm version patch
```

或：

```bash
npm version minor
npm version major
```

`npm version` 会更新：

- `package.json`
- `package-lock.json`
- git commit
- git tag

如果团队希望把代码变更、CHANGELOG 和版本号放在同一个提交里，可以改用：

```bash
npm version patch --no-git-tag-version
git add package.json package-lock.json CHANGELOG.md README.md src docs
git commit -m "release: etlchina-ui v0.1.1"
git tag v0.1.1
```

## 6. 本地消费联调

发布前建议先用 tarball 做真实安装联调：

```bash
npm pack
cd /path/to/consumer-app
npm install /Users/idefeng/Documents/BAUI/etlchina-ui-0.1.1.tgz
```

消费项目入口示例：

```tsx
import 'etlchina-ui/styles.css';
import { Button, SmartTable, cn, getRegionOptions } from 'etlchina-ui';

export function Smoke() {
  const cityOptions = getRegionOptions('CITY');

  return (
    <section className={cn('space-y-4 p-6')}>
      <Button>ETLCHINA UI</Button>
      <SmartTable mock mockType="project" />
      <pre>{JSON.stringify(cityOptions[0], null, 2)}</pre>
    </section>
  );
}
```

消费项目需要提供 React、React DOM、Tailwind CSS 和 Radix 底座依赖。Tailwind 最小配置示例：

```ts
import etlChinaTailwindConfig from 'etlchina-ui/tailwind.config';

export default {
  presets: [etlChinaTailwindConfig],
  content: ['./src/**/*.{ts,tsx}', './node_modules/etlchina-ui/dist/**/*.{js,cjs}'],
};
```

## 7. 发布

如果使用内部 npm 源：

```bash
npm publish --registry <内部 npm registry>
```

如果暂时不发布 registry，可以把 `npm pack` 生成的 `.tgz` 交给内部项目安装验证。

发布后建议确认：

```bash
npm view etlchina-ui version --registry <内部 npm registry>
```

## 8. 提交与推送

当需要提交代码时，按仓库规则完成：

- 检查 `.gitignore`，确认 `.env`、`dist/`、`storybook-static/`、缓存和日志没有混入。
- 确认 `CHANGELOG.md`、`README.md`、必要的操作手册已经同步。
- 提交并推送到关联远程仓库。
- 如果生成了版本 tag，确认 tag 已推送。

```bash
git status --short
git push
git push --tags
```

## 9. 常见风险

- 新增组件但忘记更新 `src/index.ts`，导致内部项目无法从根入口引入。
- 新增 Prop 但没有导出 Props 类型，导致消费项目类型复用困难。
- 把 React、React DOM、Tailwind 或 Radix 打进产物，导致包体积膨胀或运行时多 React 实例。
- 只跑 `build` 不跑 Storybook，页面模板和业务大件的展示态可能漏问题。
- 只改 Mock 工厂，不改 Storybook 文案和表头，导致业务语义回退。
