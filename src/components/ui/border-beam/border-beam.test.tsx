import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BorderBeam } from './border-beam';

describe('BorderBeam', () => {
  it('wraps content with a semantic animated border layer', () => {
    render(
      <BorderBeam>
        <div>品牌展示卡片</div>
      </BorderBeam>,
    );

    expect(screen.getByText('品牌展示卡片')).toBeInTheDocument();
    expect(screen.getByTestId('boao-border-beam')).toHaveAttribute('data-animated', 'true');
  });
});
