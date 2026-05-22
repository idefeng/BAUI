import * as React from 'react';
import { X } from 'lucide-react';

import { cn } from '../../../lib/utils';
import { mockTags } from '../../../utils/mock';
import { uiStatusStyles, uiStyles, type UiStatusVariant } from '../shared/styles';

export type TagVariant = UiStatusVariant;

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 标签视觉类型；warning 适合待处理，error 适合异常任务。 */
  variant?: TagVariant;
  /** 是否展示右侧关闭按钮。 */
  closable?: boolean;
  /** 点击关闭按钮时触发；组件会先进入缩小淡出状态。 */
  onClose?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** 启用中心 mock 标签；仅在未传 children 时兜底接管。 */
  mock?: boolean;
  /** Mock 标签偏移，用于 Storybook 展示不同标签。 */
  mockSeed?: number;
}

/** Tag 用于课程分类、状态补充和 SmartTable 内联标签展示。 */
export const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  (
    {
      children,
      className,
      closable = false,
      mock = false,
      mockSeed = 0,
      onClose,
      variant,
      ...props
    },
    ref,
  ) => {
    const mockData = React.useMemo(() => (mock ? mockTags(1, mockSeed)[0] : undefined), [mock, mockSeed]);
    const [closing, setClosing] = React.useState(false);
    const displayChildren = children ?? mockData?.label;
    const displayVariant = variant ?? mockData?.variant ?? 'primary';
    const closeLabel = typeof displayChildren === 'string' ? displayChildren : '标签';

    const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
      // 保留淡出状态给 CSS 动画执行，同时把业务回调立即交给外部处理。
      setClosing(true);
      onClose?.(event);
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold leading-none transition-all duration-200',
          uiStatusStyles.tag[displayVariant],
          closing && 'scale-95 opacity-0',
          className,
        )}
        {...props}
      >
        {displayChildren}
        {closable ? (
          <button
            type="button"
            aria-label={`关闭 ${closeLabel}`}
            onClick={handleClose}
            className={cn('inline-flex size-4 items-center justify-center rounded-sm hover:bg-surface/70 dark:hover:bg-surface-dark/70', uiStyles.focusRing)}
          >
            <X className="size-3" aria-hidden="true" />
          </button>
        ) : null}
      </span>
    );
  },
);

Tag.displayName = 'Tag';
