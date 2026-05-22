import * as React from 'react';
import { Inbox, LoaderCircle, Plus, Search } from 'lucide-react';

import { cn } from '../../../lib/utils';
import { Button, type ButtonVariant } from '../../ui/button';
import { Input } from '../../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { uiStyles } from '../../ui/shared/styles';

export type SmartTableRowKey = string | number;
export type SmartTableSelectionMode = 'multiple' | 'single';
export type SmartTableAlign = 'left' | 'center' | 'right';

export interface SmartTableColumn<T extends object> {
  /** 列唯一标识，用于渲染 key 和配置列宽。 */
  key: string;
  /** 表头标题。 */
  title: React.ReactNode;
  /** 数据字段名；不传时需使用 render 自定义渲染。 */
  dataIndex?: keyof T;
  /** 列宽，支持数字像素值或 CSS 宽度字符串。 */
  width?: number | string;
  /** 文本对齐方式。 */
  align?: SmartTableAlign;
  /** 是否对单元格内容启用单行省略。 */
  ellipsis?: boolean;
  /** 自定义单元格渲染函数。 */
  render?: (value: T[keyof T] | undefined, record: T, index: number) => React.ReactNode;
  /** 表头额外类名。 */
  headerClassName?: string;
  /** 单元格额外类名。 */
  className?: string;
}

export interface SmartTableFilterOption {
  /** 筛选项展示文本。 */
  label: string;
  /** 筛选项值。 */
  value: string;
}

export interface SmartTablePagination {
  /** 当前页码，从 1 开始。 */
  page: number;
  /** 每页条数。 */
  pageSize: number;
  /** 总条数。 */
  total: number;
}

export interface SmartTableProps<T extends object> {
  /** 表格列配置。 */
  columns: SmartTableColumn<T>[];
  /** 当前页数据，通常由外部 API 请求后传入。 */
  data: T[];
  /** 行唯一键字段或生成函数。 */
  rowKey: keyof T | ((record: T) => SmartTableRowKey);
  /** 是否显示加载遮罩。 */
  loading?: boolean;
  /** 是否开启行选择。 */
  selectable?: boolean;
  /** 选择模式：multiple 支持全选，single 使用单选。 */
  selectionMode?: SmartTableSelectionMode;
  /** 受控选中行 key。 */
  selectedRowKeys?: SmartTableRowKey[];
  /** 非受控初始选中行 key。 */
  defaultSelectedRowKeys?: SmartTableRowKey[];
  /** 选中变化回调。 */
  onSelectionChange?: (selectedRowKeys: SmartTableRowKey[], selectedRows: T[]) => void;
  /** 搜索框值。 */
  searchValue?: string;
  /** 是否展示顶部搜索框。 */
  searchable?: boolean;
  /** 搜索框变化回调。 */
  onSearchChange?: (value: string) => void;
  /** 搜索框占位文本。 */
  searchPlaceholder?: string;
  /** 筛选 Select 当前值。 */
  filterValue?: string;
  /** 筛选项列表；为空时不展示 Select。 */
  filterOptions?: SmartTableFilterOption[];
  /** 筛选变化回调。 */
  onFilterChange?: (value: string) => void;
  /** 筛选 Select 占位文本。 */
  filterPlaceholder?: string;
  /** 右侧操作按钮文案。 */
  actionLabel?: string;
  /** 右侧操作按钮点击回调。 */
  onAction?: () => void;
  /** 右侧操作按钮图标。 */
  actionIcon?: React.ReactNode;
  /** 右侧操作按钮视觉层级。 */
  actionVariant?: ButtonVariant;
  /** 分页配置；不传则隐藏分页器。 */
  pagination?: SmartTablePagination;
  /** 分页变化回调。 */
  onPageChange?: (page: number, pageSize: number) => void;
  /** 表格主体最大高度，超过后内部滚动。 */
  maxBodyHeight?: number | string;
  /** 空状态文案。 */
  emptyText?: string;
  /** 根容器类名。 */
  className?: string;
  /** 表格元素类名。 */
  tableClassName?: string;
}

const getStyleSize = (value: number | string | undefined) => {
  if (typeof value === 'number') {
    return `${value}px`;
  }

  return value;
};

const getPageNumbers = (page: number, pageCount: number) => {
  const start = Math.max(1, Math.min(page - 2, pageCount - 4));
  const end = Math.min(pageCount, start + 4);

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
};

const getDefaultCellValue = <T extends object>(record: T, column: SmartTableColumn<T>) => {
  if (!column.dataIndex) {
    return undefined;
  }

  return record[column.dataIndex];
};

