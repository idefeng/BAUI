import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../button';
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from './modal';

const meta = {
  title: 'UI/Modal',
  component: ModalContent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ModalContent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button>打开弹窗</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>发布组件库版本</ModalTitle>
          <ModalDescription>确认后会生成当前组件库的预览版本，供设计和研发团队评审。</ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="outline">取消</Button>
          </ModalClose>
          <Button>确认发布</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);

    return (
      <Modal open={open} onOpenChange={setOpen}>
        <Button onClick={() => setOpen(true)}>打开受控弹窗</Button>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>受控弹窗</ModalTitle>
            <ModalDescription>open 状态由外部控制，适合表单提交和业务流程确认。</ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              稍后处理
            </Button>
            <Button onClick={() => setOpen(false)}>我知道了</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  },
};
