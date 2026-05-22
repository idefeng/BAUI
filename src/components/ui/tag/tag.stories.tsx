import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { mockTags } from '../../../utils/mock';
import { Tag } from './tag';

const meta = {
  title: 'UI/Tag',
  component: Tag,
  tags: ['autodocs'],
  args: {
    children: 'React 组件库',
    variant: 'primary',
    closable: false,
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['primary', 'success', 'warning', 'error', 'gray'],
    },
    closable: {
      control: 'boolean',
    },
    mock: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Tag>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      {mockTags().map((tag) => (
        <Tag key={tag.label} variant={tag.variant}>
          {tag.label}
        </Tag>
      ))}
    </div>
  ),
};

export const Closable: Story = {
  render: () => {
    const [items, setItems] = React.useState(mockTags());

    return (
      <div className="flex max-w-xl flex-wrap gap-3">
        {items.map((tag) => (
          <Tag
            key={tag.label}
            closable
            variant={tag.variant}
            onClose={() => window.setTimeout(() => setItems((current) => current.filter((item) => item.label !== tag.label)), 180)}
          >
            {tag.label}
          </Tag>
        ))}
      </div>
    );
  },
};

export const MockMode: Story = {
  args: {
    children: undefined,
    mock: true,
  },
};
