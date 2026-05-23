import * as React from 'react';

import { cn } from '../../../lib/utils';

export interface BoaoIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'color'> {
  /** 图标尺寸，数字会作为 px 写入 width/height，也支持 1em、2rem 等 CSS 尺寸。 */
  size?: number | string;
  /** 线性图标统一描边宽度。 */
  strokeWidth?: number;
  /** 辅助强调色区域类名，默认使用成功青绿色语义色。 */
  accentClassName?: string;
  /** 可访问标题；不传时图标按纯装饰处理并隐藏给读屏器。 */
  title?: string;
}

export type BoaoIconComponent = React.ForwardRefExoticComponent<
  BoaoIconProps & React.RefAttributes<SVGSVGElement>
>;

export interface BoaoIconMeta {
  name: string;
  label: string;
  Icon: BoaoIconComponent;
}

type LineProps = {
  fill: 'none';
  stroke: 'currentColor';
  strokeLinecap: 'round';
  strokeLinejoin: 'round';
  strokeWidth: number;
};

type RenderIconPaths = (options: {
  accentClassName: string;
  accentLineProps: LineProps;
  lineProps: LineProps;
}) => React.ReactNode;

const defaultIconSize = 64;
const defaultStrokeWidth = 3.5;

const getSizeValue = (size: number | string) => (typeof size === 'number' ? String(size) : size);

const getLineProps = (strokeWidth: number): LineProps => ({
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  strokeWidth,
});

const createBoaoIcon = (displayName: string, renderPaths: RenderIconPaths): BoaoIconComponent => {
  const Icon = React.forwardRef<SVGSVGElement, BoaoIconProps>(
    (
      {
        accentClassName = 'text-success dark:text-success-dark',
        className,
        size = defaultIconSize,
        strokeWidth = defaultStrokeWidth,
        title,
        ...props
      },
      ref,
    ) => {
      const titleId = React.useId();
      const lineProps = getLineProps(strokeWidth);
      const accentLineProps = getLineProps(strokeWidth);

      return (
        <svg
          {...props}
          ref={ref}
          width={getSizeValue(size)}
          height={getSizeValue(size)}
          viewBox="0 0 64 64"
          role={title ? 'img' : undefined}
          aria-hidden={title ? undefined : true}
          aria-labelledby={title ? titleId : undefined}
          className={cn('shrink-0 text-primary dark:text-primary-dark', className)}
        >
          {title ? <title id={titleId}>{title}</title> : null}
          {renderPaths({ accentClassName, accentLineProps, lineProps })}
        </svg>
      );
    },
  );

  Icon.displayName = displayName;

  return Icon;
};

/** 课程图标：用于课程、课件、学习内容入口。 */
export const BoaoCourseIcon = createBoaoIcon('BoaoCourseIcon', ({ accentClassName, accentLineProps, lineProps }) => (
  <>
    <g data-slot="main">
      <path {...lineProps} d="M10 18c7.4-3.4 14.7-3.1 22 1.1v31.5c-7.3-4.2-14.6-4.6-22-1.2V18Z" />
      <path {...lineProps} d="M54 18c-7.4-3.4-14.7-3.1-22 1.1v31.5c7.3-4.2 14.6-4.6 22-1.2V18Z" />
      <path {...lineProps} d="M16 25h9M16 33h8M39 25h8" opacity="0.38" />
    </g>
    <g data-slot="accent" className={accentClassName}>
      <path {...accentLineProps} d="M24 49v8l8-5.2" />
      <circle {...accentLineProps} cx="43" cy="35" r="7.5" />
      <path {...accentLineProps} d="m41.2 31.7 5.2 3.3-5.2 3.3v-6.6Z" />
    </g>
  </>
));

