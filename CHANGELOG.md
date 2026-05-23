# Changelog

## 2026-05-24

### Added

- `DashboardTemplate` 新增 `pageType="finance"` 财务驾驶舱页面类型，复刻三栏金融运营看板布局，包含左侧导航、余额图表、预算建议、健康度、目标追踪、银行卡快捷操作和交易历史。
- `src/utils/mock.ts` 新增 `mockFinanceDashboardData()` 与对应类型，为财务驾驶舱提供可替换的中央 Mock 数据。

## 2026-05-23

### Added

- 新增全国行政区划基础设施 `src/utils/regions.ts`，提供核心省市区三级 Adcode 树、`getRegionPath()`、`getRegionValuePath()`、`getRegionOptions()` 和 `mockRegionValuePath()`。
- `Cascader` 新增 `type="region"` 与 `ba_region_level`，可在无需外部 options 时自动加载行政区划树，并按省/市/区裁剪选择深度。
- `Form` Schema 新增 `cascader` 字段消费能力，支持 `cascaderType="region"`，AI 一键填表可自动生成真实省市区 Adcode 路径并回显中文路径。
- 中央 Mock 引擎新增 `ba_region_scope` 属地上下文，`mockUsers()`、`mockCourses()`、`mockDashboardMetrics()`、`mockCertificate()` 和 `mockLearningProfile()` 可生成具备省份特征的人员、课程、证书和看板数据。
- 新增 `AccountSettingsPage` 账号设置模板页，聚合学员资料表单、岗位技能偏好、证书预览和学习档案。
- 新增 Ant Design 覆盖清单 `docs/ant-design-component-coverage.md`，按 Ant 6.4.3 组件总览记录 ETLCHINA UI 原子层覆盖状态、业务覆盖关系和后续建议。
- 新增一批通用/布局/导航/数据录入/数据展示/反馈/其他类原子组件：`Affix`、`Alert`、`Anchor`、`App`、`AutoComplete`、`BorderBeam`、`Breadcrumb`、`Calendar`、`ColorPicker`、`ConfigProvider`、`Descriptions`、`Divider`、`Drawer`、`Empty`、`Flex`、`FloatButton`、`Grid`、`InputNumber`、`Layout`、`Masonry`、`Mentions`、`Menu`、`Popconfirm`、`Rate`、`Result`、`Segmented`、`Space`、`Spin`、`Splitter`、`Steps`、`Table`、`Timeline`、`Tour`、`Tree`、`Typography` 和 `Watermark`。
- 新增纯 UI `Table`，支持中央 mock、选择列、排序、固定列、轻量虚拟窗口和展开行；`SmartTable` 继续保留搜索、筛选、分页和接口模拟等业务增强能力。
- 新增纯 UI `Transfer`，根入口以 `UiTransfer` 导出以避免破坏既有业务 `Transfer`；支持搜索、左右移动、拖拽选择、面板全选和 Shift 键区间选择。
- 新增 `Branding` 与 `Icons` 视觉基础组件，提供 ETLCHINA 品牌徽标、品牌背景层、水印和图标画廊 Storybook 验证场景。
- 新增 `StandardLoginPages` 通用登录页模板，支持 `tech`、`education`、`minimal`、`split-screen` 和 `classic` 五种行业风格，覆盖暗黑模式、AI 一键填表和表单校验后提交回调。
- 新增 `DashboardTemplate` 科技大屏模板页，支持 `mock={true}`、四格指标卡片和趋势分析图表占位。
- 新增 `CardGridPage` 卡片网格模板页，整合 `Form` 搜索、`Card` 网格、`Skeleton` 加载态和 `Pagination` 分页，支持 mock 一键填表联动骨架屏。
- 新增 Vite Library Mode 打包管道，输出 `dist/index.js`、`dist/index.cjs` 和 `vite-plugin-dts` 生成的完整类型声明。
- `src/utils/mock.ts` 新增 `mockLoginAccount()`、`mockDashboardMetrics()` 和 `mockCardGridItems()`，为登录页和模板页提供中央 Mock 数据。
- 新增 `src/components/ui/shared/logic.ts`，集中提供 `clampNumber()` 和 `hasChildItems()`，复用进度、分页和树形控件的边界逻辑。

### Changed

