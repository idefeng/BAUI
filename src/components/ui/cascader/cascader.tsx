import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Check, ChevronDown, ChevronRight, X } from 'lucide-react';

import { cn } from '../../../lib/utils';
import { mockCascaderOptions } from '../../../utils/mock';
import { hasChildItems } from '../shared/logic';
import { uiStyles } from '../shared/styles';

export interface CascaderOption {
  value: string;
  label: string;
  children?: CascaderOption[];
}

export interface CascaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** 树状数据源；mock=true 且未传入真实数据时会自动使用内置组织架构树。 */
  options?: CascaderOption[];
  /** 当前选中的完整路径 value，例如 ['zhejiang', 'hangzhou', 'xihu']。 */
  value?: string[];
  /** 点击叶子节点或清除时触发，第二个参数返回完整节点路径。 */
  onChange?: (value: string[], selectedOptions: CascaderOption[]) => void;
  /** 未选择时展示在触发器内的占位文案。 */
  placeholder?: string;
  /** 禁用后不可打开浮层，也不可清除当前值。 */
  disabled?: boolean;
  /** 开启后在未传 options 时自动加载高保真的公司组织架构 mock 数据。 */
  mock?: boolean;
  /** 是否展示一键清除按钮，默认在有值时展示。 */
  clearable?: boolean;
}

const hasChildren = (option: CascaderOption) => hasChildItems(option);

const findOptionPath = (options: CascaderOption[], value: string[] = []) => {
  const path: CascaderOption[] = [];
  let currentOptions = options;

  for (const currentValue of value) {
    const matchedOption = currentOptions.find((option) => option.value === currentValue);

    if (!matchedOption) {
      return [];
    }

    path.push(matchedOption);
    currentOptions = matchedOption.children ?? [];
  }

  return path;
};

const buildColumns = (options: CascaderOption[], activePath: CascaderOption[]) => {
  const columns: CascaderOption[][] = [options];

  for (const option of activePath) {
    if (!hasChildren(option)) {
      break;
    }

    columns.push(option.children ?? []);
  }

  return columns;
};

const keepDescendantsWhenSameNode = (
  currentPath: CascaderOption[],
  option: CascaderOption,
  level: number,
) => {
  // Radix 打开浮层时会自动聚焦菜单项；如果聚焦的仍是当前路径节点，保留后续层级。
  if (currentPath[level]?.value === option.value) {
    return currentPath;
  }

  return [...currentPath.slice(0, level), option];
};

