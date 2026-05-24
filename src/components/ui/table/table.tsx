import * as React from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown, ChevronRight, LoaderCircle } from 'lucide-react';

import { cn } from '../../../lib/utils';
import { mockProjects, mockUsers, type MockProject, type MockUser } from '../../../utils/mock';
import { clampNumber } from '../shared/logic';
import { uiStyles } from '../shared/styles';

export type TableRowKey = string | number;
export type TableAlign = 'left' | 'center' | 'right';
export type TableSelectionMode = 'multiple' | 'single';
export type TableMockType = 'project' | 'user';
export type TableFixedPosition = 'left' | 'right';
export type TableSortOrder = 'ascend' | 'descend';

export interface TableSortState {
  /** 当前排序列 key。 */
  columnKey: string;
  /** 当前排序方向。 */
  order: TableSortOrder;
}

export interface TableColumn<T extends object> {
  /** 列唯一标识，用于渲染 key 和列宽配置。 */
  key: string;
  /** 表头标题。 */
  title: React.ReactNode;
  /** 数据字段名；不传时应使用 render 自定义渲染。 */
  dataIndex?: keyof T;
  /** 列宽，支持数字像素值或 CSS 长度。 */
  width?: number | string;
  /** 单元格对齐方式。 */
  align?: TableAlign;
  /** 是否启用单行省略。 */
  ellipsis?: boolean;
  /** 固定列位置；仅处理纯 UI sticky 布局，不绑定业务滚动逻辑。 */
  fixed?: TableFixedPosition;
  /** 是否允许点击表头切换排序。 */
  sortable?: boolean;
  /** 自定义排序函数；不传时按 dataIndex 的文本/数字值排序。 */
  sorter?: (left: T, right: T) => number;
  /** 自定义单元格渲染。 */
  render?: (value: T[keyof T] | undefined, record: T, index: number) => React.ReactNode;
  /** 表头额外类名。 */
  headerClassName?: string;
  /** 单元格额外类名。 */
  className?: string;
}

export interface TableProps<T extends object = Record<string, unknown>>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> {
  /** 表格列配置；mock 模式未传时使用内置项目/人员列。 */
  columns?: TableColumn<T>[];
  /** 表格数据；真实数据永远优先于 mock 数据。 */
  data?: T[];
  /** 行唯一键字段或生成函数。 */
  rowKey?: keyof T | ((record: T, index: number) => TableRowKey);
  /** 是否启用中央 mock 数据兜底。 */
  mock?: boolean;
  /** mock 数据类型，默认项目列表。 */
  mockType?: TableMockType;
  /** 是否显示加载层。 */
  loading?: boolean;
  /** 空状态文案。 */
  emptyText?: React.ReactNode;
  /** 是否显示行选择列。 */
  selectable?: boolean;
  /** 行选择模式。 */
  selectionMode?: TableSelectionMode;
  /** 受控选中行 key。 */
  selectedRowKeys?: TableRowKey[];
  /** 非受控初始选中行 key。 */
  defaultSelectedRowKeys?: TableRowKey[];
  /** 行选择变化回调。 */
  onSelectionChange?: (selectedRowKeys: TableRowKey[], selectedRows: T[]) => void;
  /** 是否显示展开列。 */
  expandable?: boolean;
  /** 受控展开行 key。 */
  expandedRowKeys?: TableRowKey[];
  /** 非受控初始展开行 key。 */
  defaultExpandedRowKeys?: TableRowKey[];
  /** 展开行变化回调。 */
  onExpandedChange?: (expandedRowKeys: TableRowKey[], expandedRows: T[]) => void;
  /** 展开区域渲染函数；保持纯 UI，不触发业务请求。 */
  renderExpandedRow?: (record: T, index: number) => React.ReactNode;
  /** 受控排序状态；传 null 表示清除排序。 */
  sortState?: TableSortState | null;
  /** 非受控初始排序状态。 */
  defaultSortState?: TableSortState | null;
  /** 排序状态变化回调。 */
  onSortChange?: (sortState: TableSortState | null) => void;
  /** 是否启用轻量虚拟窗口渲染。 */
  virtual?: boolean;
  /** 虚拟窗口起始行，用于外部滚动容器控制。 */
  virtualStart?: number;
  /** 虚拟窗口可见行数。 */
  virtualVisibleCount?: number;
  /** 虚拟窗口行高估算值，用于保留滚动高度。 */
  virtualItemHeight?: number;
  /** 表格主体最大高度。 */
  maxBodyHeight?: number | string;
  /** table 元素类名。 */
  tableClassName?: string;
}

