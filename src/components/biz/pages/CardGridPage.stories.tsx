import type { Meta, StoryObj } from '@storybook/react';

import { CardGridPage } from './CardGridPage';

const meta = {
  title: 'Biz/Pages/CardGridPage',
  component: CardGridPage,
  tags: ['autodocs'],
  args: {
    mock: true,
  },
  argTypes: {
    mock: {
      control: 'boolean',
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof CardGridPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const MockCards: Story = {};

export const DarkMode: Story = {
  render: (args) => (
    <div className="dark">
      <CardGridPage {...args} />
    </div>
  ),
};