/** 学员图标：用于学员、用户、人员档案入口。 */
export const BoaoLearnerIcon = createBoaoIcon('BoaoLearnerIcon', ({ accentClassName, accentLineProps, lineProps }) => (
  <>
    <g data-slot="main">
      <circle {...lineProps} cx="32" cy="24" r="9.5" />
      <path {...lineProps} d="M16.5 51c2.2-9 8-13.5 15.5-13.5S45.3 42 47.5 51c-9 4.5-22 4.5-31 0Z" />
    </g>
    <g data-slot="accent" className={accentClassName}>
      <path {...accentLineProps} d="M12.5 37.5A22 22 0 0 1 14 22.2M50 20.4a22 22 0 0 1 1.5 17.1" />
      <path {...accentLineProps} d="M18.5 13.5A23.8 23.8 0 0 1 42 10.5" />
      <circle {...accentLineProps} cx="51" cy="14" r="3.5" />
    </g>
  </>
));

/** 证书图标：用于证书、资质、结业结果入口。 */
export const BoaoCertificateIcon = createBoaoIcon('BoaoCertificateIcon', ({ accentClassName, accentLineProps, lineProps }) => (
  <>
    <g data-slot="main">
      <path {...lineProps} d="M12 17a5 5 0 0 1 5-5h30a5 5 0 0 1 5 5v25a5 5 0 0 1-5 5H17a5 5 0 0 1-5-5V17Z" />
      <path {...lineProps} d="M18 22h23M18 31h16" opacity="0.42" />
    </g>
    <g data-slot="accent" className={accentClassName}>
      <circle {...accentLineProps} cx="43" cy="40" r="8" />
      <path {...accentLineProps} d="m39.5 48.5-3 8 6.5-3 6.5 3-3-8" />
      <path {...accentLineProps} d="m43 36.2 1.2 2.3 2.6.4-1.9 1.9.5 2.6-2.4-1.2-2.4 1.2.5-2.6-1.9-1.9 2.6-.4L43 36.2Z" />
    </g>
  </>
));

/** 数据看板图标：用于驾驶舱、报表、分析入口。 */
export const BoaoDashboardIcon = createBoaoIcon('BoaoDashboardIcon', ({ accentClassName, accentLineProps, lineProps }) => (
  <>
    <g data-slot="main">
      <path {...lineProps} d="M10 16a5 5 0 0 1 5-5h34a5 5 0 0 1 5 5v32a5 5 0 0 1-5 5H15a5 5 0 0 1-5-5V16Z" />
      <path {...lineProps} d="M10 22h44" opacity="0.36" />
      <path {...lineProps} d="M17 44h9M17 37h8" opacity="0.36" />
      <circle cx="17.5" cy="16.5" r="1.7" fill="currentColor" opacity="0.45" />
      <circle cx="24" cy="16.5" r="1.7" fill="currentColor" opacity="0.45" />
    </g>
    <g data-slot="accent" className={accentClassName}>
      <path {...accentLineProps} d="M24 30a9 9 0 1 0 9 9h-9v-9Z" />
      <path {...accentLineProps} d="M29 30v7h7a9 9 0 0 0-7-7Z" />
      <path {...accentLineProps} d="M41 44V34M48 44V28" />
    </g>
  </>
));

/** 上传图标：用于素材、课件、附件上传入口。 */
export const BoaoUploadIcon = createBoaoIcon('BoaoUploadIcon', ({ accentClassName, accentLineProps, lineProps }) => (
  <>
    <g data-slot="main">
      <path {...lineProps} d="M20 50h-3.5A10.5 10.5 0 0 1 16 29.1C18 19.8 25.2 14 33.5 14c9.2 0 16.8 7 17.6 16.2A9.8 9.8 0 0 1 47 50h-3" />
      <path {...lineProps} d="M21 54h22" opacity="0.32" />
    </g>
    <g data-slot="accent" className={accentClassName}>
      <path {...accentLineProps} d="M32 50V30" />
      <path {...accentLineProps} d="m23.5 38.5 8.5-8.5 8.5 8.5" />
    </g>
  </>
));

