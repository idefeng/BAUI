# ETLCHINA UI

ETLCHINA UI 是面向公司业务系统的 React + Tailwind 组件库，当前以 Storybook 作为主要预览和验收入口。

## 开发命令

```bash
npm run storybook
npm run test:run
npm run typecheck
npm run build
npm run build-storybook
```

## 工程文档

- [版本管理与工程打包指南](docs/version-management-and-packaging.md)

## 库构建与本地消费联调

ETLCHINA UI 使用 Vite Library Mode 打包，入口为 `src/index.ts`，构建后输出 ESM、CommonJS 和完整类型声明：

```bash
npm run build
```

产物入口：

- ESM：`dist/index.js`
- CommonJS：`dist/index.cjs`
- 类型声明：`dist/index.d.ts`

本地消费项目联调建议走 tarball，能更接近真实 npm 安装：

```bash
npm pack
cd /path/to/consumer-app
npm install /Users/idefeng/Documents/BAUI/etlchina-ui-0.1.0.tgz
```

调用方需要提供 React、Tailwind CSS 和 Radix 底座依赖。Tailwind 配置最小示例：

```ts
import etlChinaTailwindConfig from 'etlchina-ui/tailwind.config';

export default {
  presets: [etlChinaTailwindConfig],
  content: ['./src/**/*.{ts,tsx}', './node_modules/etlchina-ui/dist/**/*.{js,cjs}'],
};
```

业务入口快速冒烟：

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

## Mock 数据工坊

中央 Mock 数据位于 `src/utils/mock.ts`，用于让业务组件在没有后端接口时也能展示高保真数据。

```tsx
import {
  Cascader,
  Avatar,
  Badge,
  Card,
  Carousel,
  CheckboxGroup,
  Image,
  List,
  Popover,
  Progress,
  QRCode,
  DateTimePicker,
  Form,
  StandardLoginPages,
  DashboardTemplate,
  CardGridPage,
  LearningProfile,
  SmartTable,
  Slider,
  Statistic,
  Tag,
  Transfer,
  TreeSelect,
  mockLearningProfile,
  mockLoginAccount,
  mockDashboardMetrics,
  mockCardGridItems,
  getRegionPath,
  getRegionOptions,
  mockProgress,
  mockProjects,
  mockCourses,
  mockStatistic,
  mockTags,
  mockTreeData,
  mockUsers,
} from 'etlchina-ui';

const workers = mockUsers(8);
const projects = mockProjects(8);
const guangdongCourses = mockCourses(4, { ba_region_scope: '440000' });
const profile = mockLearningProfile('student-it-001');
const loginAccount = mockLoginAccount();
const dashboardMetrics = mockDashboardMetrics();
const cardGridItems = mockCardGridItems(12);
const organizationTree = mockTreeData();
const metric = mockStatistic();
const tags = mockTags();
const progress = mockProgress();
const regionPath = getRegionPath('440106'); // ['广东省', '广州市', '天河区']
const cityRegionOptions = getRegionOptions('CITY');
```

当前内置数据覆盖：

- 项目：住建项目、食品安全管理员项目、继续医学教育项目、睡眠技师项目、睡眠健康管理师项目、公共营养师项目、应急救援员项目等。
- 岗位：从业人员。
- 培训类型：职业培训、继续教育、专项能力提升。
- 人员信息：姓名、脱敏身份证号、脱敏手机号、工作单位、住址、头像、所属项目。
- 证书与学习档案：学时证明、培训合格证明、继续教育学分证书，以及 IT 培训成长轨迹。
- 登录与模板页：多行业登录账号、科技大屏指标和项目卡片流。
- 表单提效：公司组织架构级联、全国行政区划级联、全球组织架构树、IT 技术方向、培训排课未来时间、候选人穿梭和滑块数值等高保真 Mock 场景。
- 展示组件：学员头像、运营指标、业务标签、培训进度、二维码签到和课程海报等本地 Mock 预览场景。

## 企业业务属性与属地数据

核心业务组件支持可选企业业务属性。非法培训属性会被中央 Mock 引擎擦除；非法 `ba_region_scope` 会因无法命中 Region Base 而降级为未设置。

```tsx
<SmartTable
  mock
  mockType="user"
  ba_training_project="ETLCHINA-2026-AI"
  ba_trainning_title="AI-AGENT-ENGINEER"
  ba_trainning_type="CONTINUING-EDUCATION"
  ba_region_scope="440000"
/>
```

`ba_region_scope="440000"` 会让人员住址、所属分部、手机号段、课程前缀和 Dashboard 指标切换为广东属地语义。

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

`StandardLoginPages` 提供多种行业登录页门面，包含账号密码、分屏品牌页和 OTP 免密登录。`mock={true}` 时会填入中央 mock 账号或演示联系人：

