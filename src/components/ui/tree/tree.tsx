import * as React from 'react';
import { ChevronDown, ChevronRight, Circle } from 'lucide-react';

import { cn } from '../../../lib/utils';
import { hasChildItems } from '../shared/logic';
import { uiStyles } from '../shared/styles';

export type TreeKey = string | number;

export interface TreeNode {
  /** 节点标题。 */
  title: React.ReactNode;
  /** 节点唯一键。 */
  key: TreeKey;
  /** 子节点。 */
  children?: TreeNode[];
  /** 禁用后不可选中。 */
  disabled?: boolean;
}

export interface TreeProps extends Omit<React.HTMLAttributes<HTMLUListElement>, 'onSelect'> {
  /** 树数据。 */
  data: TreeNode[];
  /** 默认展开节点。 */
  defaultExpandedKeys?: TreeKey[];
  /** 受控选中节点。 */
  selectedKey?: TreeKey;
  /** 默认选中节点。 */
  defaultSelectedKey?: TreeKey;
  /** 选中回调。 */
  onSelect?: (key: TreeKey) => void;
}

const isSameKey = (left: TreeKey, right: TreeKey) => String(left) === String(right);

const keySetFrom = (keys: TreeKey[] | undefined) => new Set((keys ?? []).map(String));

const TreeNodeView = ({
  depth,
  expandedKeys,
  node,
  onSelect,
  selectedKey,
  setExpandedKeys,
  setSelectedKey,
}: {
  depth: number;
  expandedKeys: Set<string>;
  node: TreeNode;
  onSelect?: (key: TreeKey) => void;
  selectedKey?: TreeKey;
  setExpandedKeys: React.Dispatch<React.SetStateAction<Set<string>>>;
  setSelectedKey: (key: TreeKey) => void;
}) => {
  const hasChildren = hasChildItems(node);
  const expanded = expandedKeys.has(String(node.key));
  const selected = selectedKey !== undefined && isSameKey(selectedKey, node.key);

  const toggleExpanded = () => {
    setExpandedKeys((currentKeys) => {
      const nextKeys = new Set(currentKeys);

      if (expanded) {
        nextKeys.delete(String(node.key));
      } else {
        nextKeys.add(String(node.key));
      }

      return nextKeys;
    });
  };

  const handleSelect = () => {
    if (node.disabled) {
      return;
    }

    setSelectedKey(node.key);
    onSelect?.(node.key);
  };

  return (
    <li>
      <div className="flex items-center gap-1" style={{ paddingLeft: depth ? `${depth}rem` : undefined }}>
        {hasChildren ? (
          <button
            type="button"
            aria-label={`${expanded ? '收起' : '展开'} ${node.title}`}
            className={cn('size-7', uiStyles.iconGhostButton)}
            onClick={toggleExpanded}
          >
            {expanded ? <ChevronDown className="size-4" aria-hidden="true" /> : <ChevronRight className="size-4" aria-hidden="true" />}
          </button>
        ) : (
          <span className={cn('flex size-7 items-center justify-center', uiStyles.textMuted)}>
            <Circle className="size-2" aria-hidden="true" />
          </span>
        )}
        <button
          type="button"
          role="treeitem"
          aria-expanded={hasChildren ? expanded : undefined}
          aria-selected={selected}
          disabled={node.disabled}
          className={cn(
            'min-h-9 min-w-0 flex-1 rounded-xl px-3 py-2 text-left text-sm transition-colors',
            selected ? 'bg-primary-soft font-medium text-primary dark:bg-primary-dark-soft dark:text-primary-dark' : uiStyles.textForeground,
            !selected && !node.disabled && uiStyles.primarySurfaceHover,
            uiStyles.buttonFocusVisibleRing,
            uiStyles.buttonDisabled,
          )}
          onClick={handleSelect}
        >
          {node.title}
        </button>
      </div>
      {hasChildren && expanded ? (
        <ul role="group" className="mt-1 space-y-1">
          {node.children?.map((child) => (
            <TreeNodeView
              key={String(child.key)}
              depth={depth + 1}
              expandedKeys={expandedKeys}
              node={child}
              onSelect={onSelect}
              selectedKey={selectedKey}
              setExpandedKeys={setExpandedKeys}
              setSelectedKey={setSelectedKey}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
};

/** Tree 用于组织架构、权限范围和分类目录的基础树形展示。 */
export const Tree = React.forwardRef<HTMLUListElement, TreeProps>(
  (
    {
      className,
      data,
      defaultExpandedKeys,
      defaultSelectedKey,
      onSelect,
      selectedKey,
      ...props
    },
    ref,
  ) => {
    const [expandedKeys, setExpandedKeys] = React.useState(() => keySetFrom(defaultExpandedKeys));
    const [innerSelectedKey, setInnerSelectedKey] = React.useState<TreeKey | undefined>(defaultSelectedKey);
    const actualSelectedKey = selectedKey ?? innerSelectedKey;
    const isControlled = selectedKey !== undefined;

    const updateSelectedKey = (key: TreeKey) => {
      if (!isControlled) {
        setInnerSelectedKey(key);
      }
    };

    return (
      <ul ref={ref} role="tree" className={cn('space-y-1', className)} {...props}>
        {data.map((node) => (
          <TreeNodeView
            key={String(node.key)}
            depth={0}
            expandedKeys={expandedKeys}
            node={node}
            onSelect={onSelect}
            selectedKey={actualSelectedKey}
            setExpandedKeys={setExpandedKeys}
            setSelectedKey={updateSelectedKey}
          />
        ))}
      </ul>
    );
  },
);

Tree.displayName = 'Tree';
