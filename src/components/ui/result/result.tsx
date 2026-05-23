import * as React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  LockKeyhole,
  SearchX,
  ServerCrash,
  XCircle,
  type LucideIcon,
} from 'lucide-react';

import { cn } from '../../../lib/utils';
import { uiStyles } from '../shared/styles';

export type ResultStatus = 'success' | 'info' | 'warning' | 'error' | '404' | '403' | '500';

export interface ResultProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 结果状态，支持常用成功、异常和 403/404/500 页面状态。 */
  status?: ResultStatus;
  /** 主标题。 */
  title?: React.ReactNode;
  /** 副标题或说明。 */
  subTitle?: React.ReactNode;
  /** 自定义图标。 */
  icon?: React.ReactNode;
  /** 操作区，通常传入 Button 或 Space。 */
  extra?: React.ReactNode;
}

const statusClassNames: Record<ResultStatus, string> = {
  success: 'text-success dark:text-success-dark',
  info: 'text-primary dark:text-primary-dark',
  warning: 'text-warning dark:text-warning-dark',
  error: 'text-danger dark:text-danger-dark',
  '404': 'text-primary dark:text-primary-dark',
  '403': 'text-warning dark:text-warning-dark',
  '500': 'text-danger dark:text-danger-dark',
};

const statusIconMap: Record<ResultStatus, LucideIcon> = {
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle,
  error: XCircle,
  '404': SearchX,
  '403': LockKeyhole,
  '500': ServerCrash,
};

const defaultTitles: Record<ResultStatus, string> = {
  success: '操作成功',
  info: '信息提示',
  warning: '需要注意',
  error: '操作失败',
  '404': '页面不存在',
  '403': '暂无访问权限',
  '500': '服务暂不可用',
};

/** Result 用于提交反馈页、异常页和流程终态展示。 */
export const Result = React.forwardRef<HTMLDivElement, ResultProps>(
  (
    {
      className,
      extra,
      icon,
      status = 'info',
      subTitle,
      title,
      ...props
    },
    ref,
  ) => {
    const Icon = statusIconMap[status];
    const currentTitle = title ?? defaultTitles[status];

    return (
      <div
        ref={ref}
        className={cn('flex flex-col items-center justify-center px-6 py-12 text-center', className)}
        {...props}
      >
        <div
          data-testid="boao-result-icon"
          className={cn(
            'mb-5 flex size-20 items-center justify-center rounded-3xl bg-secondary dark:bg-secondary-dark',
            statusClassNames[status],
          )}
        >
          {icon ?? <Icon className="size-10" aria-hidden={true} />}
        </div>
        <div className={cn('text-xl font-semibold', uiStyles.textForeground)}>{currentTitle}</div>
        {subTitle ? <div className={cn('mt-3 max-w-lg text-sm leading-6', uiStyles.textMuted)}>{subTitle}</div> : null}
        {extra ? <div className="mt-6 flex flex-wrap items-center justify-center gap-3">{extra}</div> : null}
      </div>
    );
  },
);

Result.displayName = 'Result';
