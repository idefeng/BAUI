import * as React from 'react';
import { Inbox } from 'lucide-react';

import { cn } from '../../../lib/utils';
import { uiStyles } from '../shared/styles';

export interface EmptyProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 空态标题。 */
  title?: React.ReactNode;
  /** 空态描述。 */
  description?: React.ReactNode;
  /** 自定义图形区域。 */
  image?: React.ReactNode;
  /** 操作区，通常传入 Button。 */
  action?: React.ReactNode;
  /** 开启后展示贴合培训项目的业务空态文案。 */
  mock?: boolean;
}

/** Empty 用于列表、卡片和表格没有内容时的统一占位。 */
export const Empty = React.forwardRef<HTMLDivElement, EmptyProps>(
  (
    {
      action,
      className,
      description,
      image,
      mock = false,
      title,
      ...props
    },
    ref,
  ) => {
    const currentTitle = title ?? (mock ? '暂无培训项目' : '暂无数据');
    const currentDescription = description ?? (mock ? '当前筛选条件下没有匹配项目，请调整条件后重试。' : '当前没有可展示的内容');

    return (
      <div
        ref={ref}
        className={cn('flex flex-col items-center justify-center px-6 py-10 text-center', className)}
        {...props}
      >
        <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-secondary text-primary dark:bg-secondary-dark dark:text-primary-dark">
          {image ?? <Inbox className="size-8" aria-hidden="true" />}
        </div>
        <div className={cn('text-base font-semibold', uiStyles.textForeground)}>{currentTitle}</div>
        <div className={cn('mt-2 max-w-sm text-sm leading-6', uiStyles.textMuted)}>{currentDescription}</div>
        {action ? <div className="mt-5 flex items-center justify-center gap-3">{action}</div> : null}
      </div>
    );
  },
);

Empty.displayName = 'Empty';
