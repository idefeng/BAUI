import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { EtlChinaRegistryHero } from './etlchina-registry-hero';

describe('EtlChinaRegistryHero', () => {
  it('渲染官方首屏、三组完备度指标和业务属性控制台', () => {
    render(<EtlChinaRegistryHero />);

    expect(screen.getByRole('img', { name: '博奥教育 / ETLCHINA 品牌标识' })).toBeInTheDocument();
    expect(screen.getByText('博奥教育企业级前端业务中台 - ETLCHINA')).toBeInTheDocument();
    expect(screen.getByText('组件完备度')).toBeInTheDocument();
    expect(screen.getByText('Mock 覆盖率')).toBeInTheDocument();
    expect(screen.getByText('模板可用度')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: '广东省 / 广州市 / 天河区' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { hidden: true, name: '培训岗位' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: '学员' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.queryByTestId('etlchina-registry-preview')).not.toBeInTheDocument();
  });

  it('点击激活后展示 mock=true 的广东 AI 学员后台演练', async () => {
    const user = userEvent.setup();

    render(<EtlChinaRegistryHero />);

    await user.click(screen.getByRole('button', { name: '一键激活业务中台 Mock 演练' }));

    expect(screen.getByTestId('etlchina-registry-preview')).toBeInTheDocument();
    expect(screen.getAllByText('广东省 AI工程师学员后台').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('学员导航菜单')).toBeInTheDocument();
    expect(screen.getByText('广东省年度继续教育学分')).toBeInTheDocument();
    expect(screen.getByText('广东省学分达标率')).toBeInTheDocument();
    expect(screen.getAllByText(/AI Agent 工程师/).length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('mock=true')).toBeInTheDocument();
  });

  it('可默认进入北京全栈开发讲师视角，并联动到开课与批改看板', () => {
    render(
      <EtlChinaRegistryHero
        defaultActivated
        defaultRegionValue={['110000', '110100', '110108']}
        defaultTrainningTitle="FULLSTACK-DEVELOPER"
        defaultUserRole="讲师"
      />,
    );

    expect(screen.getAllByText('北京市 全栈开发讲师后台').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('讲师导航菜单')).toBeInTheDocument();
    expect(screen.getByText('待批改作业')).toBeInTheDocument();
    expect(screen.getByText('开课数据')).toBeInTheDocument();
    expect(screen.getAllByText(/React 全栈交付/).length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('北京市年度继续教育学分')).toBeInTheDocument();
  });
});
