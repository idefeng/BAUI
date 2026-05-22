export type UiStatusVariant = 'primary' | 'success' | 'warning' | 'error' | 'gray';
export type UiProgressStatus = 'normal' | 'success' | 'exception';
export type UiTrend = 'up' | 'down';

export const uiStatusStyles = {
  soft: {
    primary: 'bg-primary-soft text-primary dark:bg-primary-dark-soft dark:text-primary-dark',
    success: 'bg-success-soft text-success dark:bg-success-dark-soft dark:text-success-dark',
    warning: 'bg-warning-soft text-warning dark:bg-warning-dark-soft dark:text-warning-dark',
    error: 'bg-danger-soft text-danger dark:bg-danger-dark-soft dark:text-danger-dark',
    gray: 'bg-secondary text-secondary-foreground dark:bg-secondary-dark dark:text-secondary-dark-foreground',
  } satisfies Record<UiStatusVariant, string>,
  tag: {
    primary:
      'border-primary/20 bg-primary-soft/70 text-primary dark:border-primary-dark/30 dark:bg-primary-dark-soft/70 dark:text-primary-dark',
    success:
      'border-success/20 bg-success-soft/70 text-success dark:border-success-dark/30 dark:bg-success-dark-soft/70 dark:text-success-dark',
    warning:
      'border-warning/20 bg-warning-soft/70 text-warning dark:border-warning-dark/30 dark:bg-warning-dark-soft/70 dark:text-warning-dark',
    error:
      'border-danger/20 bg-danger-soft/70 text-danger dark:border-danger-dark/30 dark:bg-danger-dark-soft/70 dark:text-danger-dark',
    gray:
      'border-border bg-secondary/80 text-secondary-foreground dark:border-border-dark dark:bg-secondary-dark/80 dark:text-secondary-dark-foreground',
  } satisfies Record<UiStatusVariant, string>,
  progress: {
    normal: 'bg-primary dark:bg-primary-dark',
    success: 'bg-success dark:bg-success-dark',
    exception: 'bg-danger dark:bg-danger-dark',
  } satisfies Record<UiProgressStatus, string>,
  trend: {
    up: 'text-success dark:text-success-dark',
    down: 'text-danger dark:text-danger-dark',
  } satisfies Record<UiTrend, string>,
};

