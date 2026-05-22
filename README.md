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
import {
  Cascader,
  CheckboxGroup,
  DateTimePicker,
  Form,
  LearningProfile,
  SmartTable,
  Slider,
  Transfer,
  TreeSelect,
  mockLearningProfile,
  mockProjects,
  mockTreeData,
  mockUsers,
} from 'boao-ui';

const workers = mockUsers(8);
const projects = mockProjects(8);
const profile = mockLearningProfile('student-it-001');
const organizationTree = mockTreeData();
```

当前内置数据覆盖：

- 项目：住建项目、食品安全管理员项目、继续医学教育项目、睡眠技师项目、睡眠健康管理师项目、公共营养师项目、应急救援员项目等。
- 岗位：从业人员。
- 培训类型：职业培训、继续教育、专项能力提升。
- 人员信息：姓名、脱敏身份证号、脱敏手机号、工作单位、住址、头像、所属项目。
- 证书与学习档案：学时证明、培训合格证明、继续教育学分证书，以及 IT 培训成长轨迹。
- 表单提效：公司组织架构级联、全球组织架构树、IT 技术方向、培训排课未来时间、候选人穿梭和滑块数值等高保真 Mock 场景。

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

`CertificateTemplate` 支持三种证书类型，并可在浏览器内调用原生打印：

```tsx
<CertificateTemplate type="qualified" mock />
```

`LearningProfile` 会在 `mock={true}` 时展示 600ms Skeleton，然后渲染摘要看板、学习时间线、证书预览弹窗和历史课程 `SmartTable`：

```tsx
<LearningProfile studentId="student-it-001" mock />
```

`Cascader`、`DateTimePicker`、`CheckboxGroup`、`Slider`、`Transfer` 和 `TreeSelect` 支持 `mock={true}`，可直接走查三级联动、排课时间、技术方向多选、滑块填值、穿梭搬运和组织树父子联动：

```tsx
<Cascader mock placeholder="请选择组织架构" onChange={(path) => console.log(path)} />
<DateTimePicker type="datetime" mock onChange={(value) => console.log(value)} />
<CheckboxGroup mock value={['frontend']} onChange={(value) => console.log(value)} />
<Slider min={8000} max={20000} step={1000} value={12000} onChange={(value) => console.log(value)} />
<Transfer mock targetKeys={[]} onChange={(keys) => console.log(keys)} />
<TreeSelect mock value={[]} onChange={(keys) => console.log(keys)} />
```

`Form` 支持 Schema 驱动消费 `input`、`select`、`switch`、`checkbox`、`slider`、`transfer` 和 `treeselect`，并可用一键填表验证 Mock 链路：

```tsx
<Form
  schema={[
    { name: 'name', label: '学员姓名', type: 'input', mock: 'name' },
    { name: 'intranet', label: '是否开通内网权限', type: 'switch', mock: true },
    { name: 'directions', label: '选修技术方向', type: 'checkbox', mock: true },
    { name: 'salary', label: '期望薪资', type: 'slider', min: 8000, max: 20000, step: 1000 },
    { name: 'learners', label: '分配学员', type: 'transfer', mock: true },
    { name: 'orgScope', label: '组织范围', type: 'treeselect', mock: true },
  ]}
/>
```
