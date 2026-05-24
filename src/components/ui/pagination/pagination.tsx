import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '../../../lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select';
import { clampNumber, floorAtLeast } from '../shared/logic';
import { uiStyles } from '../shared/styles';

export type PaginationItem = number | 'ellipsis-left' | 'ellipsis-right';

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  /** 总条数。 */
  total: number;
  /** 每页条数，默认 10。 */
  pageSize?: number;
  /** 当前页码，从 1 开始。 */
  currentPage: number;
  /** 页码或每页条数变化时触发，第二个参数始终带上当前 pageSize。 */
  onPageChange: (page: number, pageSize: number) => void;
  /** 是否显示每页条数切换 Select。 */
  showSizeChanger?: boolean;
}

const defaultPageSize = 10;
const maxContinuousPages = 5;
const pageSizeOptions = [10, 20, 50, 100];

const clampPage = (page: number, pageCount: number) => clampNumber(page, 1, pageCount);

const getSortedPageSizeOptions = (pageSize: number) =>
  Array.from(new Set([...pageSizeOptions, pageSize])).sort((left, right) => left - right);

export const getPageCount = (total: number, pageSize = defaultPageSize) =>
  Math.max(1, Math.ceil(Math.max(0, total) / Math.max(1, pageSize)));

export const getPaginationItems = (pageCount: number, currentPage: number): PaginationItem[] => {
  const safePageCount = floorAtLeast(pageCount);
  const safeCurrentPage = clampPage(Math.floor(currentPage), safePageCount);

  if (safePageCount <= maxContinuousPages + 2) {
    return Array.from({ length: safePageCount }, (_, index) => index + 1);
  }

  const halfWindow = Math.floor(maxContinuousPages / 2);
  let start = safeCurrentPage - halfWindow;
  let end = safeCurrentPage + halfWindow;

  if (start < 1) {
    start = 1;
    end = maxContinuousPages;
  }

  if (end > safePageCount) {
    end = safePageCount;
    start = safePageCount - maxContinuousPages + 1;
  }

  const middlePages = Array.from({ length: end - start + 1 }, (_, index) => start + index);
  const items: PaginationItem[] = [];

  if (start > 1) {
    items.push(1);
  }

  if (start > 2) {
    items.push('ellipsis-left');
  }

  items.push(...middlePages);

  if (end < safePageCount - 1) {
    items.push('ellipsis-right');
  }

  if (end < safePageCount) {
    items.push(safePageCount);
  }

  return items;
};

const pageButtonClassName =
  'inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 disabled:pointer-events-none disabled:opacity-50';

/** Pagination 现代分页组件，支持省略号折叠和每页条数切换。 */
export function Pagination({
  className,
  currentPage,
  onPageChange,
  pageSize = defaultPageSize,
  showSizeChanger = false,
  total,
  ...props
}: PaginationProps) {
  const pageCount = getPageCount(total, pageSize);
  const safeCurrentPage = clampPage(currentPage, pageCount);
  const paginationItems = getPaginationItems(pageCount, safeCurrentPage);

  const handlePageChange = (page: number) => {
    if (page === safeCurrentPage || page < 1 || page > pageCount) {
      return;
    }

    onPageChange(page, pageSize);
  };

  const handlePageSizeChange = (nextPageSize: string) => {
    // 切换 pageSize 后回到第一页，避免当前页超过新的总页数。
    onPageChange(1, Number(nextPageSize));
  };

  return (
    <nav
      aria-label="分页"
      data-testid="pagination-root"
      className={cn(
        'flex flex-col gap-3 rounded-2xl p-3 text-sm',
        uiStyles.textMuted,
        uiStyles.surfaceCard,
        className,
      )}
      {...props}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className={cn('font-medium', uiStyles.textMuted)}>共 {Math.max(0, total)} 条</span>

        <div className="flex flex-wrap items-center gap-2">
          {showSizeChanger ? (
            <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
              <SelectTrigger aria-label="每页条数" className="h-9 w-32 rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getSortedPageSizeOptions(pageSize).map((option) => (
                  <SelectItem key={option} value={String(option)}>
                    {option} 条/页
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : null}

          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="上一页"
              disabled={safeCurrentPage <= 1}
              onClick={() => handlePageChange(safeCurrentPage - 1)}
              className={cn(
                pageButtonClassName,
                uiStyles.buttonFocusVisibleRing,
                uiStyles.surfaceInteractive,
                uiStyles.textMuted,
              )}
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>

            {paginationItems.map((item) =>
              typeof item === 'number' ? (
                <button
                  key={item}
                  type="button"
                  aria-current={item === safeCurrentPage ? 'page' : undefined}
                  aria-label={`第 ${item} 页`}
                  onClick={() => handlePageChange(item)}
                  className={cn(
                    pageButtonClassName,
                    uiStyles.buttonFocusVisibleRing,
                    item === safeCurrentPage
                      ? uiStyles.activePrimary
                      : cn(uiStyles.surfaceInteractive, uiStyles.textForeground),
                  )}
                >
                  {item}
                </button>
              ) : (
                <span
                  key={item}
                  aria-hidden="true"
                  className={cn('inline-flex size-9 items-center justify-center rounded-lg', uiStyles.textMuted)}
                >
                  ...
                </span>
              ),
            )}

            <button
              type="button"
              aria-label="下一页"
              disabled={safeCurrentPage >= pageCount}
              onClick={() => handlePageChange(safeCurrentPage + 1)}
              className={cn(
                pageButtonClassName,
                uiStyles.buttonFocusVisibleRing,
                uiStyles.surfaceInteractive,
                uiStyles.textMuted,
              )}
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

Pagination.displayName = 'Pagination';
