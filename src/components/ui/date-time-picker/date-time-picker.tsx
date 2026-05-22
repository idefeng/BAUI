import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  X,
} from 'lucide-react';

import { cn } from '../../../lib/utils';
import { mockTrainingScheduleDateTime } from '../../../utils/mock';
import { uiStyles } from '../shared/styles';

export type DateTimePickerType = 'date' | 'time' | 'datetime';
export type DateTimePickerValue = Date | string;

export interface DateTimePickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** 选择模式：date 仅日期，time 仅时分秒，datetime 同时选择日期与时间。 */
  type: DateTimePickerType;
  /** 当前选中值；date/datetime 推荐传 Date，time 推荐传 HH:mm:ss 字符串。 */
  value?: DateTimePickerValue;
  /** 值变化回调；清除时返回 undefined。 */
  onChange?: (value: DateTimePickerValue | undefined) => void;
  /** 未选择时展示的占位文案。 */
  placeholder?: string;
  /** 禁用后不可打开浮层，也不可清除当前值。 */
  disabled?: boolean;
  /** 开启后在未传 value 时自动生成未来培训排课时间。 */
  mock?: boolean;
  /** 是否展示一键清除按钮，默认在有值时展示。 */
  clearable?: boolean;
}

interface TimeParts {
  hour: number;
  minute: number;
  second: number;
}

const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
const hourOptions = Array.from({ length: 24 }, (_, index) => index);
const minuteSecondOptions = Array.from({ length: 60 }, (_, index) => index);

const pad = (value: number) => String(value).padStart(2, '0');

const isValidDate = (value: DateTimePickerValue | undefined): value is Date =>
  value instanceof Date && !Number.isNaN(value.getTime());

const cloneDate = (date: Date) => new Date(date.getTime());

const formatDate = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const formatTime = ({ hour, minute, second }: TimeParts) => `${pad(hour)}:${pad(minute)}:${pad(second)}`;

const formatDateTime = (date: Date) => `${formatDate(date)} ${formatTime(getTimeParts(date))}`;

const parseTimeString = (value: DateTimePickerValue | undefined): TimeParts | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }

  const matched = value.match(/^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/);

  if (!matched) {
    return undefined;
  }

  const hour = Number(matched[1]);
  const minute = Number(matched[2]);
  const second = Number(matched[3] ?? 0);

  if (hour > 23 || minute > 59 || second > 59) {
    return undefined;
  }

  return { hour, minute, second };
};

const getTimeParts = (value: DateTimePickerValue | undefined): TimeParts => {
  if (isValidDate(value)) {
    return {
      hour: value.getHours(),
      minute: value.getMinutes(),
      second: value.getSeconds(),
    };
  }

  return parseTimeString(value) ?? { hour: 14, minute: 30, second: 0 };
};

const getDateValue = (value: DateTimePickerValue | undefined) => (isValidDate(value) ? value : undefined);

const createDateWithTime = (date: Date, timeParts: TimeParts) => {
  const nextDate = cloneDate(date);

  nextDate.setHours(timeParts.hour, timeParts.minute, timeParts.second, 0);

  return nextDate;
};

const getInitialMockValue = (type: DateTimePickerType): DateTimePickerValue => {
  const scheduleTime = mockTrainingScheduleDateTime();

  return type === 'time' ? formatTime(getTimeParts(scheduleTime)) : scheduleTime;
};

const getDisplayText = (type: DateTimePickerType, value: DateTimePickerValue | undefined) => {
  if (type === 'time') {
    return typeof value === 'string' ? formatTime(getTimeParts(value)) : isValidDate(value) ? formatTime(getTimeParts(value)) : '';
  }

  if (type === 'date') {
    return isValidDate(value) ? formatDate(value) : '';
  }

  return isValidDate(value) ? formatDateTime(value) : '';
};

const getCalendarCells = (viewDate: Date) => {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startDate = new Date(year, month, 1 - firstDay.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(startDate);

    date.setDate(startDate.getDate() + index);

    return {
      date,
      isCurrentMonth: date.getMonth() === month,
    };
  });
};

const isSameDate = (left: Date | undefined, right: Date) =>
  Boolean(
    left &&
      left.getFullYear() === right.getFullYear() &&
      left.getMonth() === right.getMonth() &&
      left.getDate() === right.getDate(),
  );

const getDefaultPlaceholder = (type: DateTimePickerType) => {
  if (type === 'time') {
    return '请选择时间';
  }

  if (type === 'datetime') {
    return '请选择日期时间';
  }

  return '请选择日期';
};

