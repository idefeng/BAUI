// 样式合并工具作为组件库公共入口，方便业务项目统一消费 Tailwind className 合并规则。
export { cn } from './lib/utils';

// UI 原子组件导出区。
export * from './components/ui/button';
export * from './components/ui/accordion';
export * from './components/ui/affix';
export * from './components/ui/alert';
export * from './components/ui/anchor';
export * from './components/ui/app';
export * from './components/ui/auto-complete';
export * from './components/ui/avatar';
export * from './components/ui/badge';
export * from './components/ui/border-beam';
export * from './components/ui/breadcrumb';
export * from './components/ui/branding';
export * from './components/ui/calendar';
export * from './components/ui/cascader';
export * from './components/ui/card';
export * from './components/ui/carousel';
export * from './components/ui/checkbox';
export * from './components/ui/color-picker';
export * from './components/ui/config-provider';
export * from './components/ui/date-time-picker';
export * from './components/ui/descriptions';
export * from './components/ui/divider';
export * from './components/ui/drawer';
export * from './components/ui/dropdown-menu';
export * from './components/ui/empty';
export * from './components/ui/flex';
export * from './components/ui/float-button';
export * from './components/ui/form';
export * from './components/ui/grid';
export * from './components/ui/image';
export * from './components/ui/input';
export * from './components/ui/input-number';
export * from './components/ui/icons';
export * from './components/ui/layout';
export * from './components/ui/list';
export * from './components/ui/masonry';
export * from './components/ui/modal';
export * from './components/ui/mentions';
export * from './components/ui/menu';
export * from './components/ui/pagination';
export * from './components/ui/popover';
export * from './components/ui/popconfirm';
export * from './components/ui/progress';
export * from './components/ui/qrcode';
export * from './components/ui/radio-group';
export * from './components/ui/rate';
export * from './components/ui/result';
export * from './components/ui/segmented';
export * from './components/ui/select';
export * from './components/ui/skeleton';
export * from './components/ui/slider';
export * from './components/ui/space';
export * from './components/ui/spin';
export * from './components/ui/splitter';
export * from './components/ui/statistic';
export * from './components/ui/steps';
export * from './components/ui/switch';
export * from './components/ui/tabs';
export * from './components/ui/table';
export * from './components/ui/tag';
export * from './components/ui/theme-toggle';
export * from './components/ui/timeline';
export * from './components/ui/tooltip';
export * from './components/ui/toast';
export * from './components/ui/tour';
export * from './components/ui/tree';
export * from './components/ui/tree-select';
export * from './components/ui/typography';
export * from './components/ui/upload';
export {
  Transfer as UiTransfer,
  type TransferItem as UiTransferItem,
  type TransferProps as UiTransferProps,
} from './components/ui/transfer';
export * from './components/ui/watermark';

// Biz 业务组件与页面模板导出区。
export * from './components/biz/certificate';
export * from './components/biz/hub';
export * from './components/biz/login';
export * from './components/biz/navigation';
export * from './components/biz/pages';
export * from './components/biz/profile';
export * from './components/biz/smart-table';
export * from './components/biz/transfer';
export * from './components/biz/demo-studio';

// 企业业务属性、Mock 造血机和全国行政区划基础设施导出区。
export * from './utils/mock';
export * from './utils/regions';
