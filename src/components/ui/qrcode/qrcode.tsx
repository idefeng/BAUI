import * as React from 'react';
import { RefreshCw } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

import { cn } from '../../../lib/utils';
import { Skeleton } from '../skeleton';
import { uiStyles } from '../shared/styles';

export type QRCodeStatus = 'active' | 'expired' | 'loading';

export interface QRCodeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** 二维码编码内容。 */
  value: string;
  /** 二维码主体尺寸，单位 px。 */
  size?: number;
  /** 二维码中心品牌图标。 */
  icon?: React.ReactNode;
  /** 二维码状态；expired 会展示遮罩，loading 会展示骨架屏。 */
  status?: QRCodeStatus;
  /** 点击过期遮罩时触发刷新。 */
  onRefresh?: () => void;
  /** 二维码无障碍标题。 */
  title?: string;
}

/** QRCode 是 BOAO UI 对 qrcode.react 的品牌化包装，适合签到和证书校验。 */
export const QRCode = React.forwardRef<HTMLDivElement, QRCodeProps>(
  (
    {
      className,
      icon,
      onRefresh,
      size = 176,
      status = 'active',
      title = 'BOAO 二维码',
      value,
      ...props
    },
    ref,
  ) => {
    const innerSize = Math.max(96, size);

    return (
      <div
        ref={ref}
        data-testid="boao-qrcode"
        className={cn(
          uiStyles.surfaceShell,
          'relative inline-flex p-4 dark:bg-surface',
          className,
        )}
        {...props}
      >
        <div className="relative" style={{ width: innerSize, height: innerSize }}>
          {status === 'loading' ? (
            <Skeleton data-testid="boao-qrcode-loading" className="h-full w-full rounded-xl" />
          ) : (
            <QRCodeSVG
              value={value}
              size={innerSize}
              title={title}
              level="H"
              marginSize={1}
              className="h-full w-full"
            />
          )}

          {icon && status !== 'loading' ? (
            <span
              data-slot="qrcode-icon"
              className="absolute left-1/2 top-1/2 inline-flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border border-border bg-surface text-xs font-bold text-primary shadow-sm dark:border-border-dark dark:text-primary"
            >
              {icon}
            </span>
          ) : null}

          {status === 'expired' ? (
            <button
              type="button"
              onClick={onRefresh}
              className={cn(
                'absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-xl bg-surface/90 px-4 text-center text-sm font-semibold text-foreground backdrop-blur-sm dark:text-foreground',
                uiStyles.buttonFocusVisibleRing,
              )}
            >
              <RefreshCw className="size-5 text-primary" aria-hidden="true" />
              二维码已失效，点击刷新
            </button>
          ) : null}
        </div>
      </div>
    );
  },
);

QRCode.displayName = 'QRCode';
