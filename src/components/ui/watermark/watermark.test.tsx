import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Watermark } from './watermark';

describe('Watermark', () => {
  it('renders children while overlaying repeated watermark content', () => {
    render(
      <Watermark content="内部资料">
        <div>证书预览</div>
      </Watermark>,
    );

    expect(screen.getByText('证书预览')).toBeInTheDocument();
    expect(screen.getAllByText('内部资料').length).toBeGreaterThan(1);
  });

  it('uses central mock watermark content when mock is enabled', () => {
    render(
      <Watermark mock>
        <div>项目材料</div>
      </Watermark>,
    );

    expect(screen.getByText('项目材料')).toBeInTheDocument();
    expect(screen.getAllByText('ETLCHINA 内部预览').length).toBeGreaterThan(1);
  });
});
