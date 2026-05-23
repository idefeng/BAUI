# ETLCHINA UI Codex Rules

## 1. 任务判断与沟通规则

- 当任务是“新需求”时，Codex 必须以更高经验和技术标准理解用户真实意图，不能机械照做。如果不能 100% 确认需求边界，应主动提问，直到完全清楚后再实施。
- 当任务是“现有功能的改动”时，Codex 必须从全局考虑影响面，检查是否有互相关联或引用的位置。不清楚时应主动询问，确认后再实施。
- 当任务是“BUG 修复”时，Codex 必须分析 bug 产生原因，记录经验，总结 failure shield，避免同类问题在其他位置重复出现。
- 对高风险、批量或影响面较大的任务，优先采用稳健路线：先盘点、再实现、再验证。

## 2. 提交代码规则

当用户说“提交代码”时，默认包含以下工作：

- 检查 `.gitignore` 配置，确认 `.env`、构建产物、依赖目录、缓存文件等不应同步的文件没有混入版本控制。
- 如发现不应提交的文件类型，应更新 `.gitignore`。
- 提交到关联的远程仓库。
- 总结本次修改，更新根目录 `CHANGELOG`。
- 如有未完成任务，更新 `task.md`。
- 检查 `README`，如涉及安装、使用、开发或 API 变化，应同步更新。
- 检查用户操作手册；涉及操作流程变更时，应及时更新操作手册。

## 3. 代码生成规则

- 函数、组件 Props、关键逻辑和关键代码行应使用中文注释。
- 代码应符合“简洁之道”，先检查是否已有实现或公共工具，避免重复生成冗余代码。
- 优先复用现有工具函数、共享样式、组件模式和目录结构。
- 不做无关重构；重构必须服务当前任务。
- 修改已有组件时必须保持原有 API 向后兼容，严禁无故删除或重命名已存在的 Prop。
- 组件尽量保持纯 UI 渲染逻辑，状态优先由外部 Controlled 传入。
- 新功能和行为变更优先使用测试驱动：先补测试，再实现，再验证。

## 4. ETLCHINA UI 技术栈

- 框架：React 18+、TypeScript、Vite。
- 样式：Tailwind CSS、clsx、tailwind-merge。
- Headless 交互底座：Radix UI。
- 图标：lucide-react。
- 文档与预览：Storybook。
- 测试：Vitest、Testing Library。

## 5. ETLCHINA UI 视觉规范

- 所有组件样式必须基于 `tailwind.config.js` 中定义的语义化变量。
- 严禁在组件内部使用任何硬编码 hex 颜色值，例如 `bg-[#0066FF]`。
- 主色使用科技蓝 `primary`，成功色使用 `success`，危险状态使用 `danger`。
- 整体风格应保持极简、现代、大圆角、强呼吸感。
- 默认圆角优先使用 `rounded-xl` 或 `rounded-2xl`。
- 表单、按钮、浮层、表格、反馈组件应保持宽松 padding 和清晰交互状态。
- 组件必须适配暗黑模式，使用 Tailwind `dark:` 前缀。
- 暗黑模式由 `darkMode: 'class'` 驱动，通过在 `html` 或 `body` 上添加 `dark` 类名控制。
- 科技蓝和成功色在暗色背景下必须保持足够对比度和可读性。

## 6. ETLCHINA UI 组件目录规范

每个组件必须独立成目录，结构如下：

```text
src/components/ui/component-name/
  component-name.tsx
  index.ts
  component-name.stories.tsx
  component-name.test.tsx
```

业务组件放在：

```text
src/components/biz/component-name/
  component-name.tsx
  index.ts
  component-name.stories.tsx
  component-name.test.tsx
```

组件实现完成后，应在 `src/index.ts` 中导出。

## 7. ETLCHINA UI 组件实现约定

