import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { LoaderCircle } from 'lucide-react';

import { cn } from '../../../lib/utils';
import { uiStyles } from '../shared/styles';

export type ButtonVariant = 'solid' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 按钮视觉层级：solid 用于主操作，outline 用于次级操作，ghost 用于轻量文本操作。 */
  variant?: ButtonVariant;
  /** 按钮尺寸，影响高度、字号和水平留白。 */
  size?: ButtonSize;
  /** 是否展示加载中状态；加载时会自动禁用点击并展示旋转图标。 */
  loading?: boolean;
  /** 是否占满父容器宽度。 */
  fullWidth?: boolean;
  /** 左侧装饰图标，建议传入 lucide-react 图标。 */
  leftIcon?: React.ReactNode;
  /** 右侧装饰图标，建议传入 lucide-react 图标。 */
  rightIcon?: React.ReactNode;
  /** 使用 Radix Slot 将样式透传给子元素，适合 Link 等组合场景。 */
  asChild?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  solid:
    'bg-primary text-primary-foreground shadow-button hover:bg-primary-hover active:bg-primary-active dark:bg-primary-dark dark:text-primary-dark-foreground dark:hover:bg-primary-dark-hover dark:active:bg-primary-dark-active',
  outline:
    'border border-primary bg-surface text-primary hover:bg-primary-soft active:bg-primary-soft dark:border-primary-dark dark:bg-surface-dark dark:text-primary-dark dark:hover:bg-primary-dark-soft dark:active:bg-primary-dark-soft',
  ghost:
    'bg-transparent text-primary shadow-none hover:bg-primary-soft active:bg-primary-soft dark:text-primary-dark dark:hover:bg-primary-dark-soft dark:active:bg-primary-dark-soft',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 rounded-2xl px-6 text-base',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      asChild = false,
      children,
      className,
      disabled = false,
      fullWidth = false,
      leftIcon,
      loading = false,
      onClick,
      rightIcon,
      size = 'md',
      type = 'button',
      variant = 'solid',
      tabIndex,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;
    const Component = asChild ? Slot : 'button';

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      // asChild 场景没有原生 disabled，主动拦截点击避免链接或自定义元素继续触发。
      if (isDisabled) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      onClick?.(event);
    };

    return (
      <Component
        {...props}
        ref={ref}
        type={asChild ? undefined : type}
        disabled={asChild ? undefined : isDisabled}
        aria-busy={loading || undefined}
        aria-disabled={asChild && isDisabled ? true : undefined}
        data-disabled={isDisabled ? 'true' : undefined}
        data-loading={loading ? 'true' : undefined}
        tabIndex={asChild && isDisabled ? -1 : tabIndex}
        onClick={handleClick}
        className={cn(
          'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium transition-all duration-200',
          uiStyles.buttonFocusVisibleRing,
          uiStyles.buttonDisabled,
          uiStyles.dataDisabledButton,
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          className,
        )}
      >
        {loading ? (
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
        ) : leftIcon ? (
          <span className={uiStyles.iconSlot} aria-hidden="true">
            {leftIcon}
          </span>
        ) : null}
        <span>{children}</span>
        {!loading && rightIcon ? (
          <span className={uiStyles.iconSlot} aria-hidden="true">
            {rightIcon}
          </span>
        ) : null}
      </Component>
    );
  },
);

Button.displayName = 'Button';
