import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';

import { mockTransferData, mockTransferTargetKeys } from '../../../utils/mock';
import { Transfer, type TransferItem } from './transfer';

const baseDataSource: TransferItem[] = mockTransferData();

const TransferDemo = ({
  dataSource = baseDataSource,
  defaultTargetKeys = ['transfer-user-002', 'transfer-user-005'],
  mock = false,
  titles = ['未分配学员', '已分配学员'],
}: {
  dataSource?: TransferItem[];
  defaultTargetKeys?: string[];
  mock?: boolean;
  titles?: [string, string];
}) => {
  const [targetKeys, setTargetKeys] = React.useState(defaultTargetKeys);

  return (
    <div className="w-[min(94vw,72rem)]">
      <Transfer
        dataSource={mock ? undefined : dataSource}
        targetKeys={targetKeys}
        titles={titles}
        mock={mock}
        onChange={setTargetKeys}
      />
    </div>
  );
};

const meta = {
  title: 'Biz/Transfer',
  component: Transfer,
  tags: ['autodocs'],
  args: {
    dataSource: baseDataSource,
    targetKeys: ['transfer-user-002', 'transfer-user-005'],
    titles: ['未分配学员', '已分配学员'],
    onChange: () => undefined,
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Transfer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  render: () => <TransferDemo />,
};

export const MockModeDemo: Story = {
  render: () => (
    <TransferDemo
      mock
      defaultTargetKeys={mockTransferTargetKeys(baseDataSource, 4, 3)}
      titles={['候选权限', '已授权限']}
    />
  ),
};

export const DarkMode: Story = {
  render: () => (
    <div className="dark rounded-2xl bg-slate-950 p-6">
      <TransferDemo
        mock
        defaultTargetKeys={mockTransferTargetKeys(baseDataSource, 6, 3)}
        titles={['未分配学员', '已分配学员']}
      />
    </div>
  ),
};
