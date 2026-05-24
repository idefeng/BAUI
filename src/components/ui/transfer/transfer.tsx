import * as React from 'react';
import { ChevronLeft, ChevronRight, Inbox, Search } from 'lucide-react';

import { cn } from '../../../lib/utils';
import { mockTransferData, type MockTransferItem } from '../../../utils/mock';
import { Button } from '../button';
import { Checkbox } from '../checkbox';
import { Input } from '../input';
import { clampNumber } from '../shared/logic';
import { uiStyles } from '../shared/styles';

export interface TransferItem {
  key: string;
  title: string;
  description?: string;
  disabled?: boolean;
}

export interface TransferProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  /** 源数据；真实数据优先于 mock。 */
  dataSource?: TransferItem[];
  /** 受控右侧 key 列表。 */
  targetKeys?: string[];
  /** 非受控初始右侧 key 列表。 */
  defaultTargetKeys?: string[];
  /** 左右移动后的右侧 key 列表回调。 */
  onChange?: (targetKeys: string[]) => void;
  /** 左右面板标题。 */
  titles?: [string, string];
  /** 开启后在未传 dataSource 时使用中央 mock 候选人数据。 */
  mock?: boolean;
  /** 是否允许在面板内按住并拖过条目进行连续选择。 */
  dragSelect?: boolean;
}

type TransferDirection = 'source' | 'target';

const defaultTitles: [string, string] = ['可选项', '已选项'];

const normalizeItems = (items: TransferItem[] | MockTransferItem[]) => items.map((item) => ({ ...item }));

const uniqueKeys = (keys: string[]) => Array.from(new Set(keys));

const orderKeysBySource = (keys: string[], dataSource: TransferItem[]) => {
  const keySet = new Set(keys);

  return dataSource.filter((item) => keySet.has(item.key)).map((item) => item.key);
};

const includesKeyword = (item: TransferItem, keyword: string) => {
  const normalizedKeyword = keyword.trim().toLowerCase();

  if (!normalizedKeyword) {
    return true;
  }

  return `${item.title} ${item.description ?? ''}`.toLowerCase().includes(normalizedKeyword);
};

interface TransferPanelProps {
  allSelected?: boolean;
  dragSelect?: boolean;
  direction: TransferDirection;
  items: TransferItem[];
  partiallySelected?: boolean;
  searchValue: string;
  selectedKeys: string[];
  title: string;
  onDragItemEnd: () => void;
  onDragItemEnter: (direction: TransferDirection, key: string) => void;
  onDragItemStart: (direction: TransferDirection, key: string) => void;
  onKeyboardRange: (direction: TransferDirection, key: string, offset: number) => void;
  onSearchChange: (value: string) => void;
  onToggleAll: (direction: TransferDirection, checked: boolean) => void;
  onToggleItem: (key: string, checked: boolean) => void;
}

