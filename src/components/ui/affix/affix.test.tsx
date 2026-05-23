import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Affix } from './affix';

describe('Affix', () => {
  it('renders a sticky container with top offset', () => {
    render(
      <Affix offsetTop={16}>
        <button type="button">保存草稿</button>
      </Affix>,
    );

    const affix = screen.getByTestId('boao-affix');

    expect(screen.getByRole('button', { name: '保存草稿' })).toBeInTheDocument();
    expect(affix).toHaveStyle({ position: 'sticky', top: '16px' });
  });

  it('supports bottom sticky placement', () => {
    render(
      <Affix offsetBottom={24}>
        <button type="button">批量提交</button>
      </Affix>,
    );

    expect(screen.getByTestId('boao-affix')).toHaveStyle({ position: 'sticky', bottom: '24px' });
  });
});
