import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ConfigProvider, useBoaoConfig } from './config-provider';

const ConfigConsumer = () => {
  const config = useBoaoConfig();

  return <span>{`${config.theme}-${config.size}-${config.locale}`}</span>;
};

describe('ConfigProvider', () => {
  it('provides theme, size and locale context to descendants', () => {
    render(
      <ConfigProvider theme="dark" size="large" locale="zh-CN">
        <ConfigConsumer />
      </ConfigProvider>,
    );

    expect(screen.getByText('dark-large-zh-CN')).toBeInTheDocument();
    expect(screen.getByTestId('boao-config-provider')).toHaveClass('dark');
  });
});