```tsx
<StandardLoginPages
  type="tech"
  mock
  onSubmit={(values) => console.log(values.username, values.password, values.role)}
/>
<StandardLoginPages
  type="otp"
  mock
  onSubmit={(values) => console.log(values.contact, values.otp)}
/>
```

`DashboardTemplate` 和 `CardGridPage` 面向业务模板页预览；其中 `CardGridPage` 的表单一键填表会联动下方卡片流 Skeleton 加载态：

```tsx
<DashboardTemplate mock />
<DashboardTemplate mock pageType="finance" />
<CardGridPage mock />
```

`Cascader` 支持公司组织架构 mock，也支持 `type="region"` 自动加载全国行政区划树；`ba_region_level="CITY"` 会在市级断开，不允许继续选区县：

```tsx
<Cascader mock placeholder="请选择组织架构" onChange={(path) => console.log(path)} />
<Cascader type="region" ba_region_level="CITY" placeholder="请选择省市" onChange={(path) => console.log(path)} />
```

`DateTimePicker`、`CheckboxGroup`、`Slider`、`Transfer` 和 `TreeSelect` 支持 `mock={true}`，可直接走查排课时间、技术方向多选、滑块填值、穿梭搬运和组织树父子联动：

```tsx
<DateTimePicker type="datetime" mock onChange={(value) => console.log(value)} />
<CheckboxGroup mock value={['frontend']} onChange={(value) => console.log(value)} />
<Slider min={8000} max={20000} step={1000} value={12000} onChange={(value) => console.log(value)} />
<Transfer mock targetKeys={[]} onChange={(keys) => console.log(keys)} />
<TreeSelect mock value={[]} onChange={(keys) => console.log(keys)} />
```

`Avatar`、`Statistic`、`Tag` 和 `Progress` 支持 `mock={true}`，适合在 Card、SmartTable 或控制台看板里快速预览展示态：

```tsx
<Avatar mock />
<Statistic mock />
<Tag mock closable onClose={() => console.log('close')} />
<Progress mock animated />
```

展示类组件可直接组合业务场景：

```tsx
<Card>
  <Statistic title="本周新增学员" value={1286} suffix="人" trend="up" trendText="同比 +12.6%" />
  <Progress label="课程平均完成率" value={76} />
  <Tag variant="success">已通过</Tag>
</Card>
```

`Form` 支持 Schema 驱动消费 `input`、`select`、`switch`、`checkbox`、`slider`、`transfer`、`treeselect` 和 `cascader`，并可用一键填表验证 Mock 链路：

```tsx
<Form
  schema={[
    { name: 'name', label: '学员姓名', type: 'input', mock: 'name' },
    { name: 'intranet', label: '是否开通内网权限', type: 'switch', mock: true },
    { name: 'directions', label: '选修技术方向', type: 'checkbox', mock: true },
    { name: 'salary', label: '期望薪资', type: 'slider', min: 8000, max: 20000, step: 1000 },
    { name: 'learners', label: '分配学员', type: 'transfer', mock: true },
    { name: 'orgScope', label: '组织范围', type: 'treeselect', mock: true },
    { name: 'homeRegion', label: '家庭住址', type: 'cascader', cascaderType: 'region', ba_region_level: 'DISTRICT' },
  ]}
/>
```

## Ant Design 覆盖推进

组件覆盖盘点记录在 `docs/ant-design-component-coverage.md`。ETLCHINA UI 不按 Ant Design API 逐字复制，而是按企业培训业务组件库的原子层、业务层和品牌视觉边界做兼容实现。

当前新增覆盖包含：

- 通用与布局：`FloatButton`、`Typography`、`Divider`、`Flex`、`Grid`、`Layout`、`Masonry`、`Space`、`Splitter`。
- 导航与数据录入：`Anchor`、`Breadcrumb`、`Menu`、`Steps`、`AutoComplete`、`ColorPicker`、`InputNumber`、`Mentions`、`Rate`、`UiTransfer`。
- 数据展示：`Calendar`、`Descriptions`、`Empty`、`Segmented`、`Table`、`Timeline`、`Tour`、`Tree`。
- 反馈与其他：`Alert`、`Drawer`、`Popconfirm`、`Result`、`Spin`、`Watermark`、`Affix`、`App`、`ConfigProvider`、`BorderBeam`。
- 品牌基础：`Branding`、`Icons` 为登录页、Dashboard、SmartTable 空态和 Upload 提供统一 ETLCHINA 视觉元素。

纯 UI `Table` 和业务 `SmartTable` 分层使用：`Table` 负责排序、固定列、虚拟窗口和展开行；`SmartTable` 继续负责搜索、筛选、分页、动作按钮和接口模拟。根入口保留业务 `Transfer`，纯 UI 穿梭框通过 `UiTransfer` 导出。
