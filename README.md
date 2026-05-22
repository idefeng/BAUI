# BOAO UI

BOAO UI 是面向公司业务系统的 React + Tailwind 组件库，当前以 Storybook 作为主要预览和验收入口。

## 开发命令

```bash
npm run storybook
npm run test:run
npm run typecheck
npm run build
npm run build-storybook
```

## Mock 数据工坊

中央 Mock 数据位于 `src/utils/mock.ts`，用于让业务组件在没有后端接口时也能展示高保真数据。

```tsx
import { SmartTable, mockProjects, mockUsers } from 'boao-ui';

const workers = mockUsers(8);
const projects = mockProjects(8);
```

当前内置数据覆盖：

- 项目：住建项目、食品安全管理员项目、继续医学教育项目、睡眠技师项目、睡眠健康管理师项目、公共营养师项目、应急救援员项目等。
- 岗位：从业人员。
- 培训类型：职业培训、继续教育、专项能力提升。
- 人员信息：姓名、脱敏身份证号、脱敏手机号、工作单位、住址、头像、所属项目。

## 组件 Mock 用法

`Input` 支持业务占位符：

```tsx
<Input mock="name" />
<Input mock="phone" />
<Input mock="email" />
```

`Select` 支持自动加载项目、培训类型和状态选项：

```tsx
<Select mock />
<Select mock mockType="trainingType" />
<Select mock mockType="status" />
```

`SmartTable` 在 `mock={true}` 且没有外部 `data` 时，会先展示 Skeleton，再模拟接口延迟加载数据：

```tsx
<SmartTable mock mockType="user" />
<SmartTable mock mockType="project" />
```

`mockType="course"` 保留兼容旧用法，内部会使用项目数据。
