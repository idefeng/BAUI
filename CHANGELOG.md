# Changelog

## 2026-05-22

### Added

- 新增 `Switch`、`Checkbox`、`RadioGroup` 表单增强类原子组件，统一导出并补充对应 Storybook stories。
- 新增表单控件 `focus-breathing-ring` 呼吸式聚焦环，支持浅色和暗黑模式下的环绕边框。
- 补充禁用态、选中态、暗黑模式高对比样式，以及对应 Vitest 覆盖。
- 新增 `Skeleton` 骨架屏组件，支持通过 `className` 自由组合圆形、矩形和表格占位形态。
- 新增 `Tooltip` 文字提示组件，提供现代大圆角、微弱阴影、边框和暗黑模式样式，并补充 Storybook 文档用例。

### Changed

- 引入 Radix Switch、Checkbox、Radio Group 依赖，保持键盘交互、禁用语义和无障碍状态一致。
- 引入 Radix Tooltip 依赖，保持 hover、focus 和键盘无障碍提示语义一致。
