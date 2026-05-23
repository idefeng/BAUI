import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { StandardLoginPages } from './standard-login-pages';

describe('StandardLoginPages', () => {
  it.each(['tech', 'education', 'minimal', 'split-screen', 'classic'] as const)(
    '%s 模板在表单正上方自动渲染标准品牌标识',
    (type) => {
      render(<StandardLoginPages type={type} onSubmit={() => undefined} />);

      expect(screen.getByTestId('standard-login-brand-logo')).toHaveAttribute(
        'aria-label',
        '灵境实训 / NEXUS LEARN 品牌标识',
      );
    },
  );

  it('education 模板展示学堂轮播、角色选择器和进入学堂按钮', () => {
    render(<StandardLoginPages type="education" onSubmit={() => undefined} />);

    expect(screen.getByText('2026年度优秀学员风采')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: '登录角色' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '进入学堂' })).toBeInTheDocument();
  });

  it('账号和密码为空时阻止提交并展示校验提示', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(<StandardLoginPages type="tech" onSubmit={onSubmit} />);

    await user.click(screen.getByRole('button', { name: '登录控制台' }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText('请输入账号')).toBeInTheDocument();
    expect(screen.getByText('请输入密码')).toBeInTheDocument();
  });

  it('通过校验后回传账号、密码和教育模板角色', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(<StandardLoginPages type="education" onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('登录账号'), 'teacher_001');
    await user.type(screen.getByLabelText('登录密码'), 'Boao@2026');
    await user.click(screen.getByRole('button', { name: '进入学堂' }));

    expect(onSubmit).toHaveBeenCalledWith({
      username: 'teacher_001',
      password: 'Boao@2026',
      role: 'student',
    });
  });

  it('mock 模式展示 AI 一键填表并使用中央 mock 账号填充表单', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(<StandardLoginPages type="minimal" mock onSubmit={onSubmit} />);

    await user.click(screen.getByRole('button', { name: '🌟 AI 一键填表' }));

    expect(screen.getByLabelText('登录账号')).toHaveValue('boao.admin');
    expect(screen.getByLabelText('登录密码')).toHaveValue('Boao@2026');

    await user.click(screen.getByRole('button', { name: '登录' }));

    expect(onSubmit).toHaveBeenCalledWith({
      username: 'boao.admin',
      password: 'Boao@2026',
    });
  });

  it('classic 模板要求填写图形验证码但不会把验证码暴露给提交回调', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(<StandardLoginPages type="classic" onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('登录账号'), 'gov_admin');
    await user.type(screen.getByLabelText('登录密码'), 'Boao@2026');
    await user.click(screen.getByRole('button', { name: '安全登录' }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText('请输入图形验证码')).toBeInTheDocument();

    await user.type(screen.getByLabelText('图形验证码'), 'BA26');
    await user.click(screen.getByRole('button', { name: '安全登录' }));

    expect(onSubmit).toHaveBeenCalledWith({
      username: 'gov_admin',
      password: 'Boao@2026',
    });
  });

  it('split-screen 模板左侧展示品牌背景与企业版权声明', () => {
    render(<StandardLoginPages type="split-screen" onSubmit={() => undefined} />);

    expect(screen.getByTestId('standard-login-brand-background')).toBeInTheDocument();
    expect(screen.getByText('© 2026 HIGASHIKAWA CO., LTD. All Rights Reserved.')).toBeInTheDocument();
  });
});
