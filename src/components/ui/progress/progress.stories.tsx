import type { Meta, StoryObj } from '@storybook/react';

import { Card, CardContent, CardHeader, CardTitle } from '../card';
import { Progress } from './progress';

const meta = {
  title: 'UI/Progress',
  component: Progress,
  tags: ['autodocs'],
  args: {
    label: '课程完成率',
    value: 75,
    status: 'normal',
    animated: false,
  },
  argTypes: {
    status: {
      control: 'inline-radio',
      options: ['normal', 'success', 'exception'],
    },
    animated: {
      control: 'boolean',
    },
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
    },
  },
} satisfies Meta<typeof Progress>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => <Progress className="w-[420px]" {...args} />,
};

export const Statuses: Story = {
  render: () => (
    <div className="grid w-[520px] gap-5">
      <Progress label="课程完成率" value={75} />
      <Progress label="证书签发完成率" value={100} status="success" />
      <Progress label="异常任务处理率" value={42} status="exception" />
    </div>
  ),
};

export const Animated: Story = {
  args: {
    animated: true,
    label: '课件上传同步中',
    value: 68,
  },
  render: (args) => <Progress className="w-[420px]" {...args} />,
};

export const MockInCard: Story = {
  render: () => (
    <Card className="w-[520px]">
      <CardHeader>
        <CardTitle>班级进度</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5">
        <Progress mock mockSeed={0} />
        <Progress mock mockSeed={1} />
        <Progress mock mockSeed={2} animated />
      </CardContent>
    </Card>
  ),
};
