import * as React from 'react';

import { cn } from '../../../lib/utils';
import { uiStyles } from '../shared/styles';

export interface AnchorItem {
  /** 锚点标题。 */
  title: React.ReactNode;
  /** 锚点链接，通常为 #section-id。 */
  href: string;
  /** 子锚点。 */
  children?: AnchorItem[];
}

export interface AnchorProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  /** 锚点项。 */
  items: AnchorItem[];
  /** 当前激活锚点。 */
  activeHref?: string;
  /** 点击锚点回调。 */
  onChange?: (href: string) => void;
  /** 可访问名称。 */
  label?: string;
}

const AnchorList = ({
  activeHref,
  items,
  level = 0,
  onChange,
}: {
  activeHref?: string;
  items: AnchorItem[];
  level?: number;
  onChange?: (href: string) => void;
}) => (
  <ul className={cn('space-y-1', level > 0 && 'ml-4 mt-1 border-l border-border pl-3 dark:border-border-dark')}>
    {items.map((item) => {
      const active = item.href === activeHref;

      return (
        <li key={item.href}>
          <a
            href={item.href}
            className={cn(
              'block rounded-lg px-3 py-2 text-sm transition-colors',
              active ? 'bg-primary-soft font-medium text-primary dark:bg-primary-dark-soft dark:text-primary-dark' : uiStyles.textMuted,
              !active && uiStyles.primarySurfaceHover,
              uiStyles.focusRing,
            )}
            onClick={() => onChange?.(item.href)}
          >
            {item.title}
          </a>
          {item.children?.length ? (
            <AnchorList activeHref={activeHref} items={item.children} level={level + 1} onChange={onChange} />
          ) : null}
        </li>
      );
    })}
  </ul>
);

/** Anchor 用于详情页或文档页的章节导航。 */
export const Anchor = React.forwardRef<HTMLElement, AnchorProps>(
  ({ activeHref, className, items, label = '锚点导航', onChange, ...props }, ref) => (
    <nav ref={ref} aria-label={label} className={cn('w-56', className)} {...props}>
      <AnchorList activeHref={activeHref} items={items} onChange={onChange} />
    </nav>
  ),
);

Anchor.displayName = 'Anchor';
