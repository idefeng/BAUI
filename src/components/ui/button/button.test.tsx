import { render, screen } from '@testing-library/react';
import { Send } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

import { Button } from './button';

describe('Button', () => {
  it('默认使用 solid 变体和主色语义类名', () => {
    render(<Button>提交</Button>);

    const button = screen.getByRole('button', { name: '提交' });

    expect(button).toHaveClass('bg-primary');
    expect(button).toHaveClass('text-primary-foreground');
    expect(button).toHaveClass('rounded-xl');
  });

  it('支持 outline 和 ghost 变体', () => {
    const { rerender } = render(<Button variant="outline">取消</Button>);

    expect(screen.getByRole('button', { name: '取消' })).toHaveClass('border-primary');

    rerender(<Button variant="ghost">更多</Button>);

    expect(screen.getByRole('button', { name: '更多' })).toHaveClass('bg-transparent');
  });

  it('loading 时进入禁用状态并暴露忙碌语义', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(
      <Button loading onClick={onClick}>
        保存
      </Button>,
    );

    const button = screen.getByRole('button', { name: '保存' });
    await user.click(button);

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(onClick).not.toHaveBeenCalled();
  });

  it('disabled 时阻止点击并保留禁用语义', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(
      <Button disabled onClick={onClick} leftIcon={<Send aria-hidden="true" />}>
        发送
      </Button>,
    );

    const button = screen.getByRole('button', { name: '发送' });
    await user.click(button);

    expect(button).toBeDisabled();
    expect(onClick).not.toHaveBeenCalled();
  });
});
