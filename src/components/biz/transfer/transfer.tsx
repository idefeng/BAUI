import * as React from 'react';
import { ChevronLeft, ChevronRight, Inbox, Search } from 'lucide-react';

import { cn } from '../../../lib/utils';
import { mockTransferData, mockTransferTargetKeys, type MockTransferItem } from '../../../utils/mock';
import { Button } from '../../ui/button';
import { Checkbox } from '../../ui/checkbox';
import { Input } from '../../ui/input';
import { uiStyles } from '../../ui/shared/styles';

export interface TransferItem {
  key: string;
  title: string;
  description?: string;
  disabled?: boolean;
}

export interface TransferProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  /** 源数据；mock=true 且未传入时自动注入公司候选人数据。 */
  dataSource?: TransferItem[];
  /** 右侧目标栏 key 数组；不传时组件内部托管，mock=true 会默认选中 3 项。 */
  targetKeys?: string[];
  /** 左右穿梭后返回最新右侧 key 数组。 */
  onChange?: (targetKeys: string[]) => void;
  /** 左右面板标题。 */
  titles?: [string, string];
  /** 是否启用内置企业候选人/权限 mock 数据。 */
  mock?: boolean;
}

type TransferDirection = 'source' | 'target';

const defaultTitles: [string, string] = ['未分配', '已分配'];

const normalizeTransferItems = (items: MockTransferItem[] | TransferItem[]): TransferItem[] =>
  items.map((item) => ({ ...item }));

const includesSearch = (item: TransferItem, keyword: string) => {
  const normalizedKeyword = keyword.trim().toLowerCase();

  if (!normalizedKeyword) {
    return true;
  }

  return `${item.title} ${item.description ?? ''}`.toLowerCase().includes(normalizedKeyword);
};

const uniqueKeys = (keys: string[]) => Array.from(new Set(keys));

const sortKeysByDataSource = (keys: string[], dataSource: TransferItem[]) => {
  const keySet = new Set(keys);

  return dataSource.filter((item) => keySet.has(item.key)).map((item) => item.key);
};

interface TransferPanelProps {
  allEnabledCount: number;
  direction: TransferDirection;
  items: TransferItem[];
  searchValue: string;
  selectedKeys: string[];
  title: string;
  onSearchChange: (value: string) => void;
  onToggleAll: (checked: boolean) => void;
  onToggleItem: (key: string, checked: boolean) => void;
}

const TransferPanel = ({
  allEnabledCount,
  direction,
  items,
  onSearchChange,
  onToggleAll,
  onToggleItem,
  searchValue,
  selectedKeys,
  title,
}: TransferPanelProps) => {
  const enabledVisibleKeys = items.filter((item) => !item.disabled).map((item) => item.key);
  const selectedVisibleKeys = enabledVisibleKeys.filter((key) => selectedKeys.includes(key));
  const allChecked = enabledVisibleKeys.length > 0 && selectedVisibleKeys.length === enabledVisibleKeys.length;
  const selectedCount = selectedKeys.length;

  return (
    <section
      data-testid={`transfer-panel-${direction}`}
      className={cn(
        'flex min-h-[24rem] min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-button',
        'dark:border-border-dark dark:bg-slate-900 dark:shadow-[0_24px_80px_-48px_rgb(15_23_42_/_0.95)]',
      )}
    >
      <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 dark:border-border-dark">
        <div className="flex min-w-0 items-center gap-3">
          <Checkbox
            aria-label={`全选 ${title}`}
            checked={allChecked}
            disabled={enabledVisibleKeys.length === 0}
            onChange={onToggleAll}
          />
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-foreground dark:text-foreground-dark">{title}</h3>
            <p data-testid={`transfer-count-${direction}`} className="text-xs text-muted-foreground dark:text-muted-dark-foreground">
              已选 {selectedCount}/{allEnabledCount} 项
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary dark:bg-primary-dark-soft dark:text-primary-dark">
          {items.length}
        </span>
      </header>

      <div className="border-b border-border p-3 dark:border-border-dark">
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
                  <div
                    className={cn(
                      'group flex items-start gap-3 rounded-xl border border-transparent px-3 py-3 transition-all duration-200',
                      checked
                        ? 'border-primary/30 bg-primary-soft dark:border-primary-dark/30 dark:bg-primary-dark-soft'
                        : 'hover:border-border hover:bg-primary-soft dark:hover:border-border-dark dark:hover:bg-slate-950',
                      item.disabled && 'cursor-not-allowed opacity-50',
                    )}
                  >
                    <Checkbox
                      aria-label={item.title}
                      checked={checked}
                      disabled={item.disabled}
                      onChange={(nextChecked) => onToggleItem(item.key, nextChecked)}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground dark:text-foreground-dark">{item.title}</p>
                      {item.description ? (
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground dark:text-muted-dark-foreground">
                          {item.description}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="flex h-full min-h-44 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border text-center text-muted-foreground dark:border-border-dark dark:text-muted-dark-foreground">
            <Inbox className="size-8" aria-hidden="true" />
            <p className="text-sm">暂无匹配数据</p>
          </div>
        )}
      </div>
    </section>
  );
};

