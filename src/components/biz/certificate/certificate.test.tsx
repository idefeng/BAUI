import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { CertificateTemplate, type CertificateData } from './certificate';

const baseData: CertificateData = {
  studentName: '赵一诺',
  idCardMasked: '110101********2036',
  projectName: '睡眠健康管理师项目',
  courseName: '睡眠健康管理师高级研修班',
  hours: 56,
  credits: 18,
  certificateNo: 'NX-CERT-CUSTOM-2026-0008',
  issuedAt: '2026-05-22',
  organization: '灵境实训',
};

describe('CertificateTemplate', () => {
  it('根据 qualified 类型展示培训合格证明标题和颁奖词', () => {
    render(<CertificateTemplate type="qualified" data={baseData} />);

    expect(screen.getByRole('article', { name: '培训合格证明' })).toHaveClass('shadow-xl');
    expect(screen.getByText('培训合格证明')).toBeInTheDocument();
    expect(screen.getByText(/成绩合格，特发此证/)).toBeInTheDocument();
    expect(screen.getByText('NX-CERT-CUSTOM-2026-0008')).toBeInTheDocument();
    expect(screen.getByText('灵境实训 / NEXUS')).toBeInTheDocument();
    expect(screen.getByText('公司公章')).toBeInTheDocument();
    expect(screen.getByText('防伪校验')).toBeInTheDocument();
  });

  it('根据 education 类型展示继续教育学分文案', () => {
    render(<CertificateTemplate type="education" data={baseData} showActions={false} />);

    const certificate = screen.getByRole('article', { name: '继续教育学分证书' });

    expect(screen.getByText('继续教育学分证书')).toBeInTheDocument();
    expect(certificate).toHaveTextContent(/授予继续教育\s*18\s*学分/);
    expect(screen.queryByRole('button', { name: '打印证书' })).not.toBeInTheDocument();
  });

  it('mock=true 且未传 data 时自动生成对应学时证明数据', () => {
    render(<CertificateTemplate type="hours" mock />);

    const certificate = screen.getByRole('article', { name: '学时证明' });

    expect(screen.getByText('学时证明')).toBeInTheDocument();
    expect(certificate).toHaveTextContent('林予安');
    expect(certificate).toHaveTextContent(/完成\s*48\s*学时/);
    expect(screen.getByText('NX-CERT-HOURS-2026-0001')).toBeInTheDocument();
  });

  it('点击打印证书按钮时调用 window.print', async () => {
    const user = userEvent.setup();
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => undefined);

    render(<CertificateTemplate type="hours" data={baseData} />);

    await user.click(screen.getByRole('button', { name: '打印证书' }));

    expect(printSpy).toHaveBeenCalledTimes(1);

    printSpy.mockRestore();
  });

  it('包含暗黑模式下的黑金/暗银质感样式', () => {
    render(<CertificateTemplate type="qualified" data={baseData} />);

    expect(screen.getByTestId('certificate-paper')).toHaveClass('dark:border-amber-200/40');
    expect(screen.getByTestId('certificate-paper')).toHaveClass('dark:bg-slate-950');
    expect(screen.getByTestId('certificate-inner-border')).toHaveClass('dark:border-amber-200/25');
  });
});
