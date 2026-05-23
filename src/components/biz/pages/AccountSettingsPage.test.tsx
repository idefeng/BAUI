import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AccountSettingsPage } from './AccountSettingsPage';

describe('AccountSettingsPage', () => {
  it('mock 模式会把业务属性透传给设置表单和证书预览', () => {
    render(
      <AccountSettingsPage
        mock
        ba_training_project="ETLCHINA-2026-AI"
        ba_trainning_title="AI-AGENT-ENGINEER"
        ba_trainning_type="CONTINUING-EDUCATION"
      />,
    );

    expect(screen.getByTestId('account-settings-page-root')).toHaveClass('dark:bg-background-dark');
    expect(screen.getByText('账号设置中心')).toBeInTheDocument();
    expect(screen.getAllByText('ETLCHINA 2026 AI 实训项目').length).toBeGreaterThan(0);
    expect(screen.getByRole('checkbox', { name: 'Python' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: '大模型 fine-tune' })).toBeInTheDocument();
    expect(screen.getByRole('article', { name: '继续教育学分证书' })).toBeInTheDocument();
  });
});