export const Cascader = React.forwardRef<HTMLDivElement, CascaderProps>(
  (
    {
      className,
      clearable = true,
      disabled = false,
      mock = false,
      onChange,
      options,
      placeholder = '请选择',
      value = [],
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const resolvedOptions = React.useMemo(
      () => (options && options.length > 0 ? options : mock ? mockCascaderOptions() : []),
      [mock, options],
    );
    const selectedPath = React.useMemo(
      () => findOptionPath(resolvedOptions, value),
      [resolvedOptions, value],
    );
    const [activePath, setActivePath] = React.useState<CascaderOption[]>(selectedPath);
    const displayText = selectedPath.length > 0 ? selectedPath.map((option) => option.label).join(' / ') : '';
    const showClear = clearable && !disabled && selectedPath.length > 0;
    const columns = React.useMemo(() => buildColumns(resolvedOptions, activePath), [activePath, resolvedOptions]);

    const handleOpenChange = (nextOpen: boolean) => {
      if (disabled) {
        return;
      }

      // 每次打开时回到当前已选路径，避免上一次预览路径残留。
      if (nextOpen) {
        setActivePath(selectedPath);
      }

      setOpen(nextOpen);
    };

    const previewPath = (option: CascaderOption, level: number) => {
      setActivePath((currentPath) => keepDescendantsWhenSameNode(currentPath, option, level));
    };

    const commitLeaf = (option: CascaderOption, level: number) => {
      const nextPath = [...activePath.slice(0, level), option];

      if (hasChildren(option)) {
        setActivePath((currentPath) => keepDescendantsWhenSameNode(currentPath, option, level));
        return;
      }

      onChange?.(
        nextPath.map((pathOption) => pathOption.value),
        nextPath,
      );
      setActivePath(nextPath);
      setOpen(false);
    };

    const clearValue = () => {
      onChange?.([], []);
      setActivePath([]);
      setOpen(false);
    };

    return (
      <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
        <div ref={ref} className={cn('relative w-full', className)} {...props}>
          <PopoverPrimitive.Trigger asChild>
            <button
              type="button"
              role="combobox"
              aria-expanded={open}
              aria-label={displayText || placeholder}
              disabled={disabled}
              className={cn(
                'flex items-center justify-between gap-2 pr-10 text-left shadow-sm',
                showClear && 'pr-16',
                uiStyles.controlBase,
                uiStyles.focusRing,
                uiStyles.controlDisabled,
                !disabled && uiStyles.formControlHover,
              )}
            >
              <span
                className={cn(
                  'min-w-0 flex-1 truncate',
                  !displayText && uiStyles.placeholderText,
                )}
              >
                {displayText || placeholder}
              </span>
              <span
                className={cn(
                  uiStyles.mutedIconSlot,
                  'transition-transform duration-200',
                  open && 'rotate-180 text-primary dark:text-primary-dark',
                )}
                aria-hidden="true"
              >
                <ChevronDown />
              </span>
            </button>
          </PopoverPrimitive.Trigger>

          {showClear ? (
            <button
              type="button"
              aria-label="清除选择"
              className={cn('absolute right-9 top-1/2 size-6 -translate-y-1/2', uiStyles.closeButton)}
              onClick={clearValue}
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          ) : null}
        </div>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            align="start"
            sideOffset={8}
            className={cn(
              'flex max-w-[min(92vw,64rem)] gap-2 overflow-x-auto p-2',
              uiStyles.floatingBackdropContent,
              uiStyles.floatingStateMotion,
              uiStyles.floatingSideMotion,
            )}
          >
            {resolvedOptions.length > 0 ? (
              columns.map((columnOptions, level) => (
                <div
                  key={level}
                  role="menu"
                  className={cn(
                    'max-h-72 min-w-52 overflow-y-auto p-1.5 shadow-lg',
                    level % 2 === 0 ? uiStyles.optionPanelSurface : uiStyles.optionPanelBackground,
                  )}
                >
                  {columnOptions.map((option) => {
                    const optionHasChildren = hasChildren(option);
                    const isActive = activePath[level]?.value === option.value;
                    const isSelectedPathNode = selectedPath[level]?.value === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        role="menuitem"
                        aria-haspopup={optionHasChildren ? 'menu' : undefined}
                        aria-expanded={optionHasChildren ? isActive : undefined}
                        className={cn(
                          'group flex h-10 w-full items-center gap-2 rounded-xl px-3 text-left text-sm',
                          uiStyles.optionItemInteractive,
                          (isActive || isSelectedPathNode) && uiStyles.activePrimarySoft,
                        )}
                        onMouseEnter={() => previewPath(option, level)}
                        onFocus={() => previewPath(option, level)}
                        onClick={() => commitLeaf(option, level)}
                      >
                        <span className="min-w-0 flex-1 truncate">{option.label}</span>
                        {optionHasChildren ? (
                          <ChevronRight
                            className={cn(
                              'size-4 shrink-0 text-muted-foreground transition-transform duration-150 group-hover:translate-x-0.5 dark:text-muted-dark-foreground',
                              isActive && 'text-primary dark:text-primary-dark',
                            )}
                            aria-hidden="true"
                          />
                        ) : isSelectedPathNode ? (
                          <Check className="size-4 shrink-0 text-primary dark:text-primary-dark" aria-hidden="true" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              ))
            ) : (
              <div className={cn('min-w-52 px-4 py-8', uiStyles.emptyStateSurface)}>
                暂无可选项
              </div>
            )}
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    );
  },
);

Cascader.displayName = 'Cascader';
