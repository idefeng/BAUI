export const uiStyles = {
  controlBase:
    'h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-foreground transition-all duration-200 dark:border-border-dark dark:bg-surface-dark dark:text-foreground-dark',
  controlDisabled:
    'disabled:cursor-not-allowed disabled:border-border disabled:bg-disabled disabled:text-disabled-foreground dark:disabled:border-border-dark dark:disabled:bg-disabled-dark dark:disabled:text-disabled-dark-foreground',
  dataDisabledControl:
    'data-[disabled=true]:border-border data-[disabled=true]:bg-disabled data-[disabled=true]:text-disabled-foreground dark:data-[disabled=true]:border-border-dark dark:data-[disabled=true]:bg-disabled-dark dark:data-[disabled=true]:text-disabled-dark-foreground',
  fieldFocusWithin:
    'focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 focus-within:ring-offset-2 focus-within:ring-offset-background dark:focus-within:border-primary-dark dark:focus-within:ring-primary-dark/30 dark:focus-within:ring-offset-background-dark',
  focusRing:
    'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-background dark:focus:ring-primary-dark/30 dark:focus:ring-offset-background-dark',
  buttonFocusVisibleRing:
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:focus-visible:ring-ring-dark dark:focus-visible:ring-offset-background-dark',
  mutedIconSlot:
    'inline-flex size-4 shrink-0 items-center justify-center text-muted-foreground dark:text-muted-dark-foreground [&>svg]:size-4',
  iconSlot: 'inline-flex size-4 items-center justify-center [&>svg]:size-4',
  closeButton:
    'inline-flex items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 dark:text-muted-dark-foreground dark:hover:bg-secondary-dark-hover dark:hover:text-foreground-dark dark:focus-visible:ring-primary-dark/30',
  floatingSurface:
    'rounded-2xl border border-border bg-surface text-foreground shadow-button dark:border-border-dark dark:bg-surface-dark dark:text-foreground-dark',
  title: 'text-sm font-semibold text-foreground dark:text-foreground-dark',
  description: 'text-sm text-muted-foreground dark:text-muted-dark-foreground',
};