/** 审核图标：用于审批、资料审核、任务校验入口。 */
export const BoaoReviewIcon = createBoaoIcon('BoaoReviewIcon', ({ accentClassName, accentLineProps, lineProps }) => (
  <>
    <g data-slot="main">
      <path {...lineProps} d="M17 10h24l8 8v32a4 4 0 0 1-4 4H17a4 4 0 0 1-4-4V14a4 4 0 0 1 4-4Z" />
      <path {...lineProps} d="M41 10v8h8" />
      <path {...lineProps} d="M21 26h14M21 34h12M21 42h8" opacity="0.42" />
    </g>
    <g data-slot="accent" className={accentClassName}>
      <circle {...accentLineProps} cx="43" cy="44" r="9" />
      <path {...accentLineProps} d="m38.5 44 3.2 3.2 6.2-7" />
    </g>
  </>
));

/** 权限图标：用于安全、权限、账号授权入口。 */
export const BoaoPermissionIcon = createBoaoIcon('BoaoPermissionIcon', ({ accentClassName, accentLineProps, lineProps }) => (
  <>
    <g data-slot="main">
      <path {...lineProps} d="M32 8c6.4 4.2 13 6.8 20 7.8v14.8C52 44 43.6 53 32 58 20.4 53 12 44 12 30.6V15.8C19 14.8 25.6 12.2 32 8Z" />
      <path {...lineProps} d="M20 22.5v8.2C20 39 24.6 45 32 49.3c7.4-4.3 12-10.3 12-18.6v-8.2" opacity="0.32" />
    </g>
    <g data-slot="accent" className={accentClassName}>
      <path {...accentLineProps} d="M32 31.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11Z" />
      <path {...accentLineProps} d="M28.5 31.5 27 42h10l-1.5-10.5" />
      <circle {...accentLineProps} cx="46" cy="43" r="7" />
      <path {...accentLineProps} d="M46 39.5v4l3 2" />
    </g>
  </>
));

/** 通知图标：用于消息、提醒、待办通知入口。 */
export const BoaoNotificationIcon = createBoaoIcon('BoaoNotificationIcon', ({ accentClassName, accentLineProps, lineProps }) => (
  <>
    <g data-slot="main">
      <path {...lineProps} d="M18 45h28c-3.2-4-4.3-8-4.3-15.5 0-6.6-4.2-11.5-9.7-11.5s-9.7 4.9-9.7 11.5C22.3 37 21.2 41 18 45Z" />
      <path {...lineProps} d="M27.5 49.5a5 5 0 0 0 9 0" />
      <path {...lineProps} d="M28 17.5a4 4 0 0 1 8 0" opacity="0.52" />
    </g>
    <g data-slot="accent" className={accentClassName}>
      <path {...accentLineProps} d="M11 29c1.2-4 3-7 5.5-9M53 29c-1.2-4-3-7-5.5-9" />
      <path {...accentLineProps} d="M12.5 40c2 2.4 4.4 4 7.1 5M51.5 40c-2 2.4-4.4 4-7.1 5" />
      <circle cx="45" cy="18" r="4.5" fill="currentColor" />
    </g>
  </>
));

export const boaoIconSet: BoaoIconMeta[] = [
  { name: 'BoaoCourseIcon', label: '课程', Icon: BoaoCourseIcon },
  { name: 'BoaoLearnerIcon', label: '学员', Icon: BoaoLearnerIcon },
  { name: 'BoaoCertificateIcon', label: '证书', Icon: BoaoCertificateIcon },
  { name: 'BoaoDashboardIcon', label: '数据看板', Icon: BoaoDashboardIcon },
  { name: 'BoaoUploadIcon', label: '上传', Icon: BoaoUploadIcon },
  { name: 'BoaoReviewIcon', label: '审核', Icon: BoaoReviewIcon },
  { name: 'BoaoPermissionIcon', label: '权限', Icon: BoaoPermissionIcon },
  { name: 'BoaoNotificationIcon', label: '通知', Icon: BoaoNotificationIcon },
];