/** Transfer 公司业务穿梭框，适用于学员分配、权限授权和候选人流转。 */
export function Transfer({
  className,
  dataSource,
  mock = false,
  onChange,
  targetKeys,
  titles = defaultTitles,
  ...props
}: TransferProps) {
  const resolvedDataSource = React.useMemo(
    () => (dataSource && dataSource.length > 0 ? normalizeTransferItems(dataSource) : mock ? mockTransferData() : []),
    [dataSource, mock],
  );
  const isControlled = targetKeys !== undefined;
  const [innerTargetKeys, setInnerTargetKeys] = React.useState(() =>
    mock && targetKeys === undefined ? mockTransferTargetKeys(resolvedDataSource, Date.now(), 3) : [],
  );
  const [sourceSearch, setSourceSearch] = React.useState('');
  const [targetSearch, setTargetSearch] = React.useState('');
  const [selectedSourceKeys, setSelectedSourceKeys] = React.useState<string[]>([]);
  const [selectedTargetKeys, setSelectedTargetKeys] = React.useState<string[]>([]);
  const currentTargetKeys = isControlled ? targetKeys : innerTargetKeys;
  const currentTargetKeySet = React.useMemo(() => new Set(currentTargetKeys), [currentTargetKeys]);
  const sourceItems = resolvedDataSource.filter((item) => !currentTargetKeySet.has(item.key));
  const targetItems = resolvedDataSource.filter((item) => currentTargetKeySet.has(item.key));
  const filteredSourceItems = sourceItems.filter((item) => includesSearch(item, sourceSearch));
  const filteredTargetItems = targetItems.filter((item) => includesSearch(item, targetSearch));
  const sourceEnabledCount = sourceItems.filter((item) => !item.disabled).length;
  const targetEnabledCount = targetItems.filter((item) => !item.disabled).length;

  const commitTargetKeys = (nextTargetKeys: string[]) => {
    const orderedKeys = sortKeysByDataSource(uniqueKeys(nextTargetKeys), resolvedDataSource);

    if (!isControlled) {
      setInnerTargetKeys(orderedKeys);
    }

    onChange?.(orderedKeys);
  };

  const toggleSelection = (
    selectedKeys: string[],
    setSelectedKeys: React.Dispatch<React.SetStateAction<string[]>>,
    key: string,
    checked: boolean,
  ) => {
    setSelectedKeys(checked ? uniqueKeys([...selectedKeys, key]) : selectedKeys.filter((item) => item !== key));
  };

  const togglePanelSelection = (
    items: TransferItem[],
    selectedKeys: string[],
    setSelectedKeys: React.Dispatch<React.SetStateAction<string[]>>,
    checked: boolean,
  ) => {
    const enabledVisibleKeys = items.filter((item) => !item.disabled).map((item) => item.key);

    setSelectedKeys(
      checked
        ? uniqueKeys([...selectedKeys, ...enabledVisibleKeys])
        : selectedKeys.filter((key) => !enabledVisibleKeys.includes(key)),
    );
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
    <div className={cn('grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]', className)} {...props}>
      <TransferPanel
        allEnabledCount={sourceEnabledCount}
        direction="source"
        items={filteredSourceItems}
        searchValue={sourceSearch}
        selectedKeys={selectedSourceKeys}
        title={titles[0]}
        onSearchChange={setSourceSearch}
        onToggleAll={(checked) => togglePanelSelection(filteredSourceItems, selectedSourceKeys, setSelectedSourceKeys, checked)}
        onToggleItem={(key, checked) => toggleSelection(selectedSourceKeys, setSelectedSourceKeys, key, checked)}
      />

      <div className="flex items-center justify-center gap-3 lg:flex-col">
        <Button
          aria-label="移至右侧"
          size="sm"
          disabled={!canMoveRight}
          onClick={moveToTarget}
          className="size-10 rounded-full p-0 hover:scale-105"
        >
          <ChevronRight className="size-4" aria-hidden="true" />
        </Button>
        <Button
          aria-label="移至左侧"
          size="sm"
          variant="outline"
          disabled={!canMoveLeft}
          onClick={moveToSource}
          className="size-10 rounded-full p-0 hover:scale-105"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
        </Button>
        <span data-testid="transfer-total" className="sr-only">
          共 {resolvedDataSource.length} 项
        </span>
      </div>

      <TransferPanel
        allEnabledCount={targetEnabledCount}
        direction="target"
        items={filteredTargetItems}
        searchValue={targetSearch}
        selectedKeys={selectedTargetKeys}
        title={titles[1]}
        onSearchChange={setTargetSearch}
        onToggleAll={(checked) => togglePanelSelection(filteredTargetItems, selectedTargetKeys, setSelectedTargetKeys, checked)}
        onToggleItem={(key, checked) => toggleSelection(selectedTargetKeys, setSelectedTargetKeys, key, checked)}
      />
    </div>
  );
}

Transfer.displayName = 'Transfer';
