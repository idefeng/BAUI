import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '../../../lib/utils';
import {
  mockCalendarEvents,
  type MockCalendarEvent,
} from '../../../utils/mock';
import { uiStatusStyles, uiStyles } from '../shared/styles';

export interface CalendarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  /** 当前选中日期；传入后组件进入受控模式。 */
  value?: Date;
  /** 非受控模式下的初始选中日期。 */
  defaultValue?: Date;
  /** 当前面板月份；传入后可由外部控制翻页。 */
  current?: Date;
  /** 非受控模式下的初始面板月份。 */
  defaultCurrent?: Date;
  /** 日期选择回调。 */
  onChange?: (date: Date) => void;
  /** 月份面板变化回调。 */
  onPanelChange?: (date: Date) => void;
  /** 自定义日期单元格附加内容。 */
  dateCellRender?: (date: Date) => React.ReactNode;
  /** 开启后展示中央 mock 日程事件。 */
  mock?: boolean;
  /** 真实日程事件；传入后优先于 mock 数据。 */
  events?: MockCalendarEvent[];
}

const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

const pad = (value: number) => String(value).padStart(2, '0');

const cloneDate = (date: Date) => new Date(date.getTime());

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const formatDateKey = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const isSameDate = (left: Date | undefined, right: Date) =>
  Boolean(
    left &&
      left.getFullYear() === right.getFullYear() &&
      left.getMonth() === right.getMonth() &&
      left.getDate() === right.getDate(),
  );

const getMonthCells = (viewDate: Date) => {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startDate = new Date(year, month, 1 - firstDay.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(startDate);

    date.setDate(startDate.getDate() + index);

    return {
      date,
      inCurrentMonth: date.getMonth() === month,
    };
  });
};

const eventStatusClasses: Record<MockCalendarEvent['status'], string> = {
  primary: uiStatusStyles.tag.primary,
  success: uiStatusStyles.tag.success,
  warning: uiStatusStyles.tag.warning,
  error: uiStatusStyles.tag.error,
};

export const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      className,
      current,
      dateCellRender,
      defaultCurrent,
      defaultValue,
      events,
      mock = false,
      onChange,
      onPanelChange,
      value,
      ...props
    },
    ref,
  ) => {
    const initialDate = value ?? defaultValue ?? new Date();
    const isValueControlled = value !== undefined;
    const isCurrentControlled = current !== undefined;
    const [innerValue, setInnerValue] = React.useState<Date | undefined>(defaultValue);
    const [innerCurrent, setInnerCurrent] = React.useState(defaultCurrent ?? initialDate);
    const selectedDate = isValueControlled ? value : innerValue;
    const viewDate = isCurrentControlled ? current : innerCurrent;
    const cells = React.useMemo(() => getMonthCells(viewDate), [viewDate]);
    const actualEvents = React.useMemo(() => {
      if (events !== undefined) {
        return events;
      }

      return mock ? mockCalendarEvents() : [];
    }, [events, mock]);
    const eventsByDate = React.useMemo(
      () =>
        actualEvents.reduce<Record<string, MockCalendarEvent[]>>((accumulator, event) => {
          accumulator[event.date] = [...(accumulator[event.date] ?? []), event];
          return accumulator;
        }, {}),
      [actualEvents],
    );

    const updatePanel = (nextDate: Date) => {
      if (!isCurrentControlled) {
        setInnerCurrent(nextDate);
      }

      onPanelChange?.(nextDate);
    };

    const handleSelect = (date: Date) => {
      const nextDate = startOfDay(date);

      if (!isValueControlled) {
        setInnerValue(nextDate);
      }

      onChange?.(nextDate);
    };

    const shiftMonth = (offset: number) => {
      const nextDate = cloneDate(viewDate);

      nextDate.setMonth(viewDate.getMonth() + offset, 1);
      updatePanel(nextDate);
    };

    return (
      <div
        {...props}
        ref={ref}
        className={cn('w-full max-w-3xl p-4', uiStyles.surfaceShell, className)}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <button
            type="button"
            aria-label="上个月"
            className={cn('size-9', uiStyles.iconGhostButton)}
            onClick={() => shiftMonth(-1)}
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
          <div className="text-base font-semibold text-foreground dark:text-foreground-dark">
            {viewDate.getFullYear()}年 {viewDate.getMonth() + 1}月
          </div>
          <button
            type="button"
            aria-label="下个月"
            className={cn('size-9', uiStyles.iconGhostButton)}
            onClick={() => shiftMonth(1)}
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className={cn('py-2 text-center text-xs font-medium', uiStyles.textMuted)}
            >
              {day}
            </div>
          ))}
          {cells.map(({ date, inCurrentMonth }) => {
            const dateKey = formatDateKey(date);
            const dayEvents = eventsByDate[dateKey] ?? [];
            const selected = isSameDate(selectedDate, date);

            return (
              <button
                key={dateKey}
                type="button"
                aria-label={`选择 ${dateKey}`}
                aria-pressed={selected}
                className={cn(
                  'min-h-24 rounded-2xl border p-2 text-left transition-all duration-150',
                  uiStyles.focusRing,
                  inCurrentMonth
                    ? 'border-border bg-surface text-foreground hover:border-primary/70 hover:bg-primary-soft/60 dark:border-border-dark dark:bg-surface-dark dark:text-foreground-dark dark:hover:border-primary-dark dark:hover:bg-primary-dark-soft/50'
                    : 'border-transparent bg-muted/40 text-muted-foreground dark:bg-muted-dark/40 dark:text-muted-dark-foreground',
                  selected &&
                    'border-primary bg-primary-soft text-primary shadow-sm dark:border-primary-dark dark:bg-primary-dark-soft dark:text-primary-dark',
                )}
                onClick={() => handleSelect(date)}
              >
                <span className="text-sm font-semibold">{date.getDate()}</span>
                <span className="mt-2 flex flex-col gap-1">
                  {dateCellRender?.(date)}
                  {dayEvents.map((event) => (
                    <span
                      key={`${event.date}-${event.title}`}
                      className={cn(
                        'truncate rounded-full border px-2 py-0.5 text-xs',
                        eventStatusClasses[event.status],
                      )}
                    >
                      {event.title}
                    </span>
                  ))}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  },
);

Calendar.displayName = 'Calendar';
