import * as React from 'react';

import { cn } from '../../../lib/utils';
import {
  mockMentionOptions,
  type MockMentionOption,
} from '../../../utils/mock';
import { uiStyles } from '../shared/styles';

export interface MentionsProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'defaultValue' | 'onChange' | 'onSelect' | 'value'> {
  /** 当前文本内容；传入后组件进入受控模式。 */
  value?: string;
  /** 非受控模式下的初始文本内容。 */
  defaultValue?: string;
  /** 可提及人员列表；真实业务数据优先于 mock。 */
  options?: MockMentionOption[];
  /** 文本变化回调。 */
  onValueChange?: (value: string) => void;
  /** 选中提及项后的回调。 */
  onSelect?: (option: MockMentionOption) => void;
  /** 开启后在未传 options 时从中央 mock 人员数据读取提及项。 */
  mock?: boolean;
  /** 触发提及的前缀字符，默认 @。 */
  prefix?: string;
  /** 无匹配项时展示的内容。 */
  emptyText?: React.ReactNode;
  /** 外层容器类名，用于控制宽度。 */
  rootClassName?: string;
}

interface MentionQuery {
  start: number;
  query: string;
}

const getMentionQuery = (value: string, prefix: string): MentionQuery | undefined => {
  const start = value.lastIndexOf(prefix);

  if (start < 0) {
    return undefined;
  }

  const query = value.slice(start + prefix.length);

  // 只在当前 token 内展示建议，遇到空白代表提及已经结束。
  if (/\s/.test(query)) {
    return undefined;
  }

  return { start, query };
};

export const Mentions = React.forwardRef<HTMLTextAreaElement, MentionsProps>(
  (
    {
      className,
      defaultValue = '',
      disabled = false,
      emptyText = '暂无匹配成员',
      mock = false,
      onBlur,
      onFocus,
      onSelect,
      onValueChange,
      options,
      prefix = '@',
      rootClassName,
      value,
      ...props
    },
    ref,
  ) => {
    const isControlled = value !== undefined;
    const [innerValue, setInnerValue] = React.useState(defaultValue);
    const [focused, setFocused] = React.useState(false);
    const currentValue = isControlled ? value : innerValue;
    const mentionQuery = getMentionQuery(currentValue, prefix);
    const actualOptions = React.useMemo(
      () => options ?? (mock ? mockMentionOptions() : []),
      [mock, options],
    );
    const filteredOptions = React.useMemo(() => {
      if (!mentionQuery) {
        return [];
      }

      const query = mentionQuery.query.trim().toLowerCase();

      return actualOptions.filter((option) =>
        `${option.label} ${option.value}`.toLowerCase().includes(query),
      );
    }, [actualOptions, mentionQuery]);
    const showOptions = focused && mentionQuery !== undefined;

    const updateValue = (nextValue: string) => {
      if (!isControlled) {
        setInnerValue(nextValue);
      }

      onValueChange?.(nextValue);
    };

    const handleSelect = (option: MockMentionOption) => {
      if (!mentionQuery) {
        return;
      }

      // 将当前触发 token 替换成完整展示名，保留末尾空格便于继续输入。
      const nextValue = `${currentValue.slice(0, mentionQuery.start)}${prefix}${option.label} `;

      updateValue(nextValue);
      onSelect?.(option);
    };

    return (
      <div className={cn('relative w-full', rootClassName)}>
        <textarea
          {...props}
          ref={ref}
          disabled={disabled}
          value={currentValue}
          className={cn(
            'min-h-28 resize-y py-3 leading-6',
            uiStyles.controlBase,
            uiStyles.focusRing,
            uiStyles.controlDisabled,
            className,
          )}
          onBlur={(event) => {
            onBlur?.(event);
            window.setTimeout(() => setFocused(false), 80);
          }}
          onChange={(event) => updateValue(event.currentTarget.value)}
          onFocus={(event) => {
            onFocus?.(event);
            setFocused(true);
          }}
        />
        {showOptions ? (
          <div
            role="listbox"
            className={cn(
              'absolute left-0 right-0 top-full z-50 mt-2 max-h-64 overflow-y-auto p-1',
              uiStyles.floatingContent,
            )}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-label={option.label}
                  className={cn(
                    'flex w-full flex-col rounded-xl px-3 py-2 text-left text-sm',
                    uiStyles.optionItemInteractive,
                  )}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => handleSelect(option)}
                >
                  <span className="font-medium">{option.label}</span>
                  {option.description ? (
                    <span className={cn('mt-0.5 text-xs', uiStyles.textMuted)}>
                      {option.description}
                    </span>
                  ) : null}
                </button>
              ))
            ) : (
              <div className={cn('px-3 py-6 text-center text-sm', uiStyles.textMuted)}>
                {emptyText}
              </div>
            )}
          </div>
        ) : null}
      </div>
    );
  },
);

Mentions.displayName = 'Mentions';