- `SmartTable`、`DashboardTemplate`、`CardGridPage`、`CertificateTemplate`、`LearningProfile` 和 `Form` 统一透传企业业务属性，支持培训项目、岗位、培训类型和属地范围联动清洗。
- Storybook 为核心组件和三大页面模板补充 `ba_region_scope` 控件，并新增 Cascader 行政区划选择走查场景。
- 公共入口补充导出 Ant 覆盖批次新增的原子组件，并将纯 UI Transfer 以 `UiTransfer`、`UiTransferItem` 和 `UiTransferProps` 暴露，保留业务 `Transfer` 默认导出兼容。
- `StandardLoginPages`、`DashboardTemplate`、`SmartTable` 和 `Upload` 接入品牌徽标、品牌背景或品牌水印，统一 Storybook 代表页面中的 ETLCHINA 视觉识别。
- `.gitignore` 增加 `.playwright-cli/`，避免本地浏览器冒烟日志目录进入版本库。
- 公共入口导出 `src/components/biz/login` 与 `src/components/biz/pages`，便于业务系统直接引用登录页与模板页。
- 公共入口补充导出 `cn`，并保持 UI、Biz、Page、Mock 与全国行政区划工具在 `src/index.ts` 下统一消费。
- `package.json` 调整为可发布组件库模板，补充 `main`、`module`、`types`、Conditional Exports、`files` 和 peerDependencies 分流。
- 公共样式 `uiStyles` 补充浮层容器、选项交互态、空态面板、图标占位、Card footer 和 placeholder 等 Tailwind 片段，减少 `src/components/ui/` 内重复类名。
- `Cascader`、`DateTimePicker`、`TreeSelect`、`Popover`、`Tooltip`、`Upload`、`Progress`、`Pagination` 和 `Card` 复用共享样式与轻量逻辑，保持原有 Props 和交互行为不变。
- `.gitignore` 增加 `.superpowers/`，避免本地 brainstorm/预览临时产物进入版本库。

## 2026-05-22

### Added

- 新增展示类组件 `Avatar`、`Badge`、`Card`、`Carousel`、`Image`、`List`、`Popover`、`QRCode`，覆盖头像、状态、卡片、轮播、图片增强、列表、气泡卡片和扫码业务场景。
- 新增运营展示组件 `Statistic`、`Tag`、`Progress`，支持趋势指标、可关闭标签、Radix Progress 进度条、暗黑模式和中央 Mock 驱动。
- `src/utils/mock.ts` 新增头像、统计指标、标签和培训进度相关 Mock 数据，支持展示类组件一键本地预览。
- 新增中央 Mock 数据工坊 `src/utils/mock.ts`，提供从业人员、培训项目、项目状态和培训类型等公司业务数据生成器。
- `Input`、`Select`、`SmartTable` 增加 Mock 驱动能力，支持本地生成项目、从业人员、脱敏手机号/身份证、头像和培训类型数据。
- 所有组件 Storybook 补充 `MockModeDemo`，用于展示组件在住建、食品安全管理员、继续医学教育、睡眠技师等业务场景下的真实预览。
- 新增 `Cascader` 级联选择器，支持 Radix Popover 多级浮层、完整路径回显、清除操作、暗黑模式和公司组织架构 Mock 数据。
- 新增 `DateTimePicker` 日期时间选择器，支持 date/time/datetime 三种模式、日历溢出日期、时间滚轮和培训排课场景 Mock 默认值。
- 新增 `Form` Schema 消费组件，支持 `input`、`select`、`switch`、`checkbox` 字段渲染和一键填表。
- 新增 `CheckboxGroup` 多选组，支持标准受控值数组、公司 IT 技术方向 Mock 选项和 Form 一键填表随机勾选。
- 新增 `Pagination` 分页组件，支持省略号页码、每页条数切换和暗黑模式。
- 新增 `Upload` 上传组件，支持拖拽、文件类型/大小校验、Mock 上传进度、自定义上传和成功 URL 回传。
- 新增 `NavMenu` 企业导航组件，支持横向/纵向布局、二级菜单、当前路径高亮和培训管理系统 Mock 菜单树。
- 新增 `Switch`、`Checkbox`、`RadioGroup` 表单增强类原子组件，统一导出并补充对应 Storybook stories。
- 新增表单控件 `focus-breathing-ring` 呼吸式聚焦环，支持浅色和暗黑模式下的环绕边框。
- 补充禁用态、选中态、暗黑模式高对比样式，以及对应 Vitest 覆盖。
- 新增 `Skeleton` 骨架屏组件，支持通过 `className` 自由组合圆形、矩形和表格占位形态。
- 新增 `Tooltip` 文字提示组件，提供现代大圆角、微弱阴影、边框和暗黑模式样式，并补充 Storybook 文档用例。
- 新增 `CertificateTemplate` 公司专属证书模板，支持学时证明、培训合格证明、继续教育学分证书三种类型、打印操作、黑金/暗银暗黑模式和防伪视觉占位。
- 新增 `LearningProfile` 综合学习档案业务组件，组合摘要看板、学习时间线、证书预览弹窗和 `SmartTable` 历史课程明细。
- `src/utils/mock.ts` 新增 `mockCertificate(type)` 与 `mockLearningProfile(studentId)`，用于 Storybook 和业务组件本地高保真演示。
- 新增 `Slider` 滑块组件，基于 Radix Slider 支持单值/范围受控值、拖拽数值气泡、暗黑模式和 Form 一键填表。
- 新增 `Transfer` 公司业务穿梭框，支持左右列表搜索、全选计数、方向迁移按钮、Mock 候选人数据和 Form schema 联动。
- 新增 `TreeSelect` 智能树选择器，支持 Radix Popover 浮层、多选 Tag、递归展开、父子全选/半选联动和全球组织架构 Mock 数据。
- `src/utils/mock.ts` 新增 `mockSliderValue()`、`mockTransferData()`、`mockTransferTargetKeys()`、`mockTreeData()` 和 `mockTreeSelectValue()`，覆盖滑块、穿梭框和树选择一键填表场景。

