import type { Meta, StoryObj } from '@storybook/react';

import { RadioGroup, RadioGroupItem } from './radio-group';

const meta = {
  title: 'UI/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

const options = [
  { label: '每日', value: 'daily' },
  { label: '每周', value: 'weekly' },
  { label: '每月', value: 'monthly' },
];

export const Basic: Story = {
  render: () => (
    <RadioGroup defaultValue="weekly" aria-label="提醒频率">
      {options.map((option) => (
        <div key={option.value} className="flex items-center gap-3">
          <RadioGroupItem id={`radio-${option.value}`} aria-label={option.label} value={option.value} />
          <label htmlFor={`radio-${option.value}`} className="text-sm font-medium text-foreground dark:text-foreground-dark">
            {option.label}
          </label>
        </div>
      ))}
    </RadioGroup>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <RadioGroup defaultValue="daily" aria-label="横向提醒频率" className="flex items-center gap-5">
      {options.map((option) => (
        <div key={option.value} className="flex items-center gap-2">
          <RadioGroupItem id={`radio-horizontal-${option.value}`} aria-label={option.label} value={option.value} />
          <label htmlFor={`radio-horizontal-${option.value}`} className="text-sm font-medium text-foreground dark:text-foreground-dark">
            {option.label}
          </label>
        </div>
      ))}
    </RadioGroup>
  ),
};

export const DisabledItem: Story = {
  render: () => (
    <RadioGroup defaultValue="basic" aria-label="套餐版本">
      <div className="flex items-center gap-3">
        <RadioGroupItem id="radio-basic" aria-label="基础版" value="basic" />
        <label htmlFor="radio-basic" className="text-sm font-medium text-foreground dark:text-foreground-dark">
          基础版
        </label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem id="radio-enterprise" aria-label="企业版暂不可选" value="enterprise" disabled />
        <label htmlFor="radio-enterprise" className="text-sm font-medium text-disabled-foreground dark:text-disabled-dark-foreground">
          企业版暂不可选
        </label>
      </div>
    </RadioGroup>
  ),
};

export const DarkContrast: Story = {
  render: () => (
    <div className="dark rounded-2xl bg-background-dark p-6 text-foreground-dark">
      <RadioGroup defaultValue="weekly" aria-label="暗黑模式频率">
        {options.map((option) => (
          <div key={option.value} className="flex items-center gap-3">
            <RadioGroupItem id={`radio-dark-${option.value}`} aria-label={option.label} value={option.value} />
            <label htmlFor={`radio-dark-${option.value}`} className="text-sm font-medium">
              {option.label}
            </label>
          </div>
        ))}
      </RadioGroup>
    </div>
  ),
};
