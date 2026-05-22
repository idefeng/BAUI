import * as React from 'react';
import { ImageOff } from 'lucide-react';

import { cn } from '../../../lib/utils';
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalTitle,
} from '../modal';
import { Skeleton } from '../skeleton';
import { uiStyles } from '../shared/styles';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** 点击图片后是否用 Modal 预览大图。 */
  preview?: boolean;
  /** 外层图片容器样式。 */
  wrapperClassName?: string;
  /** 骨架屏额外样式。 */
  skeletonClassName?: string;
  /** 图片加载失败时的占位文案。 */
  fallbackText?: string;
}

/** Image 提供懒加载、Skeleton 占位、失败态和大图预览能力。 */
export const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      alt = '',
      className,
      fallbackText = '图片去外星了',
      loading = 'lazy',
      onError,
      onLoad,
      preview = false,
      skeletonClassName,
      src,
      wrapperClassName,
      ...props
    },
    ref,
  ) => {
    const [loaded, setLoaded] = React.useState(false);
    const [failed, setFailed] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const canPreview = preview && loaded && !failed && Boolean(src);

    const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
      setLoaded(true);
      setFailed(false);
      onLoad?.(event);
    };

    const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
      setLoaded(false);
      setFailed(true);
      onError?.(event);
    };

    const image = (
      <img
        ref={ref}
        src={src}
        alt={alt}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'h-full w-full object-cover transition-opacity duration-300',
          loaded && !failed ? 'opacity-100' : 'opacity-0',
          className,
        )}
        {...props}
      />
    );

    return (
      <>
        <div
          className={cn(
            'relative inline-block overflow-hidden rounded-2xl bg-muted align-middle dark:bg-muted-dark',
            wrapperClassName,
          )}
        >
          {canPreview ? (
            <button
              type="button"
              aria-label={`预览 ${alt || '图片'}`}
              onClick={() => setOpen(true)}
              className={cn('block h-full w-full cursor-zoom-in overflow-hidden rounded-2xl', uiStyles.buttonFocusVisibleRing)}
            >
              {image}
            </button>
          ) : (
            image
          )}

          {!loaded && !failed ? (
            <Skeleton
              data-testid="boao-image-skeleton"
              className={cn('absolute inset-0 h-full w-full rounded-2xl', skeletonClassName)}
            />
          ) : null}

          {failed ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl bg-muted px-4 text-center text-sm text-muted-foreground dark:bg-muted-dark dark:text-muted-dark-foreground">
              <ImageOff className="size-8 text-primary dark:text-primary-dark" aria-hidden="true" />
              <span>{fallbackText}</span>
            </div>
          ) : null}
        </div>

        {preview ? (
          <Modal open={open} onOpenChange={setOpen}>
            <ModalContent className="max-w-5xl p-3" showClose>
              <ModalTitle className="px-2 pt-1">{alt || '图片预览'}</ModalTitle>
              <ModalDescription className="sr-only">查看图片大图</ModalDescription>
              <img src={src} alt={alt} className="max-h-[78vh] w-full rounded-2xl object-contain" />
            </ModalContent>
          </Modal>
        ) : null}
      </>
    );
  },
);

Image.displayName = 'Image';
