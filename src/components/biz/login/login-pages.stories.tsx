import type { Meta, StoryObj } from '@storybook/react';

import { StandardLoginPages } from './standard-login-pages';

const pageTypes = ['tech', 'education', 'minimal', 'split-screen', 'classic', 'otp'] as const;

const meta = {
  title: 'Biz/StandardLoginPages',
  component: StandardLoginPages,
  tags: ['autodocs'],
  args: {
    type: 'tech',
    mock: true,
    onSubmit: (values) => {
      console.info('StandardLoginPages submit', values);
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: pageTypes,
    },
    mock: {
      control: 'boolean',
    },
    onSubmit: {
      control: false,
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof StandardLoginPages>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Controls: Story = {};

export const DarkModeControls: Story = {
  args: {
    type: 'split-screen',
  },
  render: (args) => (
    <div className="dark">
      <StandardLoginPages {...args} />
    </div>
  ),
};

export const TemplateGallery: Story = {
  render: (args) => (
    <div className="grid gap-10 bg-secondary p-6 dark:bg-background-dark">
      {pageTypes.map((type) => (
        <section key={type} className="overflow-hidden rounded-3xl border border-border shadow-button dark:border-border-dark">
          <StandardLoginPages {...args} type={type} />
        </section>
      ))}
    </div>
  ),
};
