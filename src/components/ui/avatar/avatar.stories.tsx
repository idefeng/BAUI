import type { Meta, StoryObj } from '@storybook/react';

import { mockUsers } from '../../../utils/mock';
import { BadgeDot } from '../badge';
import { Avatar } from './avatar';

const users = mockUsers(4);

const meta = {
  title: 'UI/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: {
    name: users[0].name,
    src: users[0].avatarUrl,
    alt: `${users[0].name}头像`,
    size: 'md',
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
    },
    mock: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar size="sm" name={users[1].name} src={users[1].avatarUrl} />
      <Avatar size="md" name={users[2].name} src={users[2].avatarUrl} />
      <Avatar size="lg" name={users[3].name} src={users[3].avatarUrl} />
    </div>
  ),
};

export const Fallback: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar name="林予安" />
      <Avatar name="Olivia Chen" />
      <Avatar name="张老师" />
    </div>
  ),
};

export const MockMode: Story = {
  args: {
    mock: true,
    name: undefined,
    src: undefined,
    alt: 'mock 学员头像',
  },
};

export const WithDot: Story = {
  render: () => (
    <BadgeDot label="该学员有新消息">
      <Avatar size="lg" name={users[0].name} src={users[0].avatarUrl} />
    </BadgeDot>
  ),
};
