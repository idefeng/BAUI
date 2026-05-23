import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  BoaoCertificateIcon,
  BoaoCourseIcon,
  BoaoDashboardIcon,
  BoaoLearnerIcon,
  BoaoNotificationIcon,
  BoaoPermissionIcon,
  BoaoReviewIcon,
  BoaoUploadIcon,
  boaoIconSet,
} from './icons';

const iconComponents = [
  BoaoCourseIcon,
  BoaoLearnerIcon,
  BoaoCertificateIcon,
  BoaoDashboardIcon,
  BoaoUploadIcon,
  BoaoReviewIcon,
  BoaoPermissionIcon,
  BoaoNotificationIcon,
];

describe('BOAO Icons', () => {
  it('导出 8 个企业培训业务图标并保持统一 SVG 契约', () => {
    expect(boaoIconSet).toHaveLength(8);

    render(
      <div>
        {iconComponents.map((Icon, index) => (
          <Icon key={index} title={`图标 ${index + 1}`} data-testid={`boao-icon-${index}`} />
        ))}
      </div>,
    );

    iconComponents.forEach((_, index) => {
      const icon = screen.getByTestId(`boao-icon-${index}`);

      expect(icon.tagName.toLowerCase()).toBe('svg');
      expect(icon).toHaveAttribute('viewBox', '0 0 64 64');
      expect(icon).toHaveClass('text-primary');
      expect(icon).toHaveClass('dark:text-primary-dark');
      expect(icon).toHaveAttribute('role', 'img');
      expect(screen.getByText(`图标 ${index + 1}`)).toBeInTheDocument();
    });
  });

  it('支持 size、strokeWidth、className 和 accentClassName 覆盖', () => {
    render(
      <BoaoUploadIcon
        title="上传材料"
        size={40}
        strokeWidth={2.5}
        className="text-danger"
        accentClassName="text-success"
        data-testid="custom-upload-icon"
      />,
    );

    const icon = screen.getByTestId('custom-upload-icon');

    expect(icon).toHaveAttribute('width', '40');
    expect(icon).toHaveAttribute('height', '40');
    expect(icon).toHaveClass('text-danger');
    expect(icon.querySelector('[data-slot="accent"]')).toHaveClass('text-success');
    expect(icon.querySelector('[data-slot="main"] path')).toHaveAttribute('stroke-width', '2.5');
  });

  it('无 title 时默认作为装饰图标隐藏给读屏器', () => {
    render(<BoaoDashboardIcon data-testid="decorative-dashboard-icon" />);

    const icon = screen.getByTestId('decorative-dashboard-icon');

    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon).not.toHaveAttribute('role');
  });
});
