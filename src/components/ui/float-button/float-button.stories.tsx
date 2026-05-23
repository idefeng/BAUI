import type { Meta, StoryObj } from '@storybook/react';
import { MessageSquarePlus } from 'lucide-react';

import { FloatButton } from './float-button';

const meta = {
  title: 'UI/FloatButton',
  component: FloatButton,
  tags: ['autodocs'],
  args: {
    'aria-label': '快速新建',
    tooltip: '快速新建',
    variant: 'primary',
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['primary', 'success', 'danger', 'secondary'],
    },
    position: {
      control: 'inline-radio',
      options: ['bottom-right', 'bottom-left', 'top-right', 'top-left'],
    },
  },
} satisfies Meta<typeof FloatButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const ReportIssue: Story = {
  args: {
    'aria-label': '上报异常',
    icon: <MessageSquarePlus />,
    tooltip: '上报异常',
    variant: 'danger',
  },
};