const SELECTION_COLUMN_WIDTH = 48;
const EXPAND_COLUMN_WIDTH = 48;

const getCssSize = (value: number | string | undefined) => (typeof value === 'number' ? `${value}px` : value);

const getNumericWidth = (value: number | string | undefined) => {
  if (typeof value === 'number') {
    return value;
  }

  const pixelValue = typeof value === 'string' ? value.match(/^(\d+(?:\.\d+)?)px$/) : null;

  return pixelValue ? Number(pixelValue[1]) : 0;
};

const getCellValue = <T extends object>(record: T, column: TableColumn<T>) =>
  column.dataIndex ? record[column.dataIndex] : undefined;

const compareCellValue = <T extends object>(left: T, right: T, column: TableColumn<T>) => {
  const leftValue = getCellValue(left, column);
  const rightValue = getCellValue(right, column);

  if (typeof leftValue === 'number' && typeof rightValue === 'number') {
    return leftValue - rightValue;
  }

  return String(leftValue ?? '').localeCompare(String(rightValue ?? ''), 'zh-Hans-CN', {
    numeric: true,
    sensitivity: 'base',
  });
};

const getHeaderLabel = (title: React.ReactNode, fallback: string) => {
  if (typeof title === 'string' || typeof title === 'number') {
    return String(title);
  }

  return fallback;
};

const getSortButtonLabel = <T extends object>(column: TableColumn<T>, currentSortState: TableSortState | null) => {
  const title = getHeaderLabel(column.title, column.key);

  if (currentSortState?.columnKey !== column.key) {
    return `按 ${title} 升序排序`;
  }

  return currentSortState.order === 'ascend' ? `按 ${title} 降序排序` : `取消 ${title} 排序`;
};

const getNextSortState = <T extends object>(column: TableColumn<T>, currentSortState: TableSortState | null) => {
  if (currentSortState?.columnKey !== column.key) {
    return { columnKey: column.key, order: 'ascend' as const };
  }

  if (currentSortState.order === 'ascend') {
    return { columnKey: column.key, order: 'descend' as const };
  }

  return null;
};

const getColumnFixedStyle = <T extends object>(
  columns: TableColumn<T>[],
  column: TableColumn<T>,
  columnIndex: number,
  leftBaseOffset: number,
): React.CSSProperties => {
  const style: React.CSSProperties = { width: getCssSize(column.width) };

  if (!column.fixed) {
    return style;
  }

  const offset =
    column.fixed === 'left'
      ? leftBaseOffset +
        columns.slice(0, columnIndex).reduce((total, item) => total + (item.fixed === 'left' ? getNumericWidth(item.width) : 0), 0)
      : columns
          .slice(columnIndex + 1)
          .reduce((total, item) => total + (item.fixed === 'right' ? getNumericWidth(item.width) : 0), 0);

  return {
    ...style,
    [column.fixed]: `${offset}px`,
    position: 'sticky',
    zIndex: 10,
  };
};

const getFallbackRecordKey = <T extends object>(record: T, index: number): TableRowKey => {
  const candidate = (record as { id?: unknown; code?: unknown }).id ?? (record as { code?: unknown }).code;

  return typeof candidate === 'string' || typeof candidate === 'number' ? candidate : index;
};