### Changed

- 公共样式 `uiStyles` 扩展 `textForeground`、`textMuted`、`panelSurface`、`surfaceShell`、`carouselArrowButton`、`iconGhostButton` 与 `uiStatusStyles`，集中管理状态色、趋势色、文本色和面板外壳，减少展示类组件重复 Tailwind 片段。
- 公共入口补充导出 `Avatar`、`Badge`、`Card`、`Carousel`、`Image`、`List`、`Popover`、`QRCode`、`Statistic`、`Tag` 和 `Progress`。
- 引入 Radix Avatar 与 Radix Progress 依赖，分别为头像加载兜底和进度条无障碍语义提供底座。
- 引入 `qrcode.react` 依赖，为证书校验和学员签到二维码提供轻量渲染能力。
- `SmartTable` 内置 Mock 表头从课程/学员口径调整为项目/从业人员口径，并保留 `mockType="course"` 与旧字段别名兼容。
- Mock 下拉选项从班级/课程状态调整为项目、培训类型和项目状态，更贴合公司培训项目管理业务。
- `Switch` 和 `Checkbox` 统一支持 `checked` / `onChange` 标准受控 Props，并保留 Radix 交互和无障碍语义。
- `Form` 学员档案 Storybook 用例新增“是否开通内网权限”和“选修技术方向”，用于验证开关、多选组和一键填表联动。
- 公共样式 `uiStyles` 补充浮层、菜单、按钮禁用态、选择控件和交互表面 token，减少组件内重复样式。
- 项目协作规则从 `.codexrules` 迁移到 `AGENTS.md`，并补充本地 Mock 驱动规范。
- 引入 Radix Switch、Checkbox、Radio Group 依赖，保持键盘交互、禁用语义和无障碍状态一致。
- 引入 Radix Tooltip 依赖，保持 hover、focus 和键盘无障碍提示语义一致。
- 引入 Radix Popover 依赖，为级联选择器和日期时间选择器提供浮层底座。
- 公共入口补充导出 `CertificateTemplate`、`LearningProfile`、`Cascader`、`DateTimePicker`、`Form`、`Pagination`、`Upload` 和 `NavMenu`，便于业务系统直接引用。
- `Form` Schema 消费链扩展 `slider`、`transfer` 和 `treeselect` 字段类型，学员档案 Storybook 增加薪资、分配学员和组织范围演示。
- `Checkbox` 受控 `checked` 支持 Radix `indeterminate` 状态，用于树选择器父节点半选展示。
- 公共入口补充导出 `Slider`、`Transfer` 和 `TreeSelect`。
- 引入 Radix Slider 依赖，保持滑块拖拽、键盘调节和无障碍状态一致。
