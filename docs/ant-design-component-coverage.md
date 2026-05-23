# Ant Design 组件覆盖清单

盘点来源：[Ant Design 组件总览](https://ant.design/components/overview-cn/)，当前页面版本为 `6.4.3`。本清单用于持续推进 ETLCHINA UI 原子组件补齐，不代表所有 Ant 组件都应按同名 API 复制；ETLCHINA UI 仍以企业培训业务组件库的语义、样式 token 和 mock 规范为准。

## 状态说明

- `已覆盖`：`src/components/ui` 已有同类原子组件。
- `业务覆盖`：已有业务组件覆盖主要使用场景，但未必是 Ant 同名原子 API。
- `本批新增`：本轮新增了组件实现、导出、测试和 Storybook。
- `待补齐`：后续应继续实现或拆分设计。
- `需决策`：不是纯原子组件，或需要先确认是否纳入 ETLCHINA UI 基础层。
- `不适用`：Ant 总览中的工具入口，不是可独立渲染的 ETLCHINA UI 组件。

## 覆盖表

| Ant 分组 | Ant 组件 | ETLCHINA UI 当前状态 | 对应路径或备注 |
| --- | --- | --- | --- |
| 通用 | Button | 已覆盖 | `src/components/ui/button` |
| 通用 | FloatButton | 本批新增 | `src/components/ui/float-button` |
| 通用 | Icon | 已覆盖 | `src/components/ui/icons` |
| 通用 | Typography | 本批新增 | `src/components/ui/typography` |
| 布局 | Divider | 本批新增 | `src/components/ui/divider` |
| 布局 | Flex | 本批新增 | `src/components/ui/flex` |
| 布局 | Grid | 本批新增 | `src/components/ui/grid` |
| 布局 | Layout | 本批新增 | `src/components/ui/layout` |
| 布局 | Masonry | 本批新增 | `src/components/ui/masonry` |
| 布局 | Space | 本批新增 | `src/components/ui/space` |
| 布局 | Splitter | 本批新增 | `src/components/ui/splitter` |
| 导航 | Anchor | 本批新增 | `src/components/ui/anchor` |
| 导航 | Breadcrumb | 本批新增 | `src/components/ui/breadcrumb` |
| 导航 | Dropdown | 已覆盖 | `src/components/ui/dropdown-menu` |
| 导航 | Menu | 本批新增 | `src/components/ui/menu` |
| 导航 | Pagination | 已覆盖 | `src/components/ui/pagination` |
| 导航 | Steps | 本批新增 | `src/components/ui/steps` |
| 导航 | Tabs | 已覆盖 | `src/components/ui/tabs` |
| 数据录入 | AutoComplete | 本批新增 | `src/components/ui/auto-complete` |
| 数据录入 | Cascader | 已覆盖 | `src/components/ui/cascader` |
| 数据录入 | Checkbox | 已覆盖 | `src/components/ui/checkbox` |
| 数据录入 | ColorPicker | 本批新增 | `src/components/ui/color-picker` |
| 数据录入 | DatePicker | 已覆盖 | `src/components/ui/date-time-picker` |
| 数据录入 | Form | 已覆盖 | `src/components/ui/form` |
| 数据录入 | Input | 已覆盖 | `src/components/ui/input` |
| 数据录入 | InputNumber | 本批新增 | `src/components/ui/input-number` |
| 数据录入 | Mentions | 本批新增 | `src/components/ui/mentions` |
| 数据录入 | Radio | 已覆盖 | `src/components/ui/radio-group` |
| 数据录入 | Rate | 本批新增 | `src/components/ui/rate` |
| 数据录入 | Select | 已覆盖 | `src/components/ui/select` |
| 数据录入 | Slider | 已覆盖 | `src/components/ui/slider` |
| 数据录入 | Switch | 已覆盖 | `src/components/ui/switch` |
| 数据录入 | TimePicker | 已覆盖 | `src/components/ui/date-time-picker` |
| 数据录入 | Transfer | 本批新增 | `src/components/ui/transfer`；根入口以 `UiTransfer` 导出以保留业务 `Transfer` 兼容；已补拖拽选择、面板内全选与 Shift 键区间选择 |
| 数据录入 | TreeSelect | 已覆盖 | `src/components/ui/tree-select` |
| 数据录入 | Upload | 已覆盖 | `src/components/ui/upload` |
| 数据展示 | Avatar | 已覆盖 | `src/components/ui/avatar` |
| 数据展示 | Badge | 已覆盖 | `src/components/ui/badge` |
| 数据展示 | Calendar | 本批新增 | `src/components/ui/calendar` |
| 数据展示 | Card | 已覆盖 | `src/components/ui/card` |
| 数据展示 | Carousel | 已覆盖 | `src/components/ui/carousel` |
| 数据展示 | Collapse | 已覆盖 | `src/components/ui/accordion` |
| 数据展示 | Descriptions | 本批新增 | `src/components/ui/descriptions` |
| 数据展示 | Empty | 本批新增 | `src/components/ui/empty` |
| 数据展示 | Image | 已覆盖 | `src/components/ui/image` |
| 数据展示 | List | 已覆盖 | `src/components/ui/list` |
| 数据展示 | Popover | 已覆盖 | `src/components/ui/popover` |
| 数据展示 | QRCode | 已覆盖 | `src/components/ui/qrcode` |
| 数据展示 | Segmented | 本批新增 | `src/components/ui/segmented` |
| 数据展示 | Statistic | 已覆盖 | `src/components/ui/statistic` |
| 数据展示 | Table | 本批新增 | `src/components/ui/table`；`src/components/biz/smart-table` 继续保留业务增强表格；已补排序、固定列、轻量虚拟窗口与展开行 |
| 数据展示 | Tag | 已覆盖 | `src/components/ui/tag` |
| 数据展示 | Timeline | 本批新增 | `src/components/ui/timeline` |
| 数据展示 | Tooltip | 已覆盖 | `src/components/ui/tooltip` |
| 数据展示 | Tour | 本批新增 | `src/components/ui/tour` |
| 数据展示 | Tree | 本批新增 | `src/components/ui/tree` |
| 反馈 | Alert | 本批新增 | `src/components/ui/alert` |
| 反馈 | Drawer | 本批新增 | `src/components/ui/drawer` |
| 反馈 | Message | 已覆盖 | `src/components/ui/toast` |
| 反馈 | Modal | 已覆盖 | `src/components/ui/modal` |
| 反馈 | Notification | 已覆盖 | `src/components/ui/toast` |
| 反馈 | Popconfirm | 本批新增 | `src/components/ui/popconfirm` |
| 反馈 | Progress | 已覆盖 | `src/components/ui/progress` |
| 反馈 | Result | 本批新增 | `src/components/ui/result` |
| 反馈 | Skeleton | 已覆盖 | `src/components/ui/skeleton` |
| 反馈 | Spin | 本批新增 | `src/components/ui/spin` |
| 反馈 | Watermark | 本批新增 | `src/components/ui/watermark` |
| 其他 | Affix | 本批新增 | `src/components/ui/affix` |
| 其他 | App | 本批新增 | `src/components/ui/app` |
| 其他 | BorderBeam | 本批新增 | `src/components/ui/border-beam` |
| 其他 | ConfigProvider | 本批新增 | `src/components/ui/config-provider` |
| 其他 | Util | 不适用 | 已有 `src/lib/utils.ts` 与 `src/utils/mock.ts`，不作为可渲染组件复制 |

## 下一批建议

优先级建议按业务频率和实现风险排序：

1. `Util` 继续保持工具函数导出，不新增伪组件目录。
2. 后续如继续扩展 `Table`，优先评估列分组、列宽拖拽等会影响表头布局的纯 UI 能力，实施前先锁定兼容的表头数据结构。
3. `Table` / `UiTransfer` 已经完成排序、固定列、轻量虚拟窗口、展开行、拖拽选择、面板全选和 Shift 键区间选择，后续仍不把业务搜索、接口请求、分页工具栏放回原子层。
