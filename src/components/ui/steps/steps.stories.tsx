import type { Meta, StoryObj } from '@storybook/react';

import { Steps } from './steps';

const projectSteps = [
  { title: '提交资料', description: '上传学员名单' },
  { title: '审核资质', description: '管理员复核' },
  { title: '签发证书', description: '生成证书编号' },
];

const meta = {
  title: 'UI/Steps',
  component: Steps,
  tags: ['autodocs'],
  args: {
    current: 1,
    items: projectSteps,
  },
  argTypes: {
    direction: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
    current: {
      control: { type: 'number', min: 0, max: 2 },
    },
  },
} satisfies Meta<typeof Steps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const ErrorState: Story = {
  args: {
    current: 1,
    items: [
      projectSteps[0],
      { ...projectSteps[1], status: 'error' },
      projectSteps[2],
    ],
  },
};

export const Vertical: Story = {
  args: {
    direction: 'vertical',
    current: 2,
  },
};
