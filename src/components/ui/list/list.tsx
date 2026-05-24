import * as React from 'react';

import { cn } from '../../../lib/utils';
import { uiStyles } from '../shared/styles';

export interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
  /** 是否展示外边框。 */
  bordered?: boolean;
  /** 是否展示列表项分割线。 */
  split?: boolean;
}

export interface ListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  /** 列表项尾部操作区，适合按钮、链接或更多菜单。 */
  actions?: React.ReactNode;
}

export interface ListItemMetaProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 左侧头像或图标。 */
  avatar?: React.ReactNode;
  /** 主标题。 */
  title: React.ReactNode;
  /** 描述或辅助信息。 */
  description?: React.ReactNode;
}

const ListContext = React.createContext<{ split: boolean }>({ split: true });

/** List 用于通知公告、任务清单等轻量纵向信息集合。 */
export const List = React.forwardRef<HTMLUListElement, ListProps>(
  ({ bordered = false, children, className, split = true, ...props }, ref) => (
    <ListContext.Provider value={{ split }}>
      <ul
        ref={ref}
        className={cn(
          'rounded-2xl',
          uiStyles.surfaceBackground,
          uiStyles.textForeground,
          bordered && cn('border', uiStyles.borderDefault),
          className,
        )}
        {...props}
      >
        {children}
      </ul>
    </ListContext.Provider>
  ),
);

List.displayName = 'List';

export const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(
  ({ actions, children, className, ...props }, ref) => {
    const { split } = React.useContext(ListContext);

    return (
      <li
        ref={ref}
        className={cn(
          'flex items-start justify-between gap-4 px-5 py-4',
          split && 'border-b border-border last:border-b-0 dark:border-border-dark',
          className,
        )}
        {...props}
      >
        <div className="min-w-0 flex-1">{children}</div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </li>
    );
  },
);

ListItem.displayName = 'ListItem';

export const ListItemMeta = React.forwardRef<HTMLDivElement, ListItemMetaProps>(
  ({ avatar, className, description, title, ...props }, ref) => (
    <div ref={ref} className={cn('flex min-w-0 items-start gap-3', className)} {...props}>
      {avatar ? (
        <div className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary dark:bg-primary-dark-soft dark:text-primary-dark [&>svg]:size-5">
          {avatar}
        </div>
      ) : null}
      <div className="min-w-0 space-y-1">
        <div className={cn(uiStyles.title, 'truncate')}>{title}</div>
        {description ? <div className={cn(uiStyles.description, 'line-clamp-2')}>{description}</div> : null}
      </div>
    </div>
  ),
);

ListItemMeta.displayName = 'ListItemMeta';
