import type { Meta, StoryObj } from '@storybook/react';

import { NavMenu } from './nav-menu';

const meta = {
  title: 'Biz/NavMenu',
  component: NavMenu,
  tags: ['autodocs'],
  args: {
    mock: true,
    currentPath: '/certificates',
  },
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof NavMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const HorizontalMock: Story = {
  args: {
    layout: 'horizontal',
  },
};

export const VerticalSidebarMock: Story = {
  args: {
    layout: 'vertical',
  },
  render: (args) => (
    <div className="min-h-[520px] bg-secondary p-6 dark:bg-background-dark">
      <NavMenu {...args} />
    </div>
  ),
};
