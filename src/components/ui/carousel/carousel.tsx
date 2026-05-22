import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '../../../lib/utils';
import { uiStatusStyles, uiStyles } from '../shared/styles';

export interface CarouselSlide {
  /** 轮播项唯一标识，用于稳定 key。 */
  id: string;
  /** Banner 主标题。 */
  title: React.ReactNode;
  /** Banner 描述文案。 */
  description?: React.ReactNode;
  /** Banner 图片地址，适合培训海报和课程封面。 */
  image?: string;
  /** 图片替代文本；不传时使用 title 文本。 */
  imageAlt?: string;
  /** 顶部小标签或分类。 */
  eyebrow?: React.ReactNode;
  /** 自定义底部操作区。 */
  action?: React.ReactNode;
}

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 轮播数据源。 */
  slides: CarouselSlide[];
  /** 是否自动轮播。 */
  autoplay?: boolean;
  /** 自动轮播间隔，单位毫秒。 */
  interval?: number;
  /** 受控激活索引。 */
  activeIndex?: number;
  /** 非受控默认激活索引。 */
  defaultActiveIndex?: number;
  /** 激活索引变化回调。 */
  onActiveIndexChange?: (index: number) => void;
}

const getSafeIndex = (index: number, length: number) => {
  if (length <= 0) {
    return 0;
  }

  return ((index % length) + length) % length;
};

const getImageAlt = (slide: CarouselSlide) =>
  slide.imageAlt ?? (typeof slide.title === 'string' ? slide.title : '轮播图');

/** Carousel 支持课程 Banner 和培训海报的平滑切换、自动轮播与胶囊指示点。 */
export function Carousel({
  activeIndex,
  autoplay = false,
  className,
  defaultActiveIndex = 0,
  interval = 4000,
  onActiveIndexChange,
  slides,
  ...props
}: CarouselProps) {
  const [innerIndex, setInnerIndex] = React.useState(defaultActiveIndex);
  const isControlled = activeIndex !== undefined;
  const currentIndex = getSafeIndex(isControlled ? activeIndex : innerIndex, slides.length);

  const setIndex = React.useCallback(
    (nextIndex: number) => {
      const safeIndex = getSafeIndex(nextIndex, slides.length);

      if (!isControlled) {
        setInnerIndex(safeIndex);
      }

      onActiveIndexChange?.(safeIndex);
    },
    [isControlled, onActiveIndexChange, slides.length],
  );

  React.useEffect(() => {
    if (!autoplay || slides.length <= 1) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setIndex(currentIndex + 1);
    }, interval);

    return () => window.clearInterval(timer);
  }, [autoplay, currentIndex, interval, setIndex, slides.length]);

  if (slides.length === 0) {
    return (
      <div
        className={cn(
          'flex min-h-52 items-center justify-center rounded-2xl border border-dashed border-border bg-muted text-sm text-muted-foreground dark:border-border-dark dark:bg-muted-dark dark:text-muted-dark-foreground',
          className,
        )}
        {...props}
      >
        暂无轮播内容
      </div>
    );
  }

  return (
    <div
      className={cn(
        'group relative overflow-hidden',
        uiStyles.surfaceShell,
        className,
      )}
      aria-roledescription="carousel"
      {...props}
    >
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <article
            key={slide.id}
            className={cn(
              'relative min-w-full overflow-hidden bg-secondary dark:bg-secondary-dark',
              index === currentIndex ? 'opacity-100' : 'opacity-80',
            )}
            aria-hidden={index !== currentIndex}
          >
            {slide.image ? (
              <img src={slide.image} alt={getImageAlt(slide)} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/72 to-background/10 dark:from-background-dark/95 dark:via-background-dark/74 dark:to-background-dark/10" />
            <div className="relative flex min-h-64 flex-col justify-end gap-3 p-6 sm:min-h-80 sm:p-8">
              {slide.eyebrow ? (
                <div className={cn('w-fit rounded-lg px-3 py-1 text-xs font-semibold', uiStatusStyles.soft.primary)}>
                  {slide.eyebrow}
                </div>
              ) : null}
              <div className="max-w-xl space-y-2">
                <h3 className={cn('text-2xl font-semibold', uiStyles.textForeground)}>{slide.title}</h3>
                {slide.description ? (
                  <p className={cn('text-sm leading-6', uiStyles.textMuted)}>
                    {slide.description}
                  </p>
                ) : null}
              </div>
              {slide.action ? <div className="pt-2">{slide.action}</div> : null}
            </div>
          </article>
        ))}
      </div>

      {slides.length > 1 ? (
        <>
          <button
            type="button"
            aria-label="上一张"
            onClick={() => setIndex(currentIndex - 1)}
            className={cn(
              uiStyles.carouselArrowButton,
              'left-4',
              uiStyles.buttonFocusVisibleRing,
            )}
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="下一张"
            onClick={() => setIndex(currentIndex + 1)}
            className={cn(
              uiStyles.carouselArrowButton,
              'right-4',
              uiStyles.buttonFocusVisibleRing,
            )}
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-surface/85 px-3 py-2 shadow-sm backdrop-blur dark:bg-surface-dark/85">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={index === currentIndex}
                aria-label={`切换到第 ${index + 1} 张`}
                onClick={() => setIndex(index)}
                className={cn(
                  'h-2.5 rounded-full transition-all duration-300',
                  index === currentIndex
                    ? 'w-8 bg-primary dark:bg-primary-dark'
                    : 'w-2.5 bg-border hover:bg-primary/60 dark:bg-border-dark dark:hover:bg-primary-dark/60',
                )}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
