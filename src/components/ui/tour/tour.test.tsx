import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Tour } from './tour';

const steps = [
  { title: '查看项目列表', description: '从这里进入项目详情页。' },
  { title: '处理审核任务', description: '在这里完成资料复核。' },
];

describe('Tour', () => {
  it('renders the active step when open', () => {
    render(<Tour open steps={steps} current={0} />);

    expect(screen.getByRole('dialog', { name: '查看项目列表' })).toBeInTheDocument();
    expect(screen.getByText('从这里进入项目详情页。')).toBeInTheDocument();
    expect(screen.getByText('1 / 2')).toBeInTheDocument();
  });

  it('moves to the next step and closes at the end', async () => {
    const user = userEvent.setup();
    const handleCurrentChange = vi.fn();
    const handleClose = vi.fn();

    render(
      <Tour
        open
        steps={steps}
        current={1}
        onCurrentChange={handleCurrentChange}
        onClose={handleClose}
      />,
    );

    await user.click(screen.getByRole('button', { name: '完成' }));

    expect(handleClose).toHaveBeenCalled();
    expect(handleCurrentChange).not.toHaveBeenCalled();
  });
});
