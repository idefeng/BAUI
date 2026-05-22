import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';

import { DateTimePicker, type DateTimePickerType, type DateTimePickerValue } from './date-time-picker';

const StatefulDateTimePicker = ({
  defaultValue,
  mock = false,
  placeholder,
  type,
}: {
  defaultValue?: DateTimePickerValue;
  mock?: boolean;
  placeholder?: string;
  type: DateTimePickerType;
}) => {
  const [value, setValue] = React.useState<DateTimePickerValue | undefined>(defaultValue);

  return (
    <DateTimePicker
      type={type}
      value={value}
      mock={mock}
      placeholder={placeholder}
      onChange={setValue}
    />
  );
};

const meta = {
  title: 'UI/DateTimePicker',
  component: DateTimePicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof DateTimePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DateOnly: Story = {
  args: {
    type: 'date',
  },
  render: () => (
    <div className="w-80">
      <StatefulDateTimePicker
        type="date"
        defaultValue={new Date(2026, 4, 22)}
        placeholder="请选择开课日期"
      />
    </div>
  ),
};

export const TimeOnly: Story = {
  args: {
    type: 'time',
  },
  render: () => (
    <div className="w-80">
      <StatefulDateTimePicker type="time" defaultValue="14:30:00" placeholder="请选择上课时间" />
    </div>
  ),
};

export const DateTimeCombined: Story = {
  args: {
    type: 'datetime',
  },
  render: () => (
    <div className="w-80">
      <StatefulDateTimePicker
        type="datetime"
        defaultValue={new Date(2026, 4, 22, 14, 30, 0)}
        placeholder="请选择排课时间"
      />
    </div>
  ),
};

export const MockModeDemo: Story = {
  args: {
    type: 'datetime',
    mock: true,
  },
  render: () => (
    <div className="w-80">
      <StatefulDateTimePicker type="datetime" mock placeholder="请选择排课时间" />
    </div>
  ),
};
