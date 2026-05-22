import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Checkbox, CheckboxGroup } from './checkbox';

describe('Checkbox', () => {
  it('支持勾选状态，并包含呼吸式 focus ring 与暗黑勾选态类名', async () => {
    const onCheckedChange = vi.fn();
    const user = userEvent.setup();

    render(<Checkbox aria-label="同意协议" onCheckedChange={onCheckedChange} />);

    const control = screen.getByRole('checkbox', { name: '同意协议' });
    await user.click(control);

    expect(control).toHaveAttribute('aria-checked', 'true');
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(control).toHaveClass('focus-breathing-ring');
    expect(control).toHaveClass('dark:data-[state=checked]:bg-primary-dark');
  });

  it('disabled 时保留禁用语义并阻止勾选', async () => {
    const onCheckedChange = vi.fn();
    const user = userEvent.setup();

    render(<Checkbox aria-label="禁止修改" disabled onCheckedChange={onCheckedChange} />);

    const control = screen.getByRole('checkbox', { name: '禁止修改' });
    await user.click(control);

    expect(control).toBeDisabled();
    expect(control).toHaveAttribute('data-disabled');
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('支持 Form 友好的 checked 与 onChange 受控属性', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<Checkbox aria-label="开通内网权限" checked={false} onChange={onChange} />);

    await user.click(screen.getByRole('checkbox', { name: '开通内网权限' }));

    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('CheckboxGroup 支持 value 数组和 onChange 回写', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(
      <CheckboxGroup
        aria-label="选修技术方向"
        options={[
          { label: '前端', value: 'frontend' },
          { label: 'Java', value: 'java' },
          { label: 'AI Agent', value: 'ai-agent' },
        ]}
        value={['frontend']}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole('checkbox', { name: 'Java' }));

    expect(onChange).toHaveBeenCalledWith(['frontend', 'java']);
  });

  it('CheckboxGroup mock 模式自动加载企业 IT 技术方向选项', () => {
    render(<CheckboxGroup aria-label="Mock 技术方向" mock value={[]} onChange={vi.fn()} />);

    expect(screen.getByRole('checkbox', { name: '前端' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Java' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'AI Agent' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Go' })).toBeInTheDocument();
  });
});
