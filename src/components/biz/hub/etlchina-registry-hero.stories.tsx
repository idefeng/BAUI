import type { Meta, StoryObj } from '@storybook/react';

import { EtlChinaRegistryHero } from './etlchina-registry-hero';

const meta = {
  title: 'Welcome/EtlChinaRegistryHero',
  component: EtlChinaRegistryHero,
  tags: ['autodocs'],
  args: {
    defaultActivated: false,
    defaultRegionValue: ['440000', '440100', '440106'],
    defaultTrainningTitle: 'AI-AGENT-ENGINEER',
    defaultUserRole: '学员',
  },
  argTypes: {
    defaultActivated: {
      control: 'boolean',
    },
    defaultTrainningTitle: {
      control: 'select',
      options: ['AI-AGENT-ENGINEER', 'FULLSTACK-DEVELOPER'],
    },
    defaultUserRole: {
      control: 'radio',
      options: ['学员', '讲师'],
    },
    defaultRegionValue: {
      control: 'object',
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof EtlChinaRegistryHero>;

export default meta;

type Story = StoryObj<typeof meta>;

export const OfficialWelcome: Story = {};

export const ActivatedLearnerConsole: Story = {
  args: {
    defaultActivated: true,
  },
};

export const TeacherConsole: Story = {
  args: {
    defaultActivated: true,
    defaultRegionValue: ['110000', '110100', '110108'],
    defaultTrainningTitle: 'FULLSTACK-DEVELOPER',
    defaultUserRole: '讲师',
  },
};

export const DarkActivatedConsole: Story = {
  args: {
    defaultActivated: true,
  },
  render: (args) => (
    <div className="dark">
      <EtlChinaRegistryHero {...args} />
    </div>
  ),
};
