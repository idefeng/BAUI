import * as React from 'react';
import { Check, Circle, Clock3, X } from 'lucide-react';

import { cn } from '../../../lib/utils';
import { uiStyles } from '../shared/styles';

export type TimelineStatus = 'success' | 'process' | 'wait' | 'error';

export interface TimelineItem {
  /** 节点标题。 */
  title: React.ReactNode;
  /** 节点描述。 */
  description?: React.ReactNode;
  /** 时间或辅助信息。 */
  time?: React.ReactNode;
  /** 节点状态，决定节点语义色和图标。 */
  status?: TimelineStatus;
  /** 自定义节点图标。 */
  icon?: React.ReactNode;
}

export interface TimelineProps extends React.HTMLAttributes<HTMLOListElement> {
  /** 时间轴节点。 */
  items: TimelineItem[];
  /** 尾部待处理节点。 */
  pending?: React.ReactNode;
}

const statusClassNames: Record<TimelineStatus, string> = {
  success: 'bg-success text-success-foreground dark:bg-success-dark dark:text-success-dark-foreground',
  process: 'bg-primary text-primary-foreground dark:bg-primary-dark dark:text-primary-dark-foreground',
  wait: 'bg-secondary text-muted-foreground dark:bg-secondary-dark dark:text-muted-dark-foreground',
  error: 'bg-danger text-danger-foreground dark:bg-danger-dark dark:text-danger-dark-foreground',
};

const statusIconMap: Record<TimelineStatus, React.ReactNode> = {
  success: <Check className="size-3.5" aria-hidden="true" />,
  process: <Clock3 className="size-3.5" aria-hidden="true" />,
  wait: <Circle className="size-3" aria-hidden="true" />,
  error: <X className="size-3.5" aria-hidden="true" />,
};

/** Timeline 用于展示学习轨迹、审核记录和证书签发流程。 */
export const Timeline = React.forwardRef<HTMLOListElement, TimelineProps>(
  ({ className, items, pending, ...props }, ref) => (
    <ol ref={ref} className={cn('space-y-0', className)} {...props}>
      {items.map((item, index) => {
        const status = item.status ?? 'wait';

        return (
          <li key={`${index}-${String(item.title)}`} className="relative grid grid-cols-[2rem_1fr] gap-3 pb-6 last:pb-0">
            {index < items.length - 1 || pending ? (
              <span className="absolute left-4 top-8 h-[calc(100%-2rem)] w-px bg-border dark:bg-border-dark" aria-hidden="true" />
            ) : null}
            <span
              aria-label={`${item.title} 状态`}
              className={cn('relative z-10 flex size-8 items-center justify-center rounded-full shadow-sm', statusClassNames[status])}
            >
              {item.icon ?? statusIconMap[status]}
            </span>
            <span className="min-w-0 pt-1">
              <span className={cn('block text-sm font-semibold', uiStyles.textForeground)}>{item.title}</span>
              {item.description ? <span className={cn('mt-1 block text-sm leading-6', uiStyles.textMuted)}>{item.description}</span> : null}
              {item.time ? <span className={cn('mt-1 block text-xs', uiStyles.textMuted)}>{item.time}</span> : null}
            </span>
          </li>
        );
      })}
      {pending ? (
        <li className="relative grid grid-cols-[2rem_1fr] gap-3">
          <span className="flex size-8 items-center justify-center rounded-full border border-dashed border-border text-muted-foreground dark:border-border-dark dark:text-muted-dark-foreground">
            <Circle className="size-3" aria-hidden="true" />
          </span>
          <span className={cn('pt-1 text-sm', uiStyles.textMuted)}>{pending}</span>
        </li>
      ) : null}
    </ol>
  ),
);

Timeline.displayName = 'Timeline';