const TransferPanel = ({
  allSelected = false,
  direction,
  dragSelect = false,
  items,
  onDragItemEnd,
  onDragItemEnter,
  onDragItemStart,
  onKeyboardRange,
  onSearchChange,
  onToggleAll,
  onToggleItem,
  partiallySelected = false,
  searchValue,
  selectedKeys,
  title,
}: TransferPanelProps) => {
  const enabledItems = items.filter((item) => !item.disabled);
  const selectAllChecked = allSelected ? true : partiallySelected ? 'indeterminate' : false;

  return (
    <section
      data-testid={`ui-transfer-panel-${direction}`}
      className={cn('flex min-h-80 min-w-0 flex-1 flex-col overflow-hidden', uiStyles.surfaceShell)}
    >
      <header className={cn('flex items-center justify-between gap-3 border-b px-4 py-3', uiStyles.borderDefault)}>
        <h3 className={cn('truncate text-sm font-semibold', uiStyles.textForeground)}>{title}</h3>
        <div className="flex shrink-0 items-center gap-3">
          <Checkbox
            aria-label={`全选${title}`}
            checked={selectAllChecked}
            disabled={enabledItems.length === 0}
            onChange={(checked) => onToggleAll(direction, checked)}
          />
          <span className={cn('rounded-full px-2.5 py-1 text-xs font-medium', uiStyles.activePrimarySoft)}>
            {items.length}
          </span>
        </div>
      </header>
      <div className={cn('border-b p-3', uiStyles.borderDefault)}>
        <Input
          aria-label={`搜索${title}`}
          placeholder={`搜索${title}`}
          prefixIcon={<Search />}
          value={searchValue}
          onChange={(event) => onSearchChange(event.currentTarget.value)}
        />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {items.length > 0 ? (
          <ul className="grid gap-2">
            {items.map((item) => {
              const checked = selectedKeys.includes(item.key);

              return (
                <li key={item.key}>
                  <label
                    data-testid={`ui-transfer-option-${direction}-${item.key}`}
                    className={cn(
                      'flex items-start gap-3 rounded-xl border border-transparent px-3 py-3 transition-all duration-150',
                      dragSelect && !item.disabled && 'cursor-pointer select-none',
                      checked
                        ? 'border-primary/30 bg-primary-soft dark:border-primary-dark/30 dark:bg-primary-dark-soft'
                        : 'hover:border-border hover:bg-primary-soft/70 dark:hover:border-border-dark dark:hover:bg-primary-dark-soft/40',
                      item.disabled && 'cursor-not-allowed opacity-50',
                    )}
                    onPointerDown={(event) => {
                      if (!dragSelect || item.disabled || (event.button !== undefined && event.button !== 0)) {
                        return;
                      }

                      event.preventDefault();
                      onDragItemStart(direction, item.key);
                    }}
                    onPointerEnter={() => {
                      if (!dragSelect || item.disabled) {
                        return;
                      }

                      onDragItemEnter(direction, item.key);
                    }}
                    onPointerUp={() => {
                      if (!dragSelect) {
                        return;
                      }

                      onDragItemEnd();
                    }}
                  >
                    <Checkbox
                      aria-label={`选择 ${item.title}`}
                      checked={checked}
                      disabled={item.disabled}
                      onChange={(nextChecked) => onToggleItem(item.key, nextChecked)}
                      onKeyDown={(event) => {
                        if (!event.shiftKey || (event.key !== 'ArrowDown' && event.key !== 'ArrowUp')) {
                          return;
                        }

                        event.preventDefault();
                        onKeyboardRange(direction, item.key, event.key === 'ArrowDown' ? 1 : -1);
                      }}
                    />
                    <span className="min-w-0 flex-1">
                      <span className={cn('block truncate text-sm font-medium', uiStyles.textForeground)}>
                        {item.title}
                      </span>
                      {item.description ? (
                        <span className={cn('mt-1 block line-clamp-2 text-xs leading-5', uiStyles.textMuted)}>
                          {item.description}
                        </span>
                      ) : null}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className={cn('flex h-full min-h-40 flex-col items-center justify-center gap-2 text-sm', uiStyles.textMuted)}>
            <Inbox className="size-8" aria-hidden="true" />
            暂无数据
          </div>
        )}
      </div>
    </section>
  );
};

export function Transfer({
  className,
  dataSource,
  defaultTargetKeys = [],
  dragSelect = false,
  mock = false,
  onChange,
  targetKeys,
  titles = defaultTitles,
  ...props
}: TransferProps) {
  const resolvedDataSource = React.useMemo(
    () => (dataSource !== undefined ? normalizeItems(dataSource) : mock ? normalizeItems(mockTransferData()) : []),
    [dataSource, mock],
  );
  const isControlled = targetKeys !== undefined;
  const [innerTargetKeys, setInnerTargetKeys] = React.useState(defaultTargetKeys);
  const [sourceSearch, setSourceSearch] = React.useState('');
  const [targetSearch, setTargetSearch] = React.useState('');
  const [selectedSourceKeys, setSelectedSourceKeys] = React.useState<string[]>([]);
  const [selectedTargetKeys, setSelectedTargetKeys] = React.useState<string[]>([]);
  const dragSelectionRef = React.useRef<{ direction: TransferDirection } | null>(null);
  const keyboardAnchorRef = React.useRef<Record<TransferDirection, string | null>>({ source: null, target: null });
  const currentTargetKeys = isControlled ? targetKeys : innerTargetKeys;
  const targetKeySet = React.useMemo(() => new Set(currentTargetKeys), [currentTargetKeys]);
  const sourceItems = resolvedDataSource.filter((item) => !targetKeySet.has(item.key));
  const targetItems = resolvedDataSource.filter((item) => targetKeySet.has(item.key));
  const filteredSourceItems = sourceItems.filter((item) => includesKeyword(item, sourceSearch));
  const filteredTargetItems = targetItems.filter((item) => includesKeyword(item, targetSearch));

  React.useEffect(() => {
    if (!dragSelect) {
      return undefined;
    }

    const stopDragSelection = () => {
      dragSelectionRef.current = null;
    };

    window.addEventListener('pointerup', stopDragSelection);

    return () => window.removeEventListener('pointerup', stopDragSelection);
  }, [dragSelect]);

  const commitTargetKeys = (nextTargetKeys: string[]) => {
    const orderedKeys = orderKeysBySource(uniqueKeys(nextTargetKeys), resolvedDataSource);

    if (!isControlled) {
      setInnerTargetKeys(orderedKeys);
    }

    onChange?.(orderedKeys);
  };

  const getVisibleItems = React.useCallback(
    (direction: TransferDirection) => (direction === 'source' ? filteredSourceItems : filteredTargetItems),
    [filteredSourceItems, filteredTargetItems],
  );

  const getSelectedKeys = (direction: TransferDirection) => (direction === 'source' ? selectedSourceKeys : selectedTargetKeys);

  const setSelectedKeys = (direction: TransferDirection, updater: React.SetStateAction<string[]>) => {
    const setter = direction === 'source' ? setSelectedSourceKeys : setSelectedTargetKeys;

    setter(updater);
  };

  const getPanelSelectionState = (direction: TransferDirection) => {
    const enabledKeys = getVisibleItems(direction)
      .filter((item) => !item.disabled)
      .map((item) => item.key);
    const selectedSet = new Set(getSelectedKeys(direction));
    const selectedCount = enabledKeys.filter((key) => selectedSet.has(key)).length;

    return {
      allSelected: enabledKeys.length > 0 && selectedCount === enabledKeys.length,
      partiallySelected: selectedCount > 0 && selectedCount < enabledKeys.length,
    };
  };

  const togglePanelItem = (direction: TransferDirection, key: string, checked: boolean) => {
    keyboardAnchorRef.current[direction] = key;
    const keys = getSelectedKeys(direction);

    setSelectedKeys(direction, checked ? uniqueKeys([...keys, key]) : keys.filter((item) => item !== key));
  };

  const togglePanelAll = (direction: TransferDirection, checked: boolean) => {
    const enabledKeys = getVisibleItems(direction)
      .filter((item) => !item.disabled)
      .map((item) => item.key);

    if (enabledKeys.length === 0) {
      return;
    }

    keyboardAnchorRef.current[direction] = checked ? enabledKeys[0] : null;
    setSelectedKeys(direction, (keys) => (checked ? uniqueKeys([...keys, ...enabledKeys]) : keys.filter((key) => !enabledKeys.includes(key))));
  };

  const selectKeyboardRange = (direction: TransferDirection, key: string, offset: number) => {
    const enabledKeys = getVisibleItems(direction)
      .filter((item) => !item.disabled)
      .map((item) => item.key);
    const currentIndex = enabledKeys.indexOf(key);

    if (currentIndex === -1) {
      return;
    }

    const targetIndex = clampNumber(currentIndex + offset, 0, enabledKeys.length - 1);
    const anchorKey = keyboardAnchorRef.current[direction] ?? key;
    const anchorIndex = enabledKeys.indexOf(anchorKey);
    const start = Math.min(anchorIndex === -1 ? currentIndex : anchorIndex, targetIndex);
    const end = Math.max(anchorIndex === -1 ? currentIndex : anchorIndex, targetIndex);
    const rangeKeys = enabledKeys.slice(start, end + 1);

    // Shift + 方向键只追加区间，避免破坏已经选好的非连续项。
    setSelectedKeys(direction, (keys) => uniqueKeys([...keys, ...rangeKeys]));
  };

  const addDragSelectedKey = React.useCallback(
    (direction: TransferDirection, key: string) => {
      const panelItems = direction === 'source' ? sourceItems : targetItems;
      const item = panelItems.find((candidate) => candidate.key === key);

      if (!item || item.disabled) {
        return;
      }

      // 拖拽选择只追加可移动项，避免反复进入同一条目时产生重复 key。
      const setKeys = direction === 'source' ? setSelectedSourceKeys : setSelectedTargetKeys;

      setKeys((keys) => uniqueKeys([...keys, key]));
    },
    [sourceItems, targetItems],
  );

  const startDragSelection = (direction: TransferDirection, key: string) => {
    dragSelectionRef.current = { direction };
    addDragSelectedKey(direction, key);
  };

  const enterDragSelection = (direction: TransferDirection, key: string) => {
    if (dragSelectionRef.current?.direction !== direction) {
      return;
    }

    addDragSelectedKey(direction, key);
  };

  const stopDragSelection = () => {
    dragSelectionRef.current = null;
  };

  const moveToTarget = () => {
    const movableKeys = sourceItems
      .filter((item) => selectedSourceKeys.includes(item.key) && !item.disabled)
      .map((item) => item.key);

    commitTargetKeys([...currentTargetKeys, ...movableKeys]);
    setSelectedSourceKeys([]);
  };

  const moveToSource = () => {
    const movableKeySet = new Set(
      targetItems.filter((item) => selectedTargetKeys.includes(item.key) && !item.disabled).map((item) => item.key),
    );

    commitTargetKeys(currentTargetKeys.filter((key) => !movableKeySet.has(key)));
    setSelectedTargetKeys([]);
  };

  const canMoveRight = selectedSourceKeys.some((key) => sourceItems.some((item) => item.key === key && !item.disabled));
  const canMoveLeft = selectedTargetKeys.some((key) => targetItems.some((item) => item.key === key && !item.disabled));

  return (
    <div
      {...props}
      className={cn('grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]', className)}
    >
      <TransferPanel
        {...getPanelSelectionState('source')}
        dragSelect={dragSelect}
        direction="source"
        items={filteredSourceItems}
        searchValue={sourceSearch}
        selectedKeys={selectedSourceKeys}
        title={titles[0]}
        onDragItemEnd={stopDragSelection}
        onDragItemEnter={enterDragSelection}
        onDragItemStart={startDragSelection}
        onKeyboardRange={selectKeyboardRange}
        onSearchChange={setSourceSearch}
        onToggleAll={togglePanelAll}
        onToggleItem={(key, checked) => togglePanelItem('source', key, checked)}
      />
      <div className="flex items-center justify-center gap-3 lg:flex-col">
        <Button aria-label="移至右侧" size="sm" disabled={!canMoveRight} className="size-10 rounded-full p-0" onClick={moveToTarget}>
          <ChevronRight className="size-4" aria-hidden="true" />
        </Button>
        <Button aria-label="移至左侧" size="sm" variant="outline" disabled={!canMoveLeft} className="size-10 rounded-full p-0" onClick={moveToSource}>
          <ChevronLeft className="size-4" aria-hidden="true" />
        </Button>
      </div>
      <TransferPanel
        {...getPanelSelectionState('target')}
        dragSelect={dragSelect}
        direction="target"
        items={filteredTargetItems}
        searchValue={targetSearch}
        selectedKeys={selectedTargetKeys}
        title={titles[1]}
        onDragItemEnd={stopDragSelection}
        onDragItemEnter={enterDragSelection}
        onDragItemStart={startDragSelection}
        onKeyboardRange={selectKeyboardRange}
        onSearchChange={setTargetSearch}
        onToggleAll={togglePanelAll}
        onToggleItem={(key, checked) => togglePanelItem('target', key, checked)}
      />
    </div>
  );
}

Transfer.displayName = 'Transfer';
