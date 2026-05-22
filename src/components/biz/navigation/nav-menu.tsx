import * as React from 'react';
import {
  Award,
  BookOpen,
  ChevronDown,
  FileText,
  Home,
  LayoutDashboard,
  ListChecks,
  LucideIcon,
  Settings,
  ShieldCheck,
  Users,
} from 'lucide-react';

import { cn } from '../../../lib/utils';
import { uiStyles } from '../../ui/shared/styles';

export type NavMenuLayout = 'horizontal' | 'vertical';

export interface NavMenuItem {
  key: string;
  label: string;
  icon: keyof typeof iconMap | string;
  path: string;
  children?: NavMenuItem[];
}

export interface NavMenuProps extends React.HTMLAttributes<HTMLElement> {
  /** 菜单项数组；mock=true 时可省略并自动注入培训管理系统菜单树。 */
  items?: NavMenuItem[];
  /** 横向顶部导航或纵向侧边栏导航。 */
  layout?: NavMenuLayout;
  /** 是否启用标准培训管理系统 mock 菜单树。 */
  mock?: boolean;
  /** 当前路由路径；不传时读取 window.location.pathname。 */
  currentPath?: string;
}

const iconMap = {
  Award,
  BookOpen,
  FileText,
  Home,
  LayoutDashboard,
  ListChecks,
  Settings,
  ShieldCheck,
  Users,
};

const mockNavigationItems: NavMenuItem[] = [
  { key: 'home', label: '首页', icon: 'Home', path: '/' },
  { key: 'students', label: '学员管理', icon: 'Users', path: '/students' },
  {
    key: 'courses',
    label: '课程中心',
    icon: 'BookOpen',
    path: '/courses',
    children: [
      { key: 'course-list', label: '课程列表', icon: 'ListChecks', path: '/courses' },
      { key: 'certificate', label: '证书模版', icon: 'Award', path: '/certificates' },
    ],
  },
  {
    key: 'settings',
    label: '系统设置',
    icon: 'Settings',
    path: '/settings',
    children: [
      { key: 'permission', label: '权限配置', icon: 'ShieldCheck', path: '/settings/permissions' },
    ],
  },
];

const hasChildren = (item: NavMenuItem) => Boolean(item.children?.length);

const getCurrentPath = () => {
  if (typeof window === 'undefined') {
    return '/';
  }

  return window.location.pathname || '/';
};

const findItemByPath = (items: NavMenuItem[], path: string): NavMenuItem | undefined => {
  for (const item of items) {
    if (item.path === path) {
      return item;
    }

    const matchedChild = findItemByPath(item.children ?? [], path);

    if (matchedChild) {
      return matchedChild;
    }
  }

  return undefined;
};

const isItemActive = (item: NavMenuItem, currentPath: string): boolean => {
  if (item.path === currentPath) {
    return true;
  }

  return item.children?.some((child) => isItemActive(child, currentPath)) ?? false;
};

const collectActiveParentKeys = (items: NavMenuItem[], currentPath: string, parents: string[] = []): string[] => {
  for (const item of items) {
    if (item.path === currentPath) {
      return parents;
    }

    const matchedParents = collectActiveParentKeys(item.children ?? [], currentPath, [...parents, item.key]);

    if (matchedParents.length > 0) {
      return matchedParents;
    }
  }

  return [];
};

const getIconComponent = (icon: NavMenuItem['icon']): LucideIcon => {
  const candidate = iconMap[icon as keyof typeof iconMap];

  return candidate ?? FileText;
};

const iconSlotClassName = 'inline-flex size-5 shrink-0 items-center justify-center [&>svg]:size-5';
const activeItemClassName = 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-dark';
const inactiveItemClassName =
  'text-muted-foreground hover:bg-primary-soft hover:text-primary dark:text-muted-dark-foreground dark:hover:bg-primary-dark-soft dark:hover:text-primary-dark';

const renderIcon = (item: NavMenuItem) => {
  const Icon = getIconComponent(item.icon);

  return (
    <span className={iconSlotClassName} aria-hidden="true">
      <Icon />
    </span>
  );
};

interface NavItemContentProps {
  item: NavMenuItem;
  active: boolean;
  depth?: number;
  indicator?: boolean;
  as?: 'a' | 'button';
  expanded?: boolean;
  onClick?: () => void;
}

const NavItemContent = ({
  active,
  as = 'a',
  depth = 0,
  expanded = false,
  indicator = false,
  item,
  onClick,
}: NavItemContentProps) => {
  const className = cn(
    'group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
    uiStyles.buttonFocusVisibleRing,
    active ? activeItemClassName : inactiveItemClassName,
    depth > 0 && 'pl-9',
  );
  const children = (
    <>
      {indicator && active ? (
        <span
          data-testid={`nav-menu-indicator-${item.key}`}
          className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-primary dark:bg-primary-dark"
        />
      ) : null}
      {renderIcon(item)}
      <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>
      {as === 'button' ? (
        <ChevronDown
          className={cn('size-4 shrink-0 transition-transform duration-200', expanded && 'rotate-180')}
          aria-hidden="true"
        />
      ) : null}
    </>
  );

  if (as === 'button') {
    return (
      <button
        type="button"
        aria-expanded={expanded}
        data-testid={`nav-menu-item-${item.key}`}
        className={className}
        onClick={onClick}
      >
        {children}
      </button>
    );
  }

  return (
    <a href={item.path} data-testid={`nav-menu-item-${item.key}`} className={className} onClick={onClick}>
      {children}
    </a>
  );
};

