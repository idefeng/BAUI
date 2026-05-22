import * as React from 'react';
import { X } from 'lucide-react';

import { cn } from '../../../lib/utils';
import { uiStyles } from '../shared/styles';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  /** Mock 占位符类型，用于快速搭建公司业务表单原型。 */
  mock?: 'name' | 'phone' | 'email';
  /** 是否展示一键清除按钮；禁用和只读状态下不会展示。 */
  clearable?: boolean;
  /** 点击清除按钮后的回调，受控场景建议在这里把外部 value 置空。 */
  onClear?: () => void;
  /** 输入框左侧图标，建议传入 lucide-react 图标。 */
  prefixIcon?: React.ReactNode;
  /** 输入框右侧图标，建议传入 lucide-react 图标。 */
  suffixIcon?: React.ReactNode;
  /** 外层容器类名，用于调整布局宽度或和表单容器衔接。 */
  rootClassName?: string;
}

const mockPlaceholders: Record<NonNullable<InputProps['mock']>, string> = {
  name: '请输入从业人员姓名，如 林予安',
  phone: '请输入脱敏手机号，如 138****2026',
  email: '请输入企业邮箱，如 student@boaoit.com',
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      clearable = false,
      defaultValue,
      disabled = false,
      mock,
      onChange,
      onClear,
      placeholder,
      prefixIcon,
      readOnly = false,
      rootClassName,
      suffixIcon,
      value,
      ...props
    },
    ref,
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const isControlled = value !== undefined;
    const [innerValue, setInnerValue] = React.useState<React.InputHTMLAttributes<HTMLInputElement>['value']>(
      defaultValue ?? '',
    );
    const currentValue = isControlled ? value : innerValue;
    const hasValue = currentValue !== undefined && currentValue !== null && String(currentValue).length > 0;
    const canClear = clearable && hasValue && !disabled && !readOnly;

    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInnerValue(event.currentTarget.value);
      }

      onChange?.(event);
    };

    const handleClear = () => {
      const input = inputRef.current;
      if (!input || disabled || readOnly) {
        return;
      }

      // 直接更新原生 input 值，让非受控场景也能立即完成清除。
      const valueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
      valueSetter?.call(input, '');

      if (!isControlled) {
        setInnerValue('');
      }

      input.dispatchEvent(new Event('input', { bubbles: true }));
      onClear?.();
      input.focus();
    };

    return (
      <div
        data-testid="boao-input-root"
        data-disabled={disabled ? 'true' : undefined}
        className={cn(
          'flex items-center gap-2',
          uiStyles.controlBase,
          uiStyles.fieldFocusWithin,
          uiStyles.dataDisabledControl,
          rootClassName,
        )}
      >
        {prefixIcon ? (
          <span className={uiStyles.mutedIconSlot} aria-hidden="true">
            {prefixIcon}
          </span>
        ) : null}
        <input
          {...props}
          ref={inputRef}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={mock ? mockPlaceholders[mock] : placeholder}
          onChange={handleChange}
          className={cn(
            'h-full min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground dark:text-foreground-dark dark:placeholder:text-muted-dark-foreground',
            'disabled:cursor-not-allowed disabled:text-disabled-foreground dark:disabled:text-disabled-dark-foreground',
            className,
          )}
        />
        {suffixIcon ? (
          <span className={uiStyles.mutedIconSlot} aria-hidden="true">
            {suffixIcon}
          </span>
        ) : null}
        {canClear ? (
          <button
            type="button"
            aria-label="清除输入内容"
            onClick={handleClear}
            className={cn('size-6 shrink-0', uiStyles.closeButton)}
          >
            <X className="size-3.5" aria-hidden="true" />
          </button>
        ) : null}
      </div>
    );
  },
);

Input.displayName = 'Input';
