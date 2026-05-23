import * as React from 'react';
import { Search } from 'lucide-react';

import { cn } from '../../../lib/utils';
import {
  mockAutoCompleteOptions,
  type MockSelectOptionType,
} from '../../../utils/mock';
import { Input, type InputProps } from '../input';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '../popover';
import { uiStyles } from '../shared/styles';

export interface AutoCompleteOption {
  value: string;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export interface AutoCompleteProps
  extends Omit<InputProps, 'defaultValue' | 'mock' | 'onChange' | 'onSelect' | 'value'> {
  /** 当前输入值；传入后组件进入受控模式。 */
  value?: string;
  /** 非受控模式下的初始输入值。 */
  defaultValue?: string;
  /** 可选项列表，真实业务数据优先级高于 mock。 */
  options?: AutoCompleteOption[];
  /** 输入值变化回调，适合外部联动远程搜索。 */
  onValueChange?: (value: string) => void;
  /** 选中某个建议项后的回调。 */
  onSelect?: (option: AutoCompleteOption) => void;
  /** 开启后在未传 options 时从中央 mock 数据读取项目选项。 */
  mock?: boolean;
  /** Mock 数据类型，默认展示培训项目。 */
  mockType?: MockSelectOptionType;
  /** 自定义过滤逻辑；默认按 label/value 做大小写不敏感包含匹配。 */
  filterOption?: (inputValue: string, option: AutoCompleteOption) => boolean;
  /** 无匹配项时展示的内容。 */
  emptyText?: React.ReactNode;
  /** 建议浮层受控打开状态。 */
  open?: boolean;
  /** 建议浮层默认打开状态。 */
  defaultOpen?: boolean;
  /** 建议浮层打开状态变化回调。 */
  onOpenChange?: (open: boolean) => void;
}

const getOptionLabel = (option: AutoCompleteOption) => option.label ?? option.value;

const defaultFilterOption = (inputValue: string, option: AutoCompleteOption) => {
  const query = inputValue.trim().toLowerCase();

  if (!query) {
    return true;
  }

  return `${getOptionLabel(option)} ${option.value}`.toLowerCase().includes(query);
};

export const AutoComplete = React.forwardRef<HTMLInputElement, AutoCompleteProps>(
  (
    {
      className,
      defaultOpen = false,
      defaultValue = '',
      disabled = false,
      emptyText = '暂无匹配结果',
      filterOption = defaultFilterOption,
      mock = false,
      mockType = 'project',
      onBlur,
      onFocus,
      onKeyDown,
      onOpenChange,
      onSelect,
      onValueChange,
      open,
      options,
      placeholder = '请输入关键词',
      prefixIcon = <Search />,
      rootClassName,
      value,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const listboxId = `${generatedId}-listbox`;
    const isValueControlled = value !== undefined;
    const isOpenControlled = open !== undefined;
    const [innerValue, setInnerValue] = React.useState(defaultValue);
    const [innerOpen, setInnerOpen] = React.useState(defaultOpen);
    const inputValue = isValueControlled ? value : innerValue;
    const actualOpen = isOpenControlled ? open : innerOpen;
    const actualOptions = React.useMemo<AutoCompleteOption[]>(() => {
      if (options !== undefined) {
        return options;
      }

      if (!mock) {
        return [];
      }

      return mockAutoCompleteOptions(mockType).map((option) => ({ ...option }));
    }, [mock, mockType, options]);
    const filteredOptions = React.useMemo(
      () => actualOptions.filter((option) => filterOption(inputValue, option)),
      [actualOptions, filterOption, inputValue],
    );
    const shouldShowPanel = actualOpen && !disabled;

    const updateOpen = React.useCallback(
      (nextOpen: boolean) => {
        if (!isOpenControlled) {
          setInnerOpen(nextOpen);
        }

        onOpenChange?.(nextOpen);
      },
      [isOpenControlled, onOpenChange],
    );

    const updateValue = React.useCallback(
      (nextValue: string) => {
        if (!isValueControlled) {
          setInnerValue(nextValue);
        }

        onValueChange?.(nextValue);
      },
      [isValueControlled, onValueChange],
    );

    const handleSelect = (option: AutoCompleteOption) => {
      if (option.disabled) {
        return;
      }

      // 选中后使用展示文案回填输入框，value 保留给业务提交。
      updateValue(getOptionLabel(option));
      onSelect?.(option);
      updateOpen(false);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      updateValue(event.currentTarget.value);
      updateOpen(true);
    };

    return (
      <Popover open={shouldShowPanel} onOpenChange={updateOpen}>
        <PopoverAnchor asChild>
          <div className={cn('w-full', className)}>
            <Input
              {...props}
              ref={ref}
              role="combobox"
              aria-autocomplete="list"
              aria-controls={listboxId}
              aria-expanded={shouldShowPanel}
              disabled={disabled}
              value={inputValue}
              placeholder={placeholder}
              prefixIcon={prefixIcon}
              rootClassName={rootClassName}
              onBlur={onBlur}
              onChange={handleChange}
              onFocus={(event) => {
                onFocus?.(event);
                updateOpen(true);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  updateOpen(false);
                }

                onKeyDown?.(event);
              }}
            />
          </div>
        </PopoverAnchor>
        <PopoverContent
          id={listboxId}
          role="listbox"
          align="start"
          sideOffset={8}
          onOpenAutoFocus={(event) => event.preventDefault()}
          className="w-[var(--radix-popover-trigger-width)] min-w-64 p-1"
        >
          {filteredOptions.length > 0 ? (
            <div className="max-h-64 overflow-y-auto">
              {filteredOptions.map((option) => {
                const label = getOptionLabel(option);

                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={inputValue === label}
                    disabled={option.disabled}
                    className={cn(
                      'flex w-full flex-col rounded-xl px-3 py-2 text-left text-sm',
                      uiStyles.optionItemInteractive,
                      option.disabled && 'cursor-not-allowed opacity-50',
                    )}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleSelect(option)}
                  >
                    <span className="font-medium">{label}</span>
                    {option.description ? (
                      <span className={cn('mt-0.5 text-xs', uiStyles.textMuted)}>
                        {option.description}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className={cn('px-3 py-6 text-center text-sm', uiStyles.textMuted)}>
              {emptyText}
            </div>
          )}
        </PopoverContent>
      </Popover>
    );
  },
);

AutoComplete.displayName = 'AutoComplete';
