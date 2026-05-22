import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { ChevronDown, ChevronRight, X } from 'lucide-react';

import { cn } from '../../../lib/utils';
import { mockTreeData } from '../../../utils/mock';
import { Checkbox } from '../checkbox';
import { uiStyles } from '../shared/styles';

export interface TreeSelectNode {
  key: string;
  title: string;
  children?: TreeSelectNode[];
}

export interface TreeSelectProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** 树状数据源；mock=true 且未传数据时自动使用公司全球组织架构树。 */
  treeData?: TreeSelectNode[];
  /** 当前选中的 key 数组，多选模式会包含满足全选条件的父节点 key。 */
  value?: string[];
  /** 勾选状态变化时返回归一化后的 key 数组。 */
  onChange?: (value: string[]) => void;
  /** 未选择时展示的占位文案。 */
  placeholder?: string;
  /** 是否启用多选父子联动，默认 true。 */
  multiple?: boolean;
  /** 是否禁用触发器与树节点交互。 */
  disabled?: boolean;
  /** 开启后自动注入企业级 mock 树数据。 */
  mock?: boolean;
}

type SelectionState = 'checked' | 'indeterminate' | 'unchecked';

const hasChildren = (node: TreeSelectNode) => Boolean(node.children?.length);

const getDescendantKeys = (node: TreeSelectNode, includeSelf = true): string[] => [
  ...(includeSelf ? [node.key] : []),
  ...(node.children ?? []).flatMap((child) => getDescendantKeys(child, true)),
];

const createTreeIndexes = (nodes: TreeSelectNode[]) => {
  const nodeMap = new Map<string, TreeSelectNode>();
  const ancestorMap = new Map<string, string[]>();
  const parentKeys: string[] = [];

  const walk = (currentNodes: TreeSelectNode[], ancestors: string[]) => {
    currentNodes.forEach((node) => {
      nodeMap.set(node.key, node);
      ancestorMap.set(node.key, ancestors);

      if (hasChildren(node)) {
        parentKeys.push(node.key);
        walk(node.children ?? [], [...ancestors, node.key]);
      }
    });
  };

  walk(nodes, []);

  return { ancestorMap, nodeMap, parentKeys };
};

const expandParentSelections = (selectedKeys: string[], nodeMap: Map<string, TreeSelectNode>) => {
  const selectedSet = new Set(selectedKeys);

  selectedKeys.forEach((key) => {
    const node = nodeMap.get(key);

    if (node) {
      getDescendantKeys(node).forEach((descendantKey) => selectedSet.add(descendantKey));
    }
  });

  return selectedSet;
};

const getSelectionState = (node: TreeSelectNode, selectedSet: Set<string>): SelectionState => {
  if (!hasChildren(node)) {
    return selectedSet.has(node.key) ? 'checked' : 'unchecked';
  }

  const childStates = (node.children ?? []).map((child) => getSelectionState(child, selectedSet));
  const allChildrenChecked = childStates.length > 0 && childStates.every((state) => state === 'checked');
  const hasCheckedChild = childStates.some((state) => state === 'checked' || state === 'indeterminate');

  if (selectedSet.has(node.key) || allChildrenChecked) {
    return 'checked';
  }

  return hasCheckedChild ? 'indeterminate' : 'unchecked';
};

const normalizeTreeSelection = (
  nodes: TreeSelectNode[],
  selectedKeys: string[],
  nodeMap: Map<string, TreeSelectNode>,
) => {
  const expandedSet = expandParentSelections(selectedKeys, nodeMap);

  const visit = (node: TreeSelectNode): { keys: string[]; state: SelectionState } => {
    if (!hasChildren(node)) {
      const checked = expandedSet.has(node.key);

      return { keys: checked ? [node.key] : [], state: checked ? 'checked' : 'unchecked' };
    }

    const childResults = (node.children ?? []).map(visit);
    const allChildrenChecked = childResults.length > 0 && childResults.every((result) => result.state === 'checked');
    const hasCheckedChild = childResults.some((result) => result.state === 'checked' || result.state === 'indeterminate');
    const childKeys = childResults.flatMap((result) => result.keys);

    if (expandedSet.has(node.key) || allChildrenChecked) {
      return { keys: [node.key, ...childKeys], state: 'checked' };
    }

    return { keys: childKeys, state: hasCheckedChild ? 'indeterminate' : 'unchecked' };
  };

  return Array.from(new Set(nodes.flatMap((node) => visit(node).keys)));
};

const stateToCheckboxValue = (state: SelectionState) => {
  if (state === 'checked') {
    return true;
  }

  if (state === 'indeterminate') {
    return 'indeterminate';
  }

  return false;
};