export const uiStyles = {
  textForeground: 'text-foreground dark:text-foreground-dark',
  textMuted: 'text-muted-foreground dark:text-muted-dark-foreground',
  activePrimary:
    'bg-primary text-primary-foreground shadow-md dark:bg-primary-dark dark:text-primary-dark-foreground',
  primarySurfaceHover:
    'hover:bg-primary-soft hover:text-primary dark:hover:bg-primary-dark-soft dark:hover:text-primary-dark',
  formControlHover:
    'hover:border-primary/70 hover:bg-primary-soft dark:hover:border-primary-dark/80 dark:hover:bg-primary-dark-soft',
  choiceControlBase:
    'inline-flex size-5 shrink-0 items-center justify-center border border-border bg-surface shadow-sm outline-none transition-all duration-200',
  controlBase:
    'h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-foreground transition-all duration-200 dark:border-border-dark dark:bg-surface-dark dark:text-foreground-dark',
  controlDisabled:
    'disabled:cursor-not-allowed disabled:border-border disabled:bg-disabled disabled:text-disabled-foreground dark:disabled:border-border-dark dark:disabled:bg-disabled-dark dark:disabled:text-disabled-dark-foreground',
  buttonDisabled:
    'disabled:pointer-events-none disabled:border-border disabled:bg-disabled disabled:text-disabled-foreground disabled:shadow-none dark:disabled:border-border-dark dark:disabled:bg-disabled-dark dark:disabled:text-disabled-dark-foreground',
  dataDisabledControl:
    'data-[disabled=true]:border-border data-[disabled=true]:bg-disabled data-[disabled=true]:text-disabled-foreground dark:data-[disabled=true]:border-border-dark dark:data-[disabled=true]:bg-disabled-dark dark:data-[disabled=true]:text-disabled-dark-foreground',
  dataDisabledButton:
    'data-[disabled=true]:pointer-events-none data-[disabled=true]:border-border data-[disabled=true]:bg-disabled data-[disabled=true]:text-disabled-foreground data-[disabled=true]:shadow-none dark:data-[disabled=true]:border-border-dark dark:data-[disabled=true]:bg-disabled-dark dark:data-[disabled=true]:text-disabled-dark-foreground',
  radixDisabledControl:
    'data-[disabled]:cursor-not-allowed data-[disabled]:border-border data-[disabled]:bg-disabled data-[disabled]:text-disabled-foreground data-[disabled]:opacity-80 dark:data-[disabled]:border-border-dark dark:data-[disabled]:bg-disabled-dark dark:data-[disabled]:text-disabled-dark-foreground',
  radixDisabledItem: 'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
  fieldFocusWithin:
    'focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 focus-within:ring-offset-2 focus-within:ring-offset-background dark:focus-within:border-primary-dark dark:focus-within:ring-primary-dark/30 dark:focus-within:ring-offset-background-dark',
  focusRing:
    'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-background dark:focus:ring-primary-dark/30 dark:focus:ring-offset-background-dark',
  focusBreathingRing: 'focus-breathing-ring',
  buttonFocusVisibleRing:
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:focus-visible:ring-ring-dark dark:focus-visible:ring-offset-background-dark',
  mutedIconSlot:
    'inline-flex size-4 shrink-0 items-center justify-center text-muted-foreground dark:text-muted-dark-foreground [&>svg]:size-4',
  iconSlot: 'inline-flex size-4 items-center justify-center [&>svg]:size-4',
  closeButton:
    'inline-flex items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 dark:text-muted-dark-foreground dark:hover:bg-secondary-dark-hover dark:hover:text-foreground-dark dark:focus-visible:ring-primary-dark/30',
  iconGhostButton:
    'inline-flex shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary-hover hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 dark:text-muted-dark-foreground dark:hover:bg-secondary-dark-hover dark:hover:text-foreground-dark dark:focus:ring-primary-dark/30',
  panelSurface:
    'rounded-2xl border border-border bg-surface text-foreground shadow-sm dark:border-border-dark dark:bg-surface-dark/50 dark:text-foreground-dark',
  surfaceShell:
    'rounded-2xl border border-border bg-surface shadow-sm dark:border-border-dark dark:bg-surface-dark',
  carouselArrowButton:
    'absolute top-1/2 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-foreground opacity-0 shadow-button backdrop-blur transition-all duration-200 hover:bg-primary-soft hover:text-primary group-hover:opacity-100 focus:opacity-100 dark:bg-surface-dark/90 dark:text-foreground-dark dark:hover:bg-primary-dark-soft dark:hover:text-primary-dark',
  floatingSurface:
    'rounded-2xl border border-border bg-surface text-foreground shadow-button dark:border-border-dark dark:bg-surface-dark dark:text-foreground-dark',
  surfaceCard: 'border border-border bg-surface shadow-button dark:border-border-dark dark:bg-surface-dark',
  floatingStateMotion: 'data-[state=open]:animate-select-in data-[state=closed]:animate-select-out',
  floatingDelayedStateMotion:
    'data-[state=delayed-open]:animate-select-in data-[state=closed]:animate-select-out',
  floatingSideMotion:
    'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
  sectionLabel: 'px-3 py-2 text-xs font-medium text-muted-foreground dark:text-muted-dark-foreground',
  separator: '-mx-1 my-1 h-px bg-border dark:bg-border-dark',
  scrollButton:
    'flex cursor-default items-center justify-center py-2 text-muted-foreground dark:text-muted-dark-foreground',
  menuItemBase:
    'relative flex cursor-default select-none items-center rounded-xl py-2.5 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
  menuItemDefault:
    'text-foreground focus:bg-primary-soft focus:text-primary dark:text-foreground-dark dark:focus:bg-primary-dark-soft dark:focus:text-primary-dark',
  menuItemDanger:
    'text-danger focus:bg-danger-soft focus:text-danger dark:text-danger-dark dark:focus:bg-danger-dark-soft dark:focus:text-danger-dark',
  stateOpenPrimary:
    'data-[state=open]:bg-primary-soft data-[state=open]:text-primary dark:data-[state=open]:bg-primary-dark-soft dark:data-[state=open]:text-primary-dark',
  surfaceInteractive:
    'border border-border bg-surface hover:bg-primary-soft hover:text-primary dark:border-border-dark dark:bg-surface-dark dark:hover:bg-primary-dark-soft dark:hover:text-primary-dark',
  title: 'text-sm font-semibold text-foreground dark:text-foreground-dark',
  description: 'text-sm text-muted-foreground dark:text-muted-dark-foreground',
};
