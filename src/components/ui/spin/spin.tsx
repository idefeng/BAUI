import * as React from 'react';
import { LoaderCircle } from 'lucide-react';

import { cn } from '../../../lib/utils';
import { uiStyles } from '../shared/styles';

export type SpinSize = 'sm' | 'md' | 'lg';

export interface SpinProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 是否展示加载态；包裹内容时可控制遮罩显隐。 */
  spinning?: boolean;
  /** 加载提示文案，同时作为 status 的可访问名称。 */
  tip?: React.ReactNode;
  /** 加载图标尺寸。 */
  size?: SpinSize;
  /** 自定义加载图标。 */
  indicator?: React.ReactNode;
}

const sizeClasses: Record<SpinSize, string> = {
  sm: 'size-4',
  md: 'size-6',
  lg: 'size-8',
};

const mergeChildClassName = (children: React.ReactNode, className: string) => {
  if (React.isValidElement<{ className?: string }>(children)) {
    return React.cloneElement(children, {
      className: cn(children.props.className, className),
    });
  }

  return <div className={className}>{children}</div>;
};

const SpinIndicator = ({ indicator, size, tip }: Pick<SpinProps, 'indicator' | 'size' | 'tip'>) => (
  <div
    role="status"
    aria-label={typeof tip === 'string' ? tip : '加载中'}
    className="inline-flex flex-col items-center justify-center gap-2 text-primary dark:text-primary-dark"
  >
    <span className={cn('inline-flex items-center justify-center', sizeClasses[size ?? 'md'])}>
      {indicator ?? <LoaderCircle className="size-full animate-spin" aria-hidden="true" />}
    </span>
    {tip ? <span className={cn('text-sm', uiStyles.textMuted)}>{tip}</span> : null}
  </div>
);

/** Spin 用于局部加载、页面加载和内容遮罩。 */
export const Spin = React.forwardRef<HTMLDivElement, SpinProps>(
  (
    {
      children,
      className,
      indicator,
      size = 'md',
      spinning = true,
      tip,
      ...props
    },
    ref,
  ) => {
    if (!children) {
      return (
        <div ref={ref} className={cn('inline-flex items-center justify-center', className)} {...props}>
          <SpinIndicator indicator={indicator} size={size} tip={tip} />
        </div>
      );
    }

    return (
      <div ref={ref} className={cn('relative', className)} {...props}>
        {mergeChildClassName(children, cn(spinning && 'pointer-events-none opacity-50'))}
        {spinning ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-background/70 backdrop-blur-sm dark:bg-background-dark/70">
            <SpinIndicator indicator={indicator} size={size} tip={tip} />
          </div>
        ) : null}
      </div>
    );
  },
);

Spin.displayName = 'Spin';
