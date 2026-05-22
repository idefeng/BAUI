import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';

import { Slider, type SliderValue } from './slider';

const SliderDemo = ({
  defaultValue,
  ...props
}: Omit<React.ComponentProps<typeof Slider>, 'onChange' | 'value'> & { defaultValue: SliderValue }) => {
  const [value, setValue] = React.useState<SliderValue>(defaultValue);

  return (
    <div className="w-[min(92vw,34rem)] rounded-2xl border border-border bg-surface p-6 shadow-button dark:border-border-dark dark:bg-surface-dark">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground dark:text-foreground-dark">预算区间</h3>
          <p className="mt-1 text-sm text-muted-foreground dark:text-muted-dark-foreground">
            {Array.isArray(value) ? `${value[0]} - ${value[1]}` : value}
          </p>
        </div>
      </div>
      <Slider {...props} value={value} onChange={setValue} />
    </div>
  );
};

const meta = {
  title: 'UI/Slider',
  component: Slider,
  tags: ['autodocs'],
  args: {
    value: 50,
    onChange: () => undefined,
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Slider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => <SliderDemo aria-label="项目进度" defaultValue={45} min={0} max={100} step={5} />,
};

export const Range: Story = {
  render: () => <SliderDemo aria-label="薪资范围" defaultValue={[10000, 18000]} min={8000} max={30000} step={1000} />,
};

export const Disabled: Story = {
  render: () => <SliderDemo aria-label="锁定比例" defaultValue={72} disabled />,
};