const TimeColumn = ({
  label,
  onSelect,
  selected,
  suffix,
  values,
}: {
  label: string;
  onSelect: (value: number) => void;
  selected: number;
  suffix: string;
  values: number[];
}) => {
  const shortLabel = suffix === '小时' ? '时' : suffix.slice(0, 1);

  return (
    <div className="min-w-20">
      <div className={cn('mb-2 text-center text-xs font-medium', uiStyles.textMuted)}>
        {shortLabel}
      </div>
      <div
        role="listbox"
        aria-label={label}
        className={cn(
          'max-h-52 snap-y snap-mandatory overflow-y-auto scroll-smooth p-1 shadow-inner [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          uiStyles.optionPanel,
        )}
      >
        {values.map((value) => {
          const isSelected = value === selected;

          return (
            <button
              key={value}
              type="button"
              role="option"
              aria-selected={isSelected}
              aria-label={`${pad(value)} ${suffix}`}
              className={cn(
                'flex h-9 w-full snap-center items-center justify-center rounded-xl text-sm',
                uiStyles.optionItemInteractive,
                isSelected
                  ? 'bg-primary text-primary-foreground shadow-sm dark:bg-primary-dark dark:text-primary-dark-foreground'
                  : uiStyles.textForeground,
              )}
              onClick={() => onSelect(value)}
            >
              {pad(value)}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const DateTimePicker = React.forwardRef<HTMLDivElement, DateTimePickerProps>(
  (
    {
      className,
      clearable = true,
      disabled = false,
      mock = false,
      onChange,
      placeholder,
      type,
      value,
      ...props
    },
    ref,
  ) => {
    const isControlled = value !== undefined;
    const [open, setOpen] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState<DateTimePickerValue | undefined>(() =>
      value !== undefined ? value : mock ? getInitialMockValue(type) : undefined,
    );
    const selectedValue = isControlled ? value : internalValue;
    const selectedDate = getDateValue(selectedValue);
    const selectedTime = getTimeParts(selectedValue);
    const displayText = getDisplayText(type, selectedValue);
    const currentPlaceholder = placeholder ?? getDefaultPlaceholder(type);
    const showClear = clearable && !disabled && selectedValue !== undefined;
    const TriggerIcon = type === 'time' ? Clock : Calendar;
    const [viewDate, setViewDate] = React.useState(() => selectedDate ?? mockTrainingScheduleDateTime());

    React.useEffect(() => {
      if (isControlled) {
        setInternalValue(value);
      }
    }, [isControlled, value]);

    const commitValue = (nextValue: DateTimePickerValue | undefined) => {
      if (!isControlled) {
        setInternalValue(nextValue);
      }

      onChange?.(nextValue);
    };

    const handleOpenChange = (nextOpen: boolean) => {
      if (disabled) {
        return;
      }

      if (nextOpen && selectedDate) {
        setViewDate(selectedDate);
      }

      setOpen(nextOpen);
    };

    const shiftMonth = (offset: number) => {
      setViewDate((currentDate) => new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
    };

    const shiftYear = (offset: number) => {
      setViewDate((currentDate) => new Date(currentDate.getFullYear() + offset, currentDate.getMonth(), 1));
    };

    const selectDate = (date: Date) => {
      if (type === 'date') {
        const nextDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);

        commitValue(nextDate);
        setViewDate(nextDate);
        setOpen(false);
        return;
      }

      const nextDate = createDateWithTime(date, selectedTime);

      commitValue(nextDate);
      setViewDate(nextDate);
    };

    const selectTime = (part: keyof TimeParts, nextPartValue: number) => {
      const nextTime = {
        ...selectedTime,
        [part]: nextPartValue,
      };

      if (type === 'time') {
        commitValue(formatTime(nextTime));
        return;
      }

      commitValue(createDateWithTime(selectedDate ?? viewDate, nextTime));
    };

    const clearValue = () => {
      commitValue(undefined);
      setOpen(false);
    };

    const calendarCells = React.useMemo(() => getCalendarCells(viewDate), [viewDate]);
    const shouldRenderCalendar = type === 'date' || type === 'datetime';
    const shouldRenderTime = type === 'time' || type === 'datetime';

    return (
      <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
        <div ref={ref} className={cn('relative w-full', className)} {...props}>
          <PopoverPrimitive.Trigger asChild>
            <button
              type="button"
              role="combobox"
              aria-expanded={open}
              aria-label={displayText || currentPlaceholder}
              disabled={disabled}
              className={cn(
                'flex items-center justify-between gap-2 pr-10 text-left shadow-sm',
                showClear && 'pr-16',
                uiStyles.controlBase,
                uiStyles.focusRing,
                uiStyles.controlDisabled,
                !disabled && uiStyles.formControlHover,
              )}
            >
              <span className={uiStyles.mutedIconSlot} aria-hidden="true">
                <TriggerIcon />
              </span>
              <span
                className={cn(
                  'min-w-0 flex-1 truncate',
                  !displayText && uiStyles.textMuted,
                )}
              >
                {displayText || currentPlaceholder}
              </span>
              <span
                className={cn(
                  uiStyles.mutedIconSlot,
                  'transition-transform duration-200',
                  open && 'rotate-180 text-primary dark:text-primary-dark',
                )}
                aria-hidden="true"
              >
                <ChevronDown />
              </span>
            </button>
          </PopoverPrimitive.Trigger>

          {showClear ? (
            <button
              type="button"
              aria-label="清除选择"
              className={cn('absolute right-9 top-1/2 size-6 -translate-y-1/2', uiStyles.closeButton)}
              onClick={clearValue}
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          ) : null}
        </div>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            align="start"
            sideOffset={8}
            className={cn(
              'flex max-w-[min(94vw,44rem)] gap-4 overflow-hidden p-4',
              uiStyles.floatingContent,
              shouldRenderCalendar && shouldRenderTime ? 'flex-col md:flex-row' : 'flex-col',
              uiStyles.floatingStateMotion,
              uiStyles.floatingSideMotion,
            )}
          >
            {shouldRenderCalendar ? (
              <div className="w-80 max-w-[calc(100vw-3rem)]">
                <div className="mb-4 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      aria-label="上一年"
                      className={cn('size-8', uiStyles.closeButton)}
                      onClick={() => shiftYear(-1)}
                    >
                      <ChevronsLeft className="size-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      aria-label="上个月"
                      className={cn('size-8', uiStyles.closeButton)}
                      onClick={() => shiftMonth(-1)}
                    >
                      <ChevronLeft className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                  <div className={cn('text-sm font-semibold', uiStyles.textForeground)}>
                    {viewDate.getFullYear()}年{viewDate.getMonth() + 1}月
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      aria-label="下个月"
                      className={cn('size-8', uiStyles.closeButton)}
                      onClick={() => shiftMonth(1)}
                    >
                      <ChevronRight className="size-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      aria-label="下一年"
                      className={cn('size-8', uiStyles.closeButton)}
                      onClick={() => shiftYear(1)}
                    >
                      <ChevronsRight className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 border-b border-border/70 pb-2 text-center text-xs font-medium text-muted-foreground dark:border-border-dark/70 dark:text-muted-dark-foreground">
                  {weekDays.map((weekday) => (
                    <div key={weekday}>{weekday}</div>
                  ))}
                </div>
                <div
                  role="grid"
                  className={cn(uiStyles.optionPanel, 'mt-2 grid grid-cols-7 gap-y-1 rounded-2xl p-2')}
                >
                  {calendarCells.map(({ date, isCurrentMonth }) => {
                    const selected = isSameDate(selectedDate, date);
                    const dateLabel = `${formatDate(date)}${isCurrentMonth ? '' : ' 非本月'}`;

                    return (
                      <div key={dateLabel} role="gridcell" className="flex size-10 items-center justify-center">
                        <button
                          type="button"
                          aria-label={dateLabel}
                          className={cn(
                            'flex size-9 items-center justify-center rounded-full text-sm transition-all duration-150 hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary focus:outline-none dark:hover:bg-primary-dark-soft/60 dark:hover:text-primary-dark dark:focus:bg-primary-dark-soft/60 dark:focus:text-primary-dark',
                            !isCurrentMonth && 'text-muted-foreground/70 dark:text-muted-dark-foreground',
                            isCurrentMonth && uiStyles.textForeground,
                            selected &&
                              'bg-primary text-primary-foreground shadow-md hover:bg-primary hover:text-primary-foreground dark:bg-primary-dark dark:text-primary-dark-foreground dark:hover:bg-primary-dark',
                          )}
                          onClick={() => selectDate(date)}
                        >
                          {date.getDate()}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {shouldRenderTime ? (
              <div className={cn(uiStyles.optionPanel, 'min-w-72 rounded-2xl p-3')}>
                <div className={cn('mb-3 flex items-center gap-2 text-sm font-semibold', uiStyles.textForeground)}>
                  <Clock className="size-4 text-primary dark:text-primary-dark" aria-hidden="true" />
                  时间
                </div>
                <div className="flex gap-3">
                  <TimeColumn
                    label="选择小时"
                    suffix="小时"
                    values={hourOptions}
                    selected={selectedTime.hour}
                    onSelect={(nextHour) => selectTime('hour', nextHour)}
                  />
                  <TimeColumn
                    label="选择分钟"
                    suffix="分钟"
                    values={minuteSecondOptions}
                    selected={selectedTime.minute}
                    onSelect={(nextMinute) => selectTime('minute', nextMinute)}
                  />
                  <TimeColumn
                    label="选择秒钟"
                    suffix="秒钟"
                    values={minuteSecondOptions}
                    selected={selectedTime.second}
                    onSelect={(nextSecond) => selectTime('second', nextSecond)}
                  />
                </div>
              </div>
            ) : null}
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    );
  },
);

DateTimePicker.displayName = 'DateTimePicker';
