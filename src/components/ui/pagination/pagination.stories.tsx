import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Pagination } from './pagination';

const meta = {
  title: 'UI/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  args: {
    total: 95,
    pageSize: 10,
    currentPage: 1,
    onPageChange: () => undefined,
  },
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => {
    const [page, setPage] = React.useState(1);

    return <Pagination total={95} pageSize={10} currentPage={page} onPageChange={(nextPage) => setPage(nextPage)} />;
  },
};

export const ManyPages: Story = {
  render: () => {
    const [page, setPage] = React.useState(56);

    return <Pagination total={1280} pageSize={10} currentPage={page} onPageChange={(nextPage) => setPage(nextPage)} />;
  },
};

export const WithSizeChanger: Story = {
  render: () => {
    const [page, setPage] = React.useState(3);
    const [pageSize, setPageSize] = React.useState(10);

    return (
      <Pagination
        total={320}
        pageSize={pageSize}
        currentPage={page}
        showSizeChanger
        onPageChange={(nextPage, nextPageSize) => {
          setPage(nextPage);
          setPageSize(nextPageSize);
        }}
      />
    );
  },
};
