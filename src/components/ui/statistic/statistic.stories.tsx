import type { Meta, StoryObj } from '@storybook/react';

import { Card, CardContent, CardHeader, CardTitle } from '../card';
import { Statistic } from './statistic';

const meta = {
  title: 'UI/Statistic',
  component: Statistic,
  tags: ['autodocs'],
  args: {
    title: '本周新增学员',
    value: 1286,
    suffix: '人',
    trend: 'up',
    trendText: '同比 +12.6%',
  },
  argTypes: {
    trend: {
      control: 'inline-radio',
      options: ['up', 'down'],
    },
    mock: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Statistic>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const TrendDown: Story = {
  args: {
    title: '待处理异常任务',
    value: 18,
    suffix: '项',
    trend: 'down',
    trendText: '环比 -4.8%',
  },
};

export const MockDashboard: Story = {
  render: () => (
    <div className="grid w-[760px] grid-cols-2 gap-4">
      <Statistic mock mockSeed={0} />
      <Statistic mock mockSeed={1} />
      <Statistic mock mockSeed={2} />
      <Statistic mock mockSeed={3} />
    </div>
  ),
};

export const InsideCard: Story = {
  render: () => (
    <Card className="w-[520px]">
      <CardHeader>
        <CardTitle>IT 培训运营看板</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <Statistic mock mockSeed={0} className="border-0 bg-secondary shadow-none dark:bg-secondary-dark" />
        <Statistic mock mockSeed={1} className="border-0 bg-secondary shadow-none dark:bg-secondary-dark" />
      </CardContent>
    </Card>
  ),
};
