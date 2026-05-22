import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalOverlay,
  ModalTitle,
} from './modal';

describe('Modal', () => {
  it('打开时渲染带 blur 的暗色遮罩和居中弹窗', () => {
    render(
      <Modal open>
        <ModalContent>
          <ModalTitle>确认操作</ModalTitle>
          <ModalDescription>这会保存当前配置。</ModalDescription>
        </ModalContent>
      </Modal>,
    );

    expect(screen.getByTestId('boao-modal-overlay')).toHaveClass('backdrop-blur-sm');
    expect(screen.getByRole('dialog', { name: '确认操作' })).toHaveClass('data-[state=open]:animate-modal-in');
  });

  it('ModalOverlay 暴露默认遮罩动画类名', () => {
    render(
      <Modal open>
        <ModalOverlay data-testid="custom-overlay" />
        <ModalContent>
          <ModalTitle>遮罩测试</ModalTitle>
        </ModalContent>
      </Modal>,
    );

    expect(screen.getByTestId('custom-overlay')).toHaveClass('data-[state=open]:animate-overlay-in');
    expect(screen.getByTestId('custom-overlay')).toHaveClass('data-[state=closed]:animate-overlay-out');
  });
});
