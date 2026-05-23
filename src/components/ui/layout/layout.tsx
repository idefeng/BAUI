import * as React from 'react';

import { cn } from '../../../lib/utils';
import { uiStyles } from '../shared/styles';

export interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 是否让 Layout 占满视口高度。 */
  fullHeight?: boolean;
}

export interface LayoutSiderProps extends React.HTMLAttributes<HTMLElement> {
  /** 收起后使用窄栏宽度。 */
  collapsed?: boolean;
}

/** Layout 提供后台页面基础骨架，可嵌套出 Header/Sider/Content/Footer。 */
export const Layout = React.forwardRef<HTMLDivElement, LayoutProps>(
  ({ className, fullHeight = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex min-w-0 bg-background text-foreground dark:bg-background-dark dark:text-foreground-dark',
        fullHeight && 'min-h-screen',
        className,
      )}
      {...props}
    />
  ),
);

Layout.displayName = 'Layout';

export const LayoutHeader = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <header
      ref={ref}
      className={cn(
        'flex h-16 shrink-0 items-center border-b border-border bg-surface px-6 shadow-sm dark:border-border-dark dark:bg-surface-dark',
        uiStyles.textForeground,
        className,
      )}
      {...props}
    />
  ),
);

LayoutHeader.displayName = 'LayoutHeader';

export const LayoutSider = React.forwardRef<HTMLElement, LayoutSiderProps>(
  ({ className, collapsed = false, ...props }, ref) => (
    <aside
      ref={ref}
      className={cn(
        'shrink-0 border-r border-border bg-surface p-4 transition-all duration-200 dark:border-border-dark dark:bg-surface-dark',
        collapsed ? 'w-20' : 'w-64',
        uiStyles.textForeground,
        className,
      )}
      {...props}
    />
  ),
);

LayoutSider.displayName = 'LayoutSider';

export const LayoutContent = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <main ref={ref} className={cn('min-w-0 flex-1 p-6', uiStyles.textForeground, className)} {...props} />
  ),
);

LayoutContent.displayName = 'LayoutContent';

export const LayoutFooter = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <footer
      ref={ref}
      className={cn(
        'shrink-0 border-t border-border bg-surface px-6 py-4 text-sm dark:border-border-dark dark:bg-surface-dark',
        uiStyles.textMuted,
        className,
      )}
      {...props}
    />
  ),
);

LayoutFooter.displayName = 'LayoutFooter';