export const TreeSelect = React.forwardRef<HTMLDivElement, TreeSelectProps>(
  (
    {
      className,
      disabled = false,
      mock = false,
      multiple = true,
      onChange,
      placeholder = '请选择',
      treeData,
      value = [],
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const resolvedTreeData = React.useMemo(
      () => (treeData && treeData.length > 0 ? treeData : mock ? mockTreeData() : []),
      [mock, treeData],
    );
    const { ancestorMap, nodeMap, parentKeys } = React.useMemo(
      () => createTreeIndexes(resolvedTreeData),
      [resolvedTreeData],
    );
    const [expandedKeys, setExpandedKeys] = React.useState<Set<string>>(() => new Set(parentKeys));
    const effectiveSelectedSet = React.useMemo(
      () => expandParentSelections(value, nodeMap),
      [nodeMap, value],
    );
    const selectedItems = React.useMemo(
      () => value.map((key) => nodeMap.get(key)).filter((node): node is TreeSelectNode => Boolean(node)),
      [nodeMap, value],
    );
    const selectedTitle = selectedItems[0]?.title;
    const triggerLabel = multiple
      ? selectedItems.length > 0
        ? selectedItems.map((node) => node.title).join('、')
        : placeholder
      : selectedTitle ?? placeholder;

    React.useEffect(() => {
      setExpandedKeys(new Set(parentKeys));
    }, [parentKeys]);

    const commitSelection = (nextSelectedKeys: string[]) => {
      onChange?.(normalizeTreeSelection(resolvedTreeData, nextSelectedKeys, nodeMap));
    };

    const toggleExpanded = (nodeKey: string) => {
      setExpandedKeys((currentKeys) => {
        const nextKeys = new Set(currentKeys);

        if (nextKeys.has(nodeKey)) {
          nextKeys.delete(nodeKey);
        } else {
          nextKeys.add(nodeKey);
        }

        return nextKeys;
      });
    };

    const toggleNode = (node: TreeSelectNode, currentState: SelectionState) => {
      if (disabled) {
        return;
      }

      if (!multiple) {
        onChange?.([node.key]);
        setOpen(false);
        return;
      }

      const nextKeys = new Set(value);
      const relatedKeys = getDescendantKeys(node);

      if (currentState === 'checked') {
        relatedKeys.forEach((key) => nextKeys.delete(key));
        (ancestorMap.get(node.key) ?? []).forEach((key) => nextKeys.delete(key));
      } else {
        relatedKeys.forEach((key) => nextKeys.add(key));
      }

      commitSelection(Array.from(nextKeys));
    };

    const removeTag = (node: TreeSelectNode) => {
      const nextKeys = new Set(value);

      getDescendantKeys(node).forEach((key) => nextKeys.delete(key));
      (ancestorMap.get(node.key) ?? []).forEach((key) => nextKeys.delete(key));
      commitSelection(Array.from(nextKeys));
    };

    const clearValue = () => {
      onChange?.([]);
      setOpen(false);
    };

    const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) {
        return;
      }

      if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
        event.preventDefault();
        setOpen(true);
      }

      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    const renderNode = (node: TreeSelectNode, level: number) => {
      const isExpanded = expandedKeys.has(node.key);
      const state = multiple
        ? getSelectionState(node, effectiveSelectedSet)
        : value[0] === node.key
          ? 'checked'
          : 'unchecked';

      return (
        <div key={node.key} className="grid gap-1">
          <div
            role="treeitem"
            aria-expanded={hasChildren(node) ? isExpanded : undefined}
            className={cn(
              'group flex min-h-10 items-center gap-2 rounded-xl px-2.5 py-1.5 text-sm transition-all duration-200 hover:bg-primary/5 dark:hover:bg-primary-dark-soft/50',
              state !== 'unchecked' && 'bg-primary/5 text-primary dark:bg-primary-dark-soft/50 dark:text-primary-dark',
              disabled && 'cursor-not-allowed opacity-60',
            )}
            style={{ paddingLeft: `${level * 14 + 10}px` }}
          >
            {hasChildren(node) ? (
              <button
                type="button"
                aria-label={`${isExpanded ? '折叠' : '展开'} ${node.title}`}
                className={cn(
                  'size-6',
                  uiStyles.iconGhostButton,
                  disabled && 'pointer-events-none',
                )}
                onClick={() => toggleExpanded(node.key)}
              >
                <ChevronRight
                  className={cn('size-4 transition-transform duration-200', isExpanded && 'rotate-90')}
                  aria-hidden="true"
                />
              </button>
            ) : (
              <span className="size-6 shrink-0" aria-hidden="true" />
            )}

            <Checkbox
              aria-label={node.title}
              checked={stateToCheckboxValue(state)}
              disabled={disabled}
              onChange={() => toggleNode(node, state)}
            />
            <button
              type="button"
              className={cn(
                'min-w-0 flex-1 truncate text-left text-foreground outline-none transition-colors focus:text-primary dark:text-slate-300 dark:focus:text-primary-dark',
                state !== 'unchecked' && 'font-medium text-primary dark:text-primary-dark',
                disabled && 'pointer-events-none',
              )}
              onClick={() => toggleNode(node, state)}
            >
              {node.title}
            </button>
          </div>

          {hasChildren(node) && isExpanded ? (
            <div role="group" className="grid gap-1">
              {(node.children ?? []).map((child) => renderNode(child, level + 1))}
            </div>
          ) : null}
        </div>
      );
    };

    return (
      <PopoverPrimitive.Root open={open} onOpenChange={(nextOpen) => !disabled && setOpen(nextOpen)}>
        <div ref={ref} className={cn('relative w-full', className)} {...props}>
          <PopoverPrimitive.Trigger asChild>
            <div
              role="combobox"
              tabIndex={disabled ? -1 : 0}
              aria-expanded={open}
              aria-disabled={disabled}
              aria-label={triggerLabel}
              data-disabled={disabled}
              data-testid="tree-select-trigger"
              className={cn(
                'flex min-h-11 cursor-pointer items-center justify-between gap-2 py-2 pr-10 text-left shadow-sm',
                selectedItems.length > 0 && !disabled && 'pr-16',
                selectedItems.length > 0 && multiple && 'h-auto',
                uiStyles.controlBase,
                uiStyles.focusRing,
                uiStyles.dataDisabledControl,
                !disabled && uiStyles.formControlHover,
              )}
              onKeyDown={handleTriggerKeyDown}
            >
              <div className="min-w-0 flex-1">
                {selectedItems.length > 0 ? (
                  multiple ? (
                    <div className="flex max-h-24 flex-wrap gap-1.5 overflow-y-auto pr-1">
                      {selectedItems.map((node) => (
                        <span
                          key={node.key}
                          className="inline-flex max-w-full items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground shadow-sm dark:bg-primary-dark dark:text-primary-dark-foreground"
                        >
                          <span className="max-w-36 truncate">{node.title}</span>
                          <button
                            type="button"
                            aria-label={`移除 ${node.title}`}
                            className="inline-flex size-4 items-center justify-center rounded-full text-current/80 transition-colors hover:bg-primary-foreground/20 hover:text-current focus:outline-none focus:ring-2 focus:ring-primary-foreground/40 dark:hover:bg-primary-dark-foreground/20"
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              removeTag(node);
                            }}
                            onPointerDown={(event) => event.stopPropagation()}
                          >
                            <X className="size-3" aria-hidden="true" />
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className={cn('block truncate text-sm font-medium', uiStyles.textForeground)}>
                      {selectedTitle}
                    </span>
                  )
                ) : (
                  <span className={cn('block truncate text-sm', uiStyles.textMuted)}>
                    {placeholder}
                  </span>
                )}
              </div>

              <span
                className={cn(
                  uiStyles.mutedIconSlot,
                  'absolute right-4 top-1/2 -translate-y-1/2 transition-transform duration-200',
                  open && 'rotate-180 text-primary dark:text-primary-dark',
                )}
                aria-hidden="true"
              >
                <ChevronDown />
              </span>
            </div>
          </PopoverPrimitive.Trigger>

          {selectedItems.length > 0 && !disabled ? (
            <button
              type="button"
              aria-label="清空选择"
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
            data-testid="tree-select-content"
            className={cn(
              'z-50 w-[var(--radix-popover-trigger-width)] min-w-72 overflow-hidden rounded-2xl border border-border bg-white p-2 text-foreground shadow-xl dark:border-border-dark dark:bg-slate-950 dark:text-slate-200',
              uiStyles.floatingStateMotion,
              uiStyles.floatingSideMotion,
            )}
          >
            <div
              role="tree"
              aria-multiselectable={multiple}
              className="max-h-80 overflow-y-auto rounded-xl bg-surface/80 p-1 dark:bg-slate-900/70"
            >
              {resolvedTreeData.length > 0 ? (
                resolvedTreeData.map((node) => renderNode(node, 0))
              ) : (
                <div className={cn('px-3 py-8 text-center text-sm', uiStyles.textMuted)}>
                  暂无可选节点
                </div>
              )}
            </div>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    );
  },
);

TreeSelect.displayName = 'TreeSelect';
