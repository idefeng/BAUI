import * as React from 'react';
import { ChevronRight, Home } from 'lucide-react';

import { cn } from '../../../lib/utils';
import { uiStyles } from '../shared/styles';

export interface BreadcrumbItem {
  /** 面包屑展示内容。 */
  title: React.ReactNode;
  /** 可点击面包屑链接；当前页通常不传。 */
  href?: string;
  /** 左侧图标，适合首页或模块入口。 */
  icon?: React.ReactNode;
  /** 是否为当前页，不传时默认最后一项为当前页。 */
  current?: boolean;
  /** 点击回调，可用于路由跳转。 */
  onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLSpanElement>;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  /** 面包屑项列表。 */
  items: BreadcrumbItem[];
  /** 分隔符，默认使用 ChevronRight 图标。 */
  separator?: React.ReactNode;
  /** 可访问名称，默认“面包屑”。 */
  label?: string;
}

/** Breadcrumb 用于后台页面路径导航，保持轻量链接语义。 */
export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ className, items, label = '面包屑', separator, ...props }, ref) => (
    <nav ref={ref} aria-label={label} className={cn('w-full', className)} {...props}>
      <ol className="flex flex-wrap items-center gap-1 text-sm">
        {items.map((item, index) => {
          const isCurrent = item.current ?? index === items.length - 1;
          const content = (
            <>
              {item.icon ?? (index === 0 ? <Home className="size-4" aria-hidden="true" /> : null)}
              <span aria-current={isCurrent ? 'page' : undefined}>{item.title}</span>
            </>
          );

          return (
            <li key={`${index}-${String(item.title)}`} className="flex items-center gap-1">
              {index > 0 ? (
                <span className={cn('mx-1 inline-flex items-center', uiStyles.textMuted)} aria-hidden="true">
                  {separator ?? <ChevronRight className="size-4" />}
                </span>
              ) : null}
              {item.href && !isCurrent ? (
                <a
                  href={item.href}
                  onClick={item.onClick as React.MouseEventHandler<HTMLAnchorElement>}
                  className={cn(
                    'inline-flex items-center gap-1 rounded-lg px-2 py-1 transition-colors',
                    uiStyles.textMuted,
                    uiStyles.primarySurfaceHover,
                    uiStyles.focusRing,
                  )}
                >
                  {content}
                </a>
              ) : (
                <span
                  aria-current={isCurrent ? 'page' : undefined}
                  onClick={item.onClick as React.MouseEventHandler<HTMLSpanElement>}
                  className={cn(
                    'inline-flex items-center gap-1 rounded-lg px-2 py-1',
                    isCurrent ? uiStyles.textForeground : uiStyles.textMuted,
                  )}
                >
                  {content}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  ),
);

Breadcrumb.displayName = 'Breadcrumb';
