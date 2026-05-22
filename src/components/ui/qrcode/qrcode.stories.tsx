import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../button';
import { QRCode } from './qrcode';

const meta = {
  title: 'UI/QRCode',
  component: QRCode,
  tags: ['autodocs'],
  args: {
    value: 'https://boao.example.com/sign/check-in-2026',
    size: 176,
    status: 'active',
  },
  argTypes: {
    status: {
      control: 'inline-radio',
      options: ['active', 'expired', 'loading'],
    },
    size: {
      control: 'number',
    },
  },
} satisfies Meta<typeof QRCode>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const WithLogo: Story = {
  args: {
    icon: <span>BO</span>,
    value: 'https://boao.example.com/certificate/verify/BA-2026-0001',
  },
};

export const Expired: Story = {
  render: () => {
    const [status, setStatus] = React.useState<'active' | 'expired'>('expired');

    return (
      <div className="space-y-4">
        <QRCode
          value="https://boao.example.com/sign/expired"
          icon={<span>BO</span>}
          status={status}
          onRefresh={() => setStatus('active')}
        />
        <Button size="sm" variant="outline" onClick={() => setStatus('expired')}>
          模拟过期
        </Button>
      </div>
    );
  },
};

export const Loading: Story = {
  args: {
    status: 'loading',
  },
};