const projectColumns: TableColumn<MockProject>[] = [
  { key: 'projectName', title: '项目名称', dataIndex: 'projectName', ellipsis: true, width: 220 },
  { key: 'trainingType', title: '培训类型', dataIndex: 'trainingType', width: 130 },
  { key: 'enrolledCount', title: '人数', dataIndex: 'enrolledCount', align: 'right', width: 100 },
  { key: 'status', title: '状态', dataIndex: 'status', width: 110 },
];

const userColumns: TableColumn<MockUser>[] = [
  { key: 'name', title: '姓名', dataIndex: 'name', width: 110 },
  { key: 'jobTitle', title: '岗位', dataIndex: 'jobTitle', width: 110 },
  { key: 'projectName', title: '所属项目', dataIndex: 'projectName', ellipsis: true, width: 190 },
  { key: 'phoneMasked', title: '手机号', dataIndex: 'phoneMasked', width: 130 },
];

const getMockRows = (mockType: TableMockType) => (mockType === 'user' ? mockUsers(6) : mockProjects(6));

const getMockColumns = (mockType: TableMockType) => (mockType === 'user' ? userColumns : projectColumns);

export function Table<T extends object = Record<string, unknown>>({
  className,
  columns,
  data,
  defaultExpandedRowKeys = [],
  defaultSortState = null,
  defaultSelectedRowKeys = [],
  emptyText = '暂无数据',
  expandable = false,
  expandedRowKeys,
  loading = false,
  maxBodyHeight,
  mock = false,
  mockType = 'project',
  onExpandedChange,
  onSelectionChange,
  onSortChange,
  renderExpandedRow,
  rowKey,
  selectable = false,
  selectedRowKeys,
  selectionMode = 'multiple',
  sortState,
  tableClassName,
  virtual = false,
  virtualItemHeight = 56,
  virtualStart = 0,
  virtualVisibleCount = 20,
  ...props
}: TableProps<T>) {
  const shouldUseMock = mock && data === undefined;
  const rows = (shouldUseMock ? getMockRows(mockType) : data ?? []) as T[];
  const resolvedColumns = (columns ?? (shouldUseMock ? getMockColumns(mockType) : [])) as TableColumn<T>[];
  const isExpandedControlled = expandedRowKeys !== undefined;
  const isSelectionControlled = selectedRowKeys !== undefined;
  const isSortControlled = sortState !== undefined;
  const [innerExpandedKeys, setInnerExpandedKeys] = React.useState<TableRowKey[]>(defaultExpandedRowKeys);
  const [innerSelectedKeys, setInnerSelectedKeys] = React.useState<TableRowKey[]>(defaultSelectedRowKeys);
  const [innerSortState, setInnerSortState] = React.useState<TableSortState | null>(defaultSortState);
  const currentExpandedKeys = isExpandedControlled ? expandedRowKeys : innerExpandedKeys;
  const currentSelectedKeys = isSelectionControlled ? selectedRowKeys : innerSelectedKeys;
  const currentSortState = isSortControlled ? sortState : innerSortState;
  const expandedKeySet = React.useMemo(() => new Set(currentExpandedKeys), [currentExpandedKeys]);
  const selectedKeySet = React.useMemo(() => new Set(currentSelectedKeys), [currentSelectedKeys]);

  const getRecordKey = React.useCallback(
    (record: T, index: number) => {
      if (typeof rowKey === 'function') {
        return rowKey(record, index);
      }

      if (rowKey) {
        return record[rowKey] as TableRowKey;
      }

      return getFallbackRecordKey(record, index);
    },
    [rowKey],
  );

  const rowModels = React.useMemo(
    () =>
      rows.map((record, index) => ({
        key: getRecordKey(record, index),
        record,
        sourceIndex: index,
      })),
    [getRecordKey, rows],
  );

  const sortedRowModels = React.useMemo(() => {
    if (!currentSortState) {
      return rowModels;
    }

    const column = resolvedColumns.find((item) => item.key === currentSortState.columnKey);

    if (!column) {
      return rowModels;
    }

    const direction = currentSortState.order === 'ascend' ? 1 : -1;

    return [...rowModels].sort((left, right) => {
      // 自定义 sorter 优先；否则退回到 dataIndex 的可读值排序。
      const result = column.sorter ? column.sorter(left.record, right.record) : compareCellValue(left.record, right.record, column);

      return result * direction;
    });
  }, [currentSortState, resolvedColumns, rowModels]);

  const normalizedVirtualVisibleCount = Math.max(1, virtualVisibleCount);
  const normalizedVirtualStart = clampNumber(
    virtualStart,
    0,
    Math.max(0, sortedRowModels.length - normalizedVirtualVisibleCount),
  );
  const displayRowModels = virtual
    ? sortedRowModels.slice(normalizedVirtualStart, normalizedVirtualStart + normalizedVirtualVisibleCount)
    : sortedRowModels;
  const virtualTopHeight = virtual ? normalizedVirtualStart * virtualItemHeight : 0;
  const virtualBottomHeight = virtual
    ? Math.max(0, sortedRowModels.length - normalizedVirtualStart - displayRowModels.length) * virtualItemHeight
    : 0;
  const columnCount = resolvedColumns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0);
  const hasLeftFixedColumns = resolvedColumns.some((column) => column.fixed === 'left');
  const selectionColumnStyle: React.CSSProperties | undefined =
    selectable && hasLeftFixedColumns ? { left: 0, position: 'sticky', width: `${SELECTION_COLUMN_WIDTH}px`, zIndex: 20 } : undefined;
  const expandColumnLeft = selectable ? SELECTION_COLUMN_WIDTH : 0;
  const expandColumnStyle: React.CSSProperties | undefined =
    expandable && hasLeftFixedColumns
      ? { left: `${expandColumnLeft}px`, position: 'sticky', width: `${EXPAND_COLUMN_WIDTH}px`, zIndex: 20 }
      : undefined;
  const fixedColumnLeftBaseOffset =
    (selectable && hasLeftFixedColumns ? SELECTION_COLUMN_WIDTH : 0) + (expandable && hasLeftFixedColumns ? EXPAND_COLUMN_WIDTH : 0);

  const commitSortState = (nextSortState: TableSortState | null) => {
    if (!isSortControlled) {
      setInnerSortState(nextSortState);
    }

    onSortChange?.(nextSortState);
  };

  const emitSelection = (nextKeys: TableRowKey[]) => {
    if (!isSelectionControlled) {
      setInnerSelectedKeys(nextKeys);
    }

    const selectedRows = rowModels.filter((item) => nextKeys.includes(item.key)).map((item) => item.record);

    onSelectionChange?.(nextKeys, selectedRows);
  };

  const emitExpanded = (nextKeys: TableRowKey[]) => {
    if (!isExpandedControlled) {
      setInnerExpandedKeys(nextKeys);
    }

    const expandedRows = rowModels.filter((item) => nextKeys.includes(item.key)).map((item) => item.record);

    onExpandedChange?.(nextKeys, expandedRows);
  };

  const rowKeys = sortedRowModels.map((item) => item.key);
  const allChecked = rowKeys.length > 0 && rowKeys.every((key) => selectedKeySet.has(key));

  const toggleAll = () => {
    emitSelection(allChecked ? currentSelectedKeys.filter((key) => !rowKeys.includes(key)) : Array.from(new Set([...currentSelectedKeys, ...rowKeys])));
  };

  const toggleRow = (key: TableRowKey) => {
    if (selectionMode === 'single') {
      emitSelection([key]);
      return;
    }

    emitSelection(selectedKeySet.has(key) ? currentSelectedKeys.filter((item) => item !== key) : [...currentSelectedKeys, key]);
  };

  const toggleExpandedRow = (key: TableRowKey) => {
    emitExpanded(expandedKeySet.has(key) ? currentExpandedKeys.filter((item) => item !== key) : [...currentExpandedKeys, key]);
  };

  return (
    <div
      {...props}
      className={cn('relative overflow-hidden', uiStyles.surfaceShell, className)}
    >
      <div className="overflow-auto" style={{ maxHeight: getCssSize(maxBodyHeight) }}>
        <table className={cn('w-full border-separate border-spacing-0 text-left text-sm', tableClassName)}>
          <thead className="bg-secondary text-xs font-medium text-muted-foreground dark:bg-secondary-dark dark:text-muted-dark-foreground">
            <tr>
              {selectable ? (
                <th
                  className={cn(
                    'w-12',
                    uiStyles.tableHeaderCell,
                    selectionColumnStyle && 'shadow-sm',
                  )}
                  style={selectionColumnStyle}
                >
                  {selectionMode === 'multiple' ? (
                    <input
                      type="checkbox"
                      aria-label="选择全部数据"
                      checked={allChecked}
                      onChange={toggleAll}
                      className={uiStyles.selectionInput}
                    />
                  ) : null}
                </th>
              ) : null}
              {expandable ? (
                <th
                  aria-label="展开行"
                  className={cn(
                    'w-12',
                    uiStyles.tableHeaderCell,
                    expandColumnStyle && 'shadow-sm',
                  )}
                  style={expandColumnStyle}
                />
              ) : null}
              {resolvedColumns.map((column, columnIndex) => {
                const activeSortOrder = currentSortState?.columnKey === column.key ? currentSortState.order : null;
                const fixedStyle = getColumnFixedStyle(resolvedColumns, column, columnIndex, fixedColumnLeftBaseOffset);

                return (
                  <th
                    key={column.key}
                    scope="col"
                    aria-sort={activeSortOrder === 'ascend' ? 'ascending' : activeSortOrder === 'descend' ? 'descending' : undefined}
                    data-testid={`ui-table-head-${column.key}`}
                    style={fixedStyle}
                    className={cn(
                      'font-medium',
                      uiStyles.tableHeaderCell,
                      column.fixed && 'shadow-sm',
                      column.headerClassName,
                    )}
                  >
                    {column.sortable ? (
                      <button
                        type="button"
                        aria-label={getSortButtonLabel(column, currentSortState)}
                        className={cn(
                          'inline-flex w-full min-w-0 items-center gap-2 rounded-lg text-left transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-secondary dark:hover:text-primary-dark dark:focus:ring-primary-dark/30 dark:focus:ring-offset-secondary-dark',
                          column.align === 'center' && 'justify-center text-center',
                          column.align === 'right' && 'justify-end text-right',
                        )}
                        onClick={() => commitSortState(getNextSortState(column, currentSortState))}
                      >
                        <span className="truncate">{column.title}</span>
                        {activeSortOrder === 'ascend' ? (
                          <ArrowUp className="size-3.5 shrink-0" aria-hidden="true" />
                        ) : activeSortOrder === 'descend' ? (
                          <ArrowDown className="size-3.5 shrink-0" aria-hidden="true" />
                        ) : (
                          <ArrowUpDown className="size-3.5 shrink-0 opacity-70" aria-hidden="true" />
                        )}
                      </button>
                    ) : (
                      <span className={cn('block truncate', column.align === 'center' && 'text-center', column.align === 'right' && 'text-right')}>
                        {column.title}
                      </span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody data-testid={virtual ? 'ui-table-virtual-window' : undefined} aria-rowcount={virtual ? sortedRowModels.length : undefined}>
            {virtualTopHeight > 0 ? (
              <tr aria-hidden="true">
                <td colSpan={columnCount} style={{ height: `${virtualTopHeight}px`, padding: 0 }} />
              </tr>
            ) : null}
            {displayRowModels.map(({ key, record, sourceIndex }) => {
              const selected = selectedKeySet.has(key);
              const expanded = expandedKeySet.has(key);
              const rowLabel = String((resolvedColumns[0] ? getCellValue(record, resolvedColumns[0]) : undefined) ?? key);

              return (
                <React.Fragment key={key}>
                  <tr
                    className={cn(
                      'transition-colors hover:bg-primary-soft/60 dark:hover:bg-primary-dark-soft/45',
                      selected && 'bg-primary-soft/70 dark:bg-primary-dark-soft/60',
                    )}
                  >
                    {selectable ? (
                      <td
                        className={cn(
                          uiStyles.tableBodyCell,
                          selectionColumnStyle && 'shadow-sm',
                        )}
                        style={selectionColumnStyle}
                      >
                        <input
                          type={selectionMode === 'single' ? 'radio' : 'checkbox'}
                          aria-label={`选择 ${rowLabel}`}
                          checked={selected}
                          onChange={() => toggleRow(key)}
                          className={uiStyles.selectionInput}
                        />
                      </td>
                    ) : null}
                    {expandable ? (
                      <td
                        className={cn(
                          uiStyles.tableBodyCell,
                          expandColumnStyle && 'shadow-sm',
                        )}
                        style={expandColumnStyle}
                      >
                        <button
                          type="button"
                          aria-expanded={expanded}
                          aria-label={`${expanded ? '收起' : '展开'} ${rowLabel}`}
                          className={cn(
                            'inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-primary-soft hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:text-muted-dark-foreground dark:hover:bg-primary-dark-soft dark:hover:text-primary-dark dark:focus:ring-primary-dark/30',
                          )}
                          onClick={() => toggleExpandedRow(key)}
                        >
                          {expanded ? <ChevronDown className="size-4" aria-hidden="true" /> : <ChevronRight className="size-4" aria-hidden="true" />}
                        </button>
                      </td>
                    ) : null}
                    {resolvedColumns.map((column, columnIndex) => {
                      const value = getCellValue(record, column);
                      const content = column.render ? column.render(value, record, sourceIndex) : (value as React.ReactNode);
                      const fixedStyle = getColumnFixedStyle(resolvedColumns, column, columnIndex, fixedColumnLeftBaseOffset);

                      return (
                        <td
                          key={column.key}
                          data-testid={`ui-table-cell-${String(key)}-${column.key}`}
                          style={fixedStyle}
                          className={cn(
                            uiStyles.tableBodyCell,
                            uiStyles.textForeground,
                            column.align === 'center' && 'text-center',
                            column.align === 'right' && 'text-right',
                            column.fixed && 'shadow-sm',
                            column.className,
                          )}
                        >
                          <div className={cn('min-w-0', column.ellipsis !== false && 'truncate')}>{content}</div>
                        </td>
                      );
                    })}
                  </tr>
                  {expandable && expanded && renderExpandedRow ? (
                    <tr data-testid={`ui-table-expanded-row-${String(key)}`}>
                      <td
                        colSpan={columnCount}
                        className={cn('border-b bg-secondary/60 px-6 py-4 dark:bg-secondary-dark/60', uiStyles.borderDefault)}
                      >
                        <div className={cn('rounded-xl border p-4 text-sm', uiStyles.borderDefault, uiStyles.surfaceBackground, uiStyles.textForeground)}>
                          {renderExpandedRow(record, sourceIndex)}
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </React.Fragment>
              );
            })}
            {virtualBottomHeight > 0 ? (
              <tr aria-hidden="true">
                <td colSpan={columnCount} style={{ height: `${virtualBottomHeight}px`, padding: 0 }} />
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {!loading && sortedRowModels.length === 0 ? (
        <div className={cn('flex min-h-40 items-center justify-center p-8 text-center text-sm', uiStyles.textMuted)}>
          {emptyText}
        </div>
      ) : null}

      {loading ? (
        <div
          data-testid="ui-table-loading"
          className="absolute inset-0 flex items-center justify-center bg-surface/70 backdrop-blur-sm dark:bg-surface-dark/70"
        >
          <span className="inline-flex items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-2 text-sm font-medium text-primary shadow-button dark:border-border-dark dark:bg-surface-dark dark:text-primary-dark">
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            加载中
          </span>
        </div>
      ) : null}
    </div>
  );
}

Table.displayName = 'Table';
