import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Steps } from './steps';

const items = [
  { title: '提交资料', description: '上传学员名单' },
  { title: '审核资质', description: '管理员复核' },
  { title: '签发证书', description: '生成证书编号' },
];

describe('Steps', () => {
  it('按 current 标记已完成、进行中和待处理步骤', () => {
    render(<Steps current={1} items={items} />);

    expect(screen.getByText('提交资料').closest('li')).toHaveAttribute('data-status', 'finish');
    expect(screen.getByText('审核资质').closest('li')).toHaveAttribute('data-status', 'process');
    expect(screen.getByText('签发证书').closest('li')).toHaveAttribute('data-status', 'wait');
  });

  it('点击步骤时触发 onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Steps current={0} items={items} onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: '审核资质 管理员复核' }));

    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('支持 vertical 方向', () => {
    render(<Steps direction="vertical" current={0} items={items} />);

    expect(screen.getByRole('list')).toHaveClass('flex-col');
  });
});
