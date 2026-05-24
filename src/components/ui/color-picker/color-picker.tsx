import * as React from 'react';
import { RotateCcw } from 'lucide-react';

import { cn } from '../../../lib/utils';
import {
  mockColorOptions,
  type MockColorOption,
} from '../../../utils/mock';
import { uiStyles } from '../shared/styles';

export interface ColorPickerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  /** 当前颜色值；支持任意合法 CSS color 字符串，传入后组件进入受控模式。 */
  value?: string;
  /** 非受控模式下的初始颜色值。 */
  defaultValue?: string;
  /** 预设色列表；真实业务预设优先于 mock。 */
  presets?: MockColorOption[];
  /** 开启后在未传 presets 时使用中央 mock 预设色。 */
  mock?: boolean;
  /** 颜色变化回调；清空时返回空字符串。 */
  onChange?: (value: string) => void;
  /** 是否展示清除按钮。 */
  allowClear?: boolean;
  /** 禁用后不可编辑或选择预设。 */
  disabled?: boolean;
}

export const ColorPicker = React.forwardRef<HTMLDivElement, ColorPickerProps>(
  (
    {
      allowClear = false,
      className,
      defaultValue = '',
      disabled = false,
      mock = false,
      onChange,
      presets,
      value,
      ...props
    },
    ref,
  ) => {
    const isControlled = value !== undefined;
    const [innerValue, setInnerValue] = React.useState(defaultValue);
    const currentValue = isControlled ? value : innerValue;
    const actualPresets = React.useMemo(
      () => presets ?? (mock ? mockColorOptions() : []),
      [mock, presets],
    );

    const updateValue = (nextValue: string) => {
      if (disabled) {
        return;
      }

      if (!isControlled) {
        setInnerValue(nextValue);
      }

      onChange?.(nextValue);
    };

    return (
      <div
        {...props}
        ref={ref}
        className={cn('space-y-3 rounded-2xl', className)}
      >
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="size-11 shrink-0 rounded-2xl border border-border shadow-inner dark:border-border-dark"
            style={{ background: currentValue || 'transparent' }}
          />
          <input
            aria-label="颜色值"
            disabled={disabled}
            value={currentValue}
            placeholder="输入 CSS color"
            className={cn(
              uiStyles.controlBase,
              uiStyles.focusRing,
              uiStyles.controlDisabled,
              'font-mono',
            )}
            onChange={(event) => updateValue(event.currentTarget.value)}
          />
          {allowClear ? (
            <button
              type="button"
              aria-label="清除颜色"
              disabled={disabled || !currentValue}
              className={cn('size-10', uiStyles.iconGhostButton, uiStyles.buttonDisabled)}
              onClick={() => updateValue('')}
            >
              <RotateCcw className="size-4" aria-hidden="true" />
            </button>
          ) : null}
        </div>
        {actualPresets.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {actualPresets.map((preset) => (
              <button
                key={`${preset.label}-${preset.value}`}
                type="button"
                aria-label={`选择 ${preset.label}`}
                disabled={disabled}
                className={cn(
                  'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-all duration-150 hover:border-primary/70 dark:hover:border-primary-dark',
                  uiStyles.surfaceInteractive,
                  uiStyles.textForeground,
                  uiStyles.buttonFocusVisibleRing,
                  disabled && 'cursor-not-allowed opacity-60',
                  currentValue === preset.value &&
                    'border-primary bg-primary-soft text-primary dark:border-primary-dark dark:bg-primary-dark-soft dark:text-primary-dark',
                )}
                onClick={() => updateValue(preset.value)}
              >
                <span
                  aria-hidden="true"
                  className={cn('size-4 rounded-full border', uiStyles.borderDefault)}
                  style={{ background: preset.value }}
                />
                {preset.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    );
  },
);

ColorPicker.displayName = 'ColorPicker';
