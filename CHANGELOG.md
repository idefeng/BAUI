# Changelog

## 2026-05-22

### Added

- 新增中央 Mock 数据工坊 `src/utils/mock.ts`，提供从业人员、培训项目、项目状态和培训类型等公司业务数据生成器。
- `Input`、`Select`、`SmartTable` 增加 Mock 驱动能力，支持本地生成项目、从业人员、脱敏手机号/身份证、头像和培训类型数据。
- 所有组件 Storybook 补充 `MockModeDemo`，用于展示组件在住建、食品安全管理员、继续医学教育、睡眠技师等业务场景下的真实预览。
- 新增 `Switch`、`Checkbox`、`RadioGroup` 表单增强类原子组件，统一导出并补充对应 Storybook stories。
- 新增表单控件 `focus-breathing-ring` 呼吸式聚焦环，支持浅色和暗黑模式下的环绕边框。
- 补充禁用态、选中态、暗黑模式高对比样式，以及对应 Vitest 覆盖。
- 新增 `Skeleton` 骨架屏组件，支持通过 `className` 自由组合圆形、矩形和表格占位形态。
- 新增 `Tooltip` 文字提示组件，提供现代大圆角、微弱阴影、边框和暗黑模式样式，并补充 Storybook 文档用例。
- 新增 `CertificateTemplate` 公司专属证书模板，支持学时证明、培训合格证明、继续教育学分证书三种类型、打印操作、黑金/暗银暗黑模式和防伪视觉占位。
- 新增 `LearningProfile` 综合学习档案业务组件，组合摘要看板、学习时间线、证书预览弹窗和 `SmartTable` 历史课程明细。
- `src/utils/mock.ts` 新增 `mockCertificate(type)` 与 `mockLearningProfile(studentId)`，用于 Storybook 和业务组件本地高保真演示。

### Changed

- `SmartTable` 内置 Mock 表头从课程/学员口径调整为项目/从业人员口径，并保留 `mockType="course"` 与旧字段别名兼容。
- Mock 下拉选项从班级/课程状态调整为项目、培训类型和项目状态，更贴合公司培训项目管理业务。
- 引入 Radix Switch、Checkbox、Radio Group 依赖，保持键盘交互、禁用语义和无障碍状态一致。
- 引入 Radix Tooltip 依赖，保持 hover、focus 和键盘无障碍提示语义一致。
- 公共入口补充导出 `CertificateTemplate` 与 `LearningProfile`，便于业务系统直接引用。
