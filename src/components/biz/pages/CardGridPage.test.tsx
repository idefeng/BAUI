import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CardGridPage, type CardGridItem } from './CardGridPage';

describe('CardGridPage', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('mock 模式渲染 Form 搜索、卡片网格和 Pagination', () => {
    render(<CardGridPage mock />);

    expect(screen.getByTestId('card-grid-page-root')).toHaveClass('dark:bg-background-dark');
    expect(screen.getByText('项目卡片检索')).toBeInTheDocument();
    expect(screen.getAllByTestId('card-grid-item-card')).toHaveLength(6);
    expect(screen.getByTestId('pagination-root')).toHaveTextContent('共 12 条');
  });

  it('继续教育业务属性会透传给搜索表单和卡片数据源', () => {
    render(
      <CardGridPage
        mock
        ba_training_project="ETLCHINA-2026-AI"
        ba_trainning_title="AI-AGENT-ENGINEER"
        ba_trainning_type="CONTINUING-EDUCATION"
      />,
    );

    expect(screen.getAllByText('继续教育').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/继续教育：/).length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole('button', { name: '一键填表' }));

    expect(screen.getAllByText('ETLCHINA 2026 AI 实训项目').length).toBeGreaterThan(0);
  });

  it('点击 Form 一键填表后联动下方卡片流骨架屏，再恢复卡片列表', () => {
    vi.useFakeTimers();

    render(<CardGridPage mock />);

    fireEvent.click(screen.getByRole('button', { name: '一键填表' }));

    expect(screen.getAllByTestId('card-grid-skeleton-card')).toHaveLength(6);
    expect(screen.queryAllByTestId('card-grid-item-card')).toHaveLength(0);

    act(() => {
      vi.advanceTimersByTime(800);
    });

    expect(screen.getAllByTestId('card-grid-item-card')).toHaveLength(6);
  });

  it('外部传入 items 时优先展示真实卡片数据', () => {
    const items: CardGridItem[] = [
      {
        id: 'custom-card-1',
        title: '真实项目 A',
        description: '业务侧传入的真实卡片内容。',
        status: '进行中',
        projectName: '企业内训项目',
        trainingType: '专项能力提升',
        learnerCount: 88,
        updatedAt: '2026-05-23',
        owner: '教务中心',
        tags: ['真实数据'],
      },
    ];

    render(<CardGridPage mock items={items} />);

    const card = screen.getByTestId('card-grid-item-card');

    expect(within(card).getByText('真实项目 A')).toBeInTheDocument();
    expect(screen.getAllByTestId('card-grid-item-card')).toHaveLength(1);
    expect(screen.getByTestId('pagination-root')).toHaveTextContent('共 1 条');
  });
});
