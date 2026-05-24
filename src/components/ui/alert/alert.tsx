import * as React from 'react';
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X, type LucideIcon } from 'lucide-react';

import { cn } from '../../../lib/utils';
import { uiStyles } from '../shared/styles';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 提示状态，error 会自动使用 alert 语义便于读屏器即时播报。 */
  variant?: AlertVariant;
  /** 提示标题，适合放置业务状态摘要。 */
  title?: React.ReactNode;
  /** 提示描述，适合放置处理建议或风险说明。 */
  description?: React.ReactNode;
  /** 自定义图标；不传时按 variant 使用 lucide 图标。 */
  icon?: React.ReactNode;
  /** 是否展示关闭按钮。 */
  closable?: boolean;
  /** 关闭按钮点击回调。 */
  onClose?: () => void;
}

const variantClasses: Record<AlertVariant, string> = {
  info: 'border-primary bg-primary-soft text-primary dark:border-primary-dark dark:bg-primary-dark-soft dark:text-primary-dark',
  success: 'border-success bg-success-soft text-success dark:border-success-dark dark:bg-success-dark-soft dark:text-success-dark',
  warning: 'border-warning bg-warning-soft text-warning dark:border-warning-dark dark:bg-warning-dark-soft dark:text-warning-dark',
  error: 'border-danger bg-danger-soft text-danger dark:border-danger-dark dark:bg-danger-dark-soft dark:text-danger-dark',
};

const iconMap: Record<AlertVariant, LucideIcon> = {
  info: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
  error: AlertCircle,
};

/** Alert 用于在页面内展示可关闭的状态提示和处理建议。 */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      children,
      className,
      closable = false,
      description,
      icon,
      onClose,
      title,
      variant = 'info',
      ...props
    },
    ref,
  ) => {
    const [visible, setVisible] = React.useState(true);
    const Icon = iconMap[variant];

    const handleClose = () => {
      setVisible(false);
      onClose?.();
    };

    if (!visible) {
      return null;
    }

    return (
      <div
        ref={ref}
        role={variant === 'error' ? 'alert' : 'status'}
        className={cn(
          'flex items-start gap-3 rounded-2xl border p-4 text-sm shadow-sm',
          variantClasses[variant],
          className,
        )}
        {...props}
      >
        <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center" aria-hidden="true">
          {icon ?? <Icon className="size-5" aria-hidden={true} />}
        </span>
        <div className="min-w-0 flex-1 space-y-1">
          {title ? <div className={cn('font-semibold', uiStyles.textForeground)}>{title}</div> : null}
          {description ? (
            <div className={cn('leading-6', uiStyles.textMuted)}>{description}</div>
          ) : children ? (
            <div className={cn('leading-6', uiStyles.textMuted)}>{children}</div>
          ) : null}
          {description && children ? <div className="pt-2">{children}</div> : null}
        </div>
        {closable ? (
          <button
            type="button"
            aria-label="关闭提示"
            className={cn('size-8 shrink-0', uiStyles.closeButton)}
            onClick={handleClose}
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>
    );
  },
);

Alert.displayName = 'Alert';
