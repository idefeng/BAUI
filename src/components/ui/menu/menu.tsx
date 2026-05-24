import * as React from 'react';
import { ChevronDown } from 'lucide-react';

import { cn } from '../../../lib/utils';
import { hasChildItems } from '../shared/logic';
import { uiStyles } from '../shared/styles';

export interface MenuItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  children?: MenuItem[];
}

export interface MenuProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** 菜单项数据，支持一层或多层 children。 */
  items: MenuItem[];
  /** 当前选中项；传入后组件进入受控模式。 */
  selectedKey?: string;
  /** 非受控模式下的初始选中项。 */
  defaultSelectedKey?: string;
  /** 默认展开的分组 key。 */
  defaultOpenKeys?: string[];
  /** 点击叶子菜单项后的回调。 */
  onSelect?: (key: string) => void;
}

export const Menu = React.forwardRef<HTMLDivElement, MenuProps>(
  (
    {
      className,
      defaultOpenKeys = [],
      defaultSelectedKey,
      items,
      onSelect,
      selectedKey,
      ...props
    },
    ref,
  ) => {
    const isControlled = selectedKey !== undefined;
    const [innerSelectedKey, setInnerSelectedKey] = React.useState(defaultSelectedKey);
    const [openKeys, setOpenKeys] = React.useState(() => new Set(defaultOpenKeys));
    const actualSelectedKey = isControlled ? selectedKey : innerSelectedKey;

    const updateSelected = (key: string) => {
      if (!isControlled) {
        setInnerSelectedKey(key);
      }

      onSelect?.(key);
    };

    const toggleOpen = (key: string) => {
      setOpenKeys((current) => {
        const next = new Set(current);

        if (next.has(key)) {
          next.delete(key);
        } else {
          next.add(key);
        }

        return next;
      });
    };

    const renderItems = (menuItems: MenuItem[], depth = 0): React.ReactNode =>
      menuItems.map((item) => {
        const hasChildren = hasChildItems(item);
        const isOpen = openKeys.has(item.key);
        const isSelected = actualSelectedKey === item.key;

        return (
          <div key={item.key} role="none" className="space-y-1">
            <button
              type="button"
              role="menuitem"
              aria-current={isSelected ? 'page' : undefined}
              aria-expanded={hasChildren ? isOpen : undefined}
              disabled={item.disabled}
              className={cn(
                'flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition-all duration-150',
                uiStyles.buttonFocusVisibleRing,
                isSelected
                  ? uiStyles.activePrimary
                  : 'text-foreground hover:bg-primary-soft hover:text-primary dark:text-foreground-dark dark:hover:bg-primary-dark-soft dark:hover:text-primary-dark',
                item.disabled && 'cursor-not-allowed opacity-50',
              )}
              style={{ paddingLeft: `${0.75 + depth * 0.75}rem` }}
              onClick={() => {
                if (item.disabled) {
                  return;
                }

                if (hasChildren) {
                  toggleOpen(item.key);
                  return;
                }

                updateSelected(item.key);
              }}
            >
              {item.icon ? <span className={uiStyles.mutedIconSlot}>{item.icon}</span> : null}
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              {hasChildren ? (
                <ChevronDown
                  className={cn('size-4 transition-transform', isOpen && 'rotate-180')}
                  aria-hidden="true"
                />
              ) : null}
            </button>
            {hasChildren && isOpen ? (
              <div role="group" className="space-y-1">
                {renderItems(item.children ?? [], depth + 1)}
              </div>
            ) : null}
          </div>
        );
      });

    return (
      <nav
        {...props}
        ref={ref}
        role="menu"
        className={cn('w-full space-y-1 rounded-2xl p-2', uiStyles.surfaceShell, className)}
      >
        {renderItems(items)}
      </nav>
    );
  },
);

Menu.displayName = 'Menu';
