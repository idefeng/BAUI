import type { Meta, StoryObj } from '@storybook/react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { CertificateTemplate } from './certificate';

const meta = {
  title: 'Biz/CertificateTemplate',
  component: CertificateTemplate,
  tags: ['autodocs'],
  args: {
    type: 'hours',
    mock: true,
  },
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof CertificateTemplate>;

export default meta;

type Story = StoryObj<typeof meta>;

export const MockCertificates: Story = {
  render: () => (
    <Tabs defaultValue="hours" className="w-full">
      <TabsList fullWidth className="mx-auto max-w-3xl">
        <TabsTrigger value="hours">学时证明</TabsTrigger>
        <TabsTrigger value="qualified">合格证明</TabsTrigger>
        <TabsTrigger value="education">学分证书</TabsTrigger>
      </TabsList>
      <TabsContent value="hours" className="border-0 bg-transparent p-0 shadow-none">
        <CertificateTemplate type="hours" mock />
      </TabsContent>
      <TabsContent value="qualified" className="border-0 bg-transparent p-0 shadow-none">
        <CertificateTemplate type="qualified" mock />
      </TabsContent>
      <TabsContent value="education" className="border-0 bg-transparent p-0 shadow-none">
        <CertificateTemplate type="education" mock />
      </TabsContent>
    </Tabs>
  ),
};

export const DarkModeTabs: Story = {
  render: () => (
    <div className="dark rounded-3xl bg-background-dark p-6">
      <Tabs defaultValue="hours" className="w-full">
        <TabsList fullWidth className="mx-auto max-w-3xl">
          <TabsTrigger value="hours">学时证明</TabsTrigger>
          <TabsTrigger value="qualified">合格证明</TabsTrigger>
          <TabsTrigger value="education">学分证书</TabsTrigger>
        </TabsList>
        <TabsContent value="hours" className="border-0 bg-transparent p-0 shadow-none">
          <CertificateTemplate type="hours" mock />
        </TabsContent>
        <TabsContent value="qualified" className="border-0 bg-transparent p-0 shadow-none">
          <CertificateTemplate type="qualified" mock />
        </TabsContent>
        <TabsContent value="education" className="border-0 bg-transparent p-0 shadow-none">
          <CertificateTemplate type="education" mock />
        </TabsContent>
      </Tabs>
    </div>
  ),
};
