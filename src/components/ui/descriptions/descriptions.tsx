import * as React from 'react';

import { cn } from '../../../lib/utils';
import { uiStyles } from '../shared/styles';

export type DescriptionsSize = 'sm' | 'md' | 'lg';
export type DescriptionsColumn = 1 | 2 | 3 | 4;

export interface DescriptionsItem {
  /** 描述项标签。 */
  label: React.ReactNode;
  /** 描述项内容。 */
  children: React.ReactNode;
  /** 占用列数，当前轻量实现用于标记宽项。 */
  span?: number;
}

export interface DescriptionsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 标题，通常为信息分组名称。 */
  title?: React.ReactNode;
  /** 描述项列表。 */
  items: DescriptionsItem[];
  /** 响应式列数。 */
  column?: DescriptionsColumn;
  /** 是否展示边框卡片样式。 */
  bordered?: boolean;
  /** 尺寸。 */
  size?: DescriptionsSize;
}

const columnClasses: Record<DescriptionsColumn, string> = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
};

const sizeClasses: Record<DescriptionsSize, string> = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-5',
};

/** Descriptions 用于详情页键值信息展示，如项目基础资料、证书信息和审核结果。 */
export const Descriptions = React.forwardRef<HTMLDivElement, DescriptionsProps>(
  ({ bordered = false, className, column = 2, items, size = 'md', title, ...props }, ref) => (
    <section
      ref={ref}
      className={cn(
        'space-y-4',
        bordered && uiStyles.surfaceShell,
        className,
      )}
      {...props}
    >
      {title ? (
        <div className={cn('px-1 text-base font-semibold', bordered && 'px-4 pt-4', uiStyles.textForeground)}>
          {title}
        </div>
      ) : null}
      <dl className={cn('grid grid-cols-1 gap-0', columnClasses[column])}>
        {items.map((item, index) => (
          <div
            key={`${index}-${String(item.label)}`}
            className={cn(
              'min-w-0',
              sizeClasses[size],
              bordered && uiStyles.borderDefault,
              bordered && index < items.length && 'border-t',
              item.span && item.span > 1 && 'md:col-span-2',
            )}
          >
            <dt className={cn('text-sm font-medium', uiStyles.textMuted)}>{item.label}</dt>
            <dd className={cn('mt-1 break-words text-sm leading-6', uiStyles.textForeground)}>{item.children}</dd>
          </div>
        ))}
      </dl>
    </section>
  ),
);

Descriptions.displayName = 'Descriptions';
