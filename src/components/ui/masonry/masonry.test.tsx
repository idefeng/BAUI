import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Masonry } from './masonry';

describe('Masonry', () => {
  it('renders children in a CSS masonry column layout', () => {
    render(
      <Masonry columns={3} gap={16}>
        <article>项目 A</article>
        <article>项目 B</article>
      </Masonry>,
    );

    const masonry = screen.getByTestId('boao-masonry');

    expect(screen.getByText('项目 A')).toBeInTheDocument();
    expect(masonry).toHaveStyle({ columnCount: '3', columnGap: '16px' });
  });
});
