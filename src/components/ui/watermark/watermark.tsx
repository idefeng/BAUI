import * as React from 'react';

import { cn } from '../../../lib/utils';
import { mockWatermarkContent } from '../../../utils/mock';
import { uiStyles } from '../shared/styles';

export interface WatermarkProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> {
  /** 水印内容；传入后优先于 mock。 */
  content?: string | string[];
  /** 开启后使用中央 mock 水印文案。 */
  mock?: boolean;
  /** 水印重复块数量，默认足够覆盖常见证书预览区域。 */
  repeat?: number;
  /** 水印旋转角度。 */
  rotate?: number;
  /** 水印透明度。 */
  opacity?: number;
}

const normalizeContent = (content: string | string[] | undefined) => {
  if (Array.isArray(content)) {
    return content.filter(Boolean);
  }

  return content ? [content] : [];
};

export const Watermark = React.forwardRef<HTMLDivElement, WatermarkProps>(
  (
    {
      children,
      className,
      content,
      mock = false,
      opacity = 0.16,
      repeat = 24,
      rotate = -18,
      ...props
    },
    ref,
  ) => {
    const actualContent = normalizeContent(content ?? (mock ? mockWatermarkContent() : undefined));
    const safeRepeat = Math.max(0, Math.floor(repeat));

    return (
      <div
        {...props}
        ref={ref}
        className={cn('relative overflow-hidden rounded-2xl', uiStyles.surfaceShell, className)}
      >
        <div className="relative z-10">{children}</div>
        {actualContent.length > 0 && safeRepeat > 0 ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 grid select-none grid-cols-3 gap-8 p-8 text-muted-foreground dark:text-muted-dark-foreground"
            style={{ opacity }}
          >
            {Array.from({ length: safeRepeat }, (_, index) => (
              <div
                key={index}
                className="flex min-h-16 items-center justify-center whitespace-nowrap text-sm font-semibold"
                style={{ transform: `rotate(${rotate}deg)` }}
              >
                <span className="flex flex-col items-center gap-1">
                  {actualContent.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    );
  },
);

Watermark.displayName = 'Watermark';
