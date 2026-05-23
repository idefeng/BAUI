import * as React from 'react';

import { cn } from '../../../lib/utils';

export type BoaoTheme = 'light' | 'dark' | 'system';
export type BoaoSize = 'small' | 'middle' | 'large';

export interface BoaoConfig {
  theme: BoaoTheme;
  size: BoaoSize;
  locale: string;
}

export interface ConfigProviderProps extends React.HTMLAttributes<HTMLDivElement>, Partial<BoaoConfig> {
  /** 测试定位属性，默认用于验证配置容器。 */
  'data-testid'?: string;
}

const defaultConfig: BoaoConfig = {
  theme: 'light',
  size: 'middle',
  locale: 'zh-CN',
};

const BoaoConfigContext = React.createContext<BoaoConfig>(defaultConfig);

export const useBoaoConfig = () => React.useContext(BoaoConfigContext);

export const ConfigProvider = React.forwardRef<HTMLDivElement, ConfigProviderProps>(
  (
    {
      children,
      className,
      locale = defaultConfig.locale,
      size = defaultConfig.size,
      theme = defaultConfig.theme,
      'data-testid': dataTestId = 'boao-config-provider',
      ...props
    },
    ref,
  ) => {
    const value = React.useMemo<BoaoConfig>(() => ({ locale, size, theme }), [locale, size, theme]);

    return (
      <BoaoConfigContext.Provider value={value}>
        <div
          {...props}
          ref={ref}
          data-testid={dataTestId}
          data-theme={theme}
          data-size={size}
          data-locale={locale}
          className={cn(theme === 'dark' && 'dark', className)}
        >
          {children}
        </div>
      </BoaoConfigContext.Provider>
    );
  },
);

ConfigProvider.displayName = 'ConfigProvider';