export function SmartTable<T extends object>({
  actionIcon = <Plus />,
  actionLabel,
  actionVariant = 'solid',
  className,
  columns,
  data,
  defaultSelectedRowKeys = [],
  emptyText = '暂无数据',
  filterOptions = [],
  filterPlaceholder = '请选择筛选条件',
  filterValue,
  loading = false,
  maxBodyHeight = 'min(56vh, 640px)',
  onAction,
  onFilterChange,
  onPageChange,
  onSearchChange,
  onSelectionChange,
  pagination,
  rowKey,
  searchable = true,
  searchPlaceholder = '搜索关键词',
  searchValue,
  selectable = false,
  selectedRowKeys,
  selectionMode = 'multiple',
  tableClassName,
}: SmartTableProps<T>) {
  const [innerSelectedKeys, setInnerSelectedKeys] = React.useState<SmartTableRowKey[]>(defaultSelectedRowKeys);
  const isSelectionControlled = selectedRowKeys !== undefined;
  const currentSelectedKeys = isSelectionControlled ? selectedRowKeys : innerSelectedKeys;
  const pageCount = pagination ? Math.max(1, Math.ceil(pagination.total / pagination.pageSize)) : 0;
  const shouldShowToolbar = searchable || filterOptions.length > 0 || actionLabel;

  const getRecordKey = React.useCallback(
    (record: T) => {
      if (typeof rowKey === 'function') {
        return rowKey(record);
      }

      return record[rowKey] as SmartTableRowKey;
    },
    [rowKey],
  );

  const updateSelectedKeys = (nextKeys: SmartTableRowKey[]) => {
    if (!isSelectionControlled) {
      setInnerSelectedKeys(nextKeys);
    }

    const nextRows = data.filter((record) => nextKeys.includes(getRecordKey(record)));
    onSelectionChange?.(nextKeys, nextRows);
  };

  const rowKeys = data.map(getRecordKey);
  const selectedKeySet = new Set(currentSelectedKeys);
  const isEveryCurrentPageSelected = rowKeys.length > 0 && rowKeys.every((key) => selectedKeySet.has(key));

  const handleToggleAll = () => {
    if (isEveryCurrentPageSelected) {
      updateSelectedKeys(currentSelectedKeys.filter((key) => !rowKeys.includes(key)));
      return;
    }

    updateSelectedKeys(Array.from(new Set([...currentSelectedKeys, ...rowKeys])));
  };

  const handleToggleRow = (record: T) => {
    const key = getRecordKey(record);

    if (selectionMode === 'single') {
      updateSelectedKeys([key]);
      return;
    }

    updateSelectedKeys(selectedKeySet.has(key) ? currentSelectedKeys.filter((item) => item !== key) : [...currentSelectedKeys, key]);
  };

  const handlePageChange = (page: number) => {
    if (!pagination || page < 1 || page > pageCount || page === pagination.page) {
      return;
    }

    onPageChange?.(page, pagination.pageSize);
  };

  return (
    <section
      data-testid="smart-table-root"
      className={cn(
        'flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-button dark:border-border-dark dark:bg-surface-dark',
        className,
      )}
    >
      {shouldShowToolbar ? (
        <div className="flex flex-col gap-3 border-b border-border p-4 dark:border-border-dark lg:flex-row lg:items-center lg:justify-between">
          <div className="grid flex-1 grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_14rem]">
            {searchable ? (
              <Input
                aria-label="搜索表格数据"
                clearable
                prefixIcon={<Search />}
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(event) => onSearchChange?.(event.currentTarget.value)}
                onClear={() => onSearchChange?.('')}
              />
            ) : null}
            {filterOptions.length > 0 ? (
              <Select value={filterValue} onValueChange={onFilterChange}>
                <SelectTrigger aria-label="筛选表格数据">
                  <SelectValue placeholder={filterPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : null}
          </div>
          {actionLabel ? (
            <Button className="shrink-0" leftIcon={actionIcon} variant={actionVariant} onClick={onAction}>
              {actionLabel}
            </Button>
          ) : null}
        </div>
      ) : null}

      <div className="relative">
        <div className="overflow-auto" style={{ maxHeight: getStyleSize(maxBodyHeight) }}>
          <table className={cn('w-full table-fixed border-separate border-spacing-0 text-left text-sm', tableClassName)}>
            <thead className="sticky top-0 z-10 bg-secondary text-xs font-medium text-muted-foreground dark:bg-secondary-dark dark:text-muted-dark-foreground">
              <tr role="row" className="border-b border-border dark:border-border-dark">
                {selectable ? (
                  <th className="w-12 border-b border-border px-4 py-3 dark:border-border-dark">
                    {selectionMode === 'multiple' ? (
                      <input
                        type="checkbox"
                        aria-label="选择全部当前页数据"
                        checked={isEveryCurrentPageSelected}
                        onChange={handleToggleAll}
                        className="size-4 rounded border-border accent-primary dark:border-border-dark dark:accent-primary-dark"
                      />
                    ) : null}
                  </th>
                ) : null}
                {columns.map((column) => (
                  <th
                    key={column.key}
                    style={{ width: getStyleSize(column.width) }}
                    className={cn('border-b border-border px-4 py-3 font-medium dark:border-border-dark', column.headerClassName)}
                  >
                    <span className={cn('block truncate', column.align === 'center' && 'text-center', column.align === 'right' && 'text-right')}>
                      {column.title}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((record, rowIndex) => {
                const key = getRecordKey(record);
                const rowLabel = String(getDefaultCellValue(record, columns[0]) ?? key);
                const isSelected = selectedKeySet.has(key);

                return (
                  <tr
                    key={key}
                    role="row"
                    className={cn(
                      'group transition-colors hover:bg-primary-soft/60 dark:hover:bg-primary-dark-soft/45',
                      isSelected && 'bg-primary-soft/70 dark:bg-primary-dark-soft/60',
                    )}
                  >
                    {selectable ? (
                      <td className="border-b border-border px-4 py-3 align-middle dark:border-border-dark">
                        <input
                          type={selectionMode === 'single' ? 'radio' : 'checkbox'}
                          aria-label={`选择 ${rowLabel}`}
                          checked={isSelected}
                          onChange={() => handleToggleRow(record)}
                          className="size-4 rounded border-border accent-primary dark:border-border-dark dark:accent-primary-dark"
                        />
                      </td>
                    ) : null}
                    {columns.map((column) => {
                      const value = getDefaultCellValue(record, column);
                      const content = column.render ? column.render(value, record, rowIndex) : (value as React.ReactNode);

                      return (
                        <td
                          key={column.key}
                          className={cn(
                            'border-b border-border px-4 py-3 align-middle text-foreground dark:border-border-dark dark:text-foreground-dark',
                            column.align === 'center' && 'text-center',
                            column.align === 'right' && 'text-right',
                            column.className,
                          )}
                        >
                          <div className={cn('min-w-0', column.ellipsis !== false && 'truncate')}>{content}</div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {data.length === 0 && !loading ? (
          <div
            data-testid="smart-table-empty"
            className="flex min-h-72 flex-col items-center justify-center gap-3 p-8 text-center dark:bg-surface-dark"
          >
            <div className="relative flex size-24 items-center justify-center rounded-3xl bg-primary-soft text-primary dark:bg-primary-dark-soft dark:text-primary-dark">
              <div className="absolute inset-3 rounded-2xl border border-primary/20 dark:border-primary-dark/30" />
              <Inbox className="size-10" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground dark:text-foreground-dark">{emptyText}</p>
              <p className="text-sm text-muted-foreground dark:text-muted-dark-foreground">调整搜索或筛选条件后再试试</p>
            </div>
          </div>
        ) : null}

        {loading ? (
          <div
            data-testid="smart-table-loading"
            className="absolute inset-0 z-20 flex items-center justify-center bg-surface/70 backdrop-blur-sm dark:bg-background-dark/70"
          >
            <div className="inline-flex items-center gap-3 rounded-2xl border border-border bg-surface px-5 py-3 text-sm font-medium text-primary shadow-button dark:border-border-dark dark:bg-surface-dark dark:text-primary-dark">
              <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
              加载中
            </div>
          </div>
        ) : null}
      </div>

      {pagination ? (
        <div className="flex flex-col gap-3 border-t border-border px-4 py-3 text-sm text-muted-foreground dark:border-border-dark dark:text-muted-dark-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>
            共 <span className="font-medium text-foreground dark:text-foreground-dark">{pagination.total}</span> 条数据
          </span>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={pagination.page <= 1}
              onClick={() => handlePageChange(pagination.page - 1)}
            >
              上一页
            </Button>
            {getPageNumbers(pagination.page, pageCount).map((pageNumber) => (
              <Button
                key={pageNumber}
                size="sm"
                variant={pageNumber === pagination.page ? 'solid' : 'ghost'}
                aria-label={`第 ${pageNumber} 页`}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </Button>
            ))}
            <Button
              size="sm"
              variant="outline"
              disabled={pagination.page >= pageCount}
              onClick={() => handlePageChange(pagination.page + 1)}
            >
              下一页
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

SmartTable.displayName = 'SmartTable';