const VerticalNavItems = ({
  currentPath,
  items,
  openKeys,
  setOpenKeys,
  depth = 0,
}: {
  currentPath: string;
  items: NavMenuItem[];
  openKeys: Set<string>;
  setOpenKeys: React.Dispatch<React.SetStateAction<Set<string>>>;
  depth?: number;
}) => (
  <ul className={cn('grid gap-1', depth > 0 && 'mt-1 pl-2')}>
    {items.map((item) => {
      const active = isItemActive(item, currentPath);
      const expanded = openKeys.has(item.key);

      return (
        <li key={item.key}>
          {hasChildren(item) ? (
            <>
              <NavItemContent
                item={item}
                active={active}
                as="button"
                depth={depth}
                expanded={expanded}
                indicator={depth === 0}
                onClick={() => {
                  setOpenKeys((currentKeys) => {
                    const nextKeys = new Set(currentKeys);

                    if (nextKeys.has(item.key)) {
                      nextKeys.delete(item.key);
                    } else {
                      nextKeys.add(item.key);
                    }

                    return nextKeys;
                  });
                }}
              />
              <div
                className={cn(
                  'grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out',
                  expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                )}
              >
                <div className="min-h-0 overflow-hidden">
                  <VerticalNavItems
                    currentPath={currentPath}
                    depth={depth + 1}
                    items={item.children ?? []}
                    openKeys={openKeys}
                    setOpenKeys={setOpenKeys}
                  />
                </div>
              </div>
            </>
          ) : (
            <NavItemContent item={item} active={active} depth={depth} indicator />
          )}
        </li>
      );
    })}
  </ul>
);

const HorizontalSubItems = ({ currentPath, items }: { currentPath: string; items: NavMenuItem[] }) => (
  <ul className="grid min-w-56 gap-1 p-1">
    {items.map((item) => {
      const active = isItemActive(item, currentPath);

      return (
        <li key={item.key}>
          {hasChildren(item) ? (
            <div className="rounded-xl border border-border/70 p-1 dark:border-border-dark">
              <p className="px-3 py-2 text-xs font-medium text-muted-foreground dark:text-muted-dark-foreground">{item.label}</p>
              <HorizontalSubItems currentPath={currentPath} items={item.children ?? []} />
            </div>
          ) : (
            <NavItemContent item={item} active={active} depth={0} />
          )}
        </li>
      );
    })}
  </ul>
);

const HorizontalNavItems = ({
  currentPath,
  items,
}: {
  currentPath: string;
  items: NavMenuItem[];
}) => {
  const [openKey, setOpenKey] = React.useState<string | null>(null);

  return (
    <ul className="flex flex-wrap items-center gap-2">
      {items.map((item) => {
        const active = isItemActive(item, currentPath);
        const open = openKey === item.key;

        return (
          <li
            key={item.key}
            className="relative"
            onMouseEnter={() => setOpenKey(item.key)}
            onMouseLeave={() => setOpenKey((currentKey) => (currentKey === item.key ? null : currentKey))}
          >
            {hasChildren(item) ? (
              <>
                <NavItemContent
                  item={item}
                  active={active}
                  as="button"
                  expanded={open}
                  onClick={() => setOpenKey((currentKey) => (currentKey === item.key ? null : item.key))}
                />
                {open ? (
                  <div
                    data-testid={`nav-menu-popover-${item.key}`}
                    className="absolute left-0 top-full z-40 mt-3 rounded-2xl border border-border bg-surface p-2 shadow-tooltip dark:border-border-dark dark:bg-surface-dark"
                  >
                    <HorizontalSubItems currentPath={currentPath} items={item.children ?? []} />
                  </div>
                ) : null}
              </>
            ) : (
              <NavItemContent item={item} active={active} />
            )}
          </li>
        );
      })}
    </ul>
  );
};

/** NavMenu 企业级响应式导航菜单，支持横向顶部菜单与纵向侧边栏。 */
export function NavMenu({
  className,
  currentPath: controlledCurrentPath,
  items: externalItems,
  layout = 'vertical',
  mock = false,
  ...props
}: NavMenuProps) {
  const items = mock ? mockNavigationItems : externalItems ?? [];
  const currentPath = controlledCurrentPath ?? getCurrentPath();
  const matchedItem = findItemByPath(items, currentPath);
  const [openKeys, setOpenKeys] = React.useState<Set<string>>(
    () => new Set(collectActiveParentKeys(items, matchedItem?.path ?? currentPath)),
  );

  React.useEffect(() => {
    setOpenKeys((currentKeys) => new Set([...currentKeys, ...collectActiveParentKeys(items, matchedItem?.path ?? currentPath)]));
  }, [currentPath, items, matchedItem?.path]);

  return (
    <nav
      aria-label="企业导航菜单"
      data-testid="nav-menu-root"
      className={cn(
        layout === 'vertical'
          ? 'w-full max-w-72 rounded-3xl border border-border bg-surface p-3 shadow-button dark:border-border-dark dark:bg-surface-dark'
          : 'w-full rounded-3xl border border-border bg-surface px-3 py-2 shadow-button dark:border-border-dark dark:bg-surface-dark',
        className,
      )}
      {...props}
    >
      {layout === 'vertical' ? (
        <VerticalNavItems currentPath={currentPath} items={items} openKeys={openKeys} setOpenKeys={setOpenKeys} />
      ) : (
        <HorizontalNavItems currentPath={currentPath} items={items} />
      )}
    </nav>
  );
}

NavMenu.displayName = 'NavMenu';