- 所有 Radix 可套壳组件一律基于 Radix UI 原语封装，不自研复杂交互、定位、焦点管理和无障碍行为。
- 组件样式使用 `cn` 组合 className，公共样式优先沉淀到 `src/components/ui/shared/styles.ts`。
- 组件 Props 必须有严格 TypeScript 类型定义。
- 关键 Props 必须写中文注释，解释使用场景和行为边界。
- 所有组件必须接收并合并 `className`，不得阻断业务侧样式扩展。
- 交互组件必须保留 Radix 原语的受控和非受控能力，例如 `value/defaultValue/onValueChange/open/onOpenChange`。
- 支持图标的组件默认使用 lucide-react 图标，并允许业务传入自定义 `ReactNode`。
- 禁用、加载、选中、展开、焦点、悬浮、错误等状态必须有明确样式。
- 浮层类组件必须有合理 z-index、现代大圆角、阴影、动画和暗黑模式样式。

## 8. 企业内部定制：本地 Mock 驱动规范 (Efficiency Pack)
- **核心目的**：为了让前端开发摆脱对后端接口的依赖，实现全库组件的“提效降本”，各核心组件必须内嵌 `mock` 驱动能力。
- **命名规范**：统一使用可选属性 `mock?: boolean`（或特定组件支持的枚举值，如 `mock?: 'user' | 'course'`）。严禁使用 `fake`、`testData` 等其他杂乱命名。
- **中央数据源隔离**：所有 mock 数据必须从统一的中央工具库 `src/utils/mock.ts` 中调用，严禁在单个组件内部硬编码、手写死数据。
- **SmartTable 联动规范**：当 `SmartTable` 接收到 `mock={true}` 且外部无真实数据传入时，必须强制模拟 `Skeleton`（骨架屏）动画加载 500ms~1000ms，以100%还原真实的异步接口请求场景。
- **生产安全边界**：组件内部的 mock 逻辑必须编写得足够轻量，且作为外部 Props 的兜底（Fallback）方案。当外部传入真实数据时，真实数据永远拥有最高优先级，mock 逻辑必须自动失效。

## 9. 企业业务属性内嵌规范 (Business Context Rules)
- **核心全局属性**：所有展示类（Table, Profile, Certificate）和数据收集类（Form, Input）组件，必须向后兼容并支持以下可选 Props：
  - `mock?: boolean`（是否启用Mock）
  - `ba_training_project?: string`（培训项目代号）
  - `ba_trainning_title?: string`（培训岗位代号）
  - `ba_trainning_type?: string`（培训类型代号）
- **全国行政区划驱动规范**：
  - 支持可选 Props：`ba_region_scope?: string`（属地范围 Adcode）和 `ba_region_level?: 'PROVINCE' | 'CITY' | 'DISTRICT'`。
  - **中央区划数据源**：在 `src/utils/regions.ts` 中存放一份压缩后的、包含国标编码的常用全国省市区三级联动静态数据。
  - **Cascader 语义化拦截**：当 `Cascader` 组件接收到 `type="region"` 时，必须自动读取并渲染中央区划数据，且深度受 `ba_region_level` 严格控制；普通 `mock={true}` 继续保留公司组织架构 Mock 语义。
- **白名单机制**：必须在 `src/utils/mock.ts` 中硬编码上述三个属性的【预设值白名单】。如果外部传入的值不在白名单内，必须将其视为 `undefined`（相当于没设置），绝不允许非法数据污染 Mock 数据源。
- **降级与过滤**：当 `mock={true}` 且设置了合法的业务属性时，Mock 生成器必须返回与该业务强相关的数据。如果未设置业务属性，则默认返回通用的混合型假数据。

## 10. Storybook 规范

- 每个组件必须提供完整 Storybook 用例。
- Storybook 至少覆盖基础用法和一个真实业务使用场景。
- 复杂组件应覆盖受控状态、禁用状态、图标组合、空态或变体。
- Storybook 预览应直接展示可用组件，不做营销式 landing page。
- 组件故事中的样式同样不得硬编码 hex 颜色。

## 11. 验证规则

完成组件或功能开发后，默认执行：

```bash
npm run test:run
npm run typecheck
npm run build
npm run build-storybook
npm audit --omit=dev && npm audit --audit-level=moderate
rg "#[0-9A-Fa-f]{3,8}" src/components || true
```

- 前端可视化改动应尽量通过 Storybook 或浏览器做交互冒烟。
- 不能声称完成、通过或可用，除非已经运行并读取对应验证命令结果。
