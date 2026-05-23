import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Upload } from './upload';

const createFile = (name: string, type: string, size = 12) =>
  new File([new Uint8Array(size)], name, { type });

const selectFiles = (files: File[]) => {
  fireEvent.change(screen.getByLabelText('选择上传文件'), {
    target: { files },
  });
};

describe('Upload', () => {
  it('mock 模式选择文件后展示进度并回调高保真 CDN 地址', async () => {
    vi.useFakeTimers();
    const onChange = vi.fn();

    try {
      render(<Upload accept=".pdf" mock onChange={onChange} />);

      selectFiles([createFile('mock-file.pdf', 'application/pdf')]);

      expect(screen.getByText('mock-file.pdf')).toBeInTheDocument();
      expect(screen.getByRole('progressbar', { name: 'mock-file.pdf 上传进度' })).toHaveAttribute('aria-valuenow', '0');

      await act(async () => {
        vi.advanceTimersByTime(2500);
      });

      expect(screen.getByText('上传完成')).toBeInTheDocument();
      expect(screen.getByText('100%')).toBeInTheDocument();
      expect(onChange).toHaveBeenLastCalledWith(['https://cdn.nexus.internal/materials/mock-file.pdf']);
    } finally {
      vi.useRealTimers();
    }
  });

  it('拖拽进入时切换为品牌科技蓝激活态', () => {
    render(<Upload />);

    const dropzone = screen.getByTestId('upload-dropzone');
    const watermark = screen.getByTestId('upload-brand-watermark');

    expect(watermark).toHaveClass('opacity-10');

    fireEvent.dragEnter(dropzone);

    expect(dropzone.className).toContain('border-primary');
    expect(dropzone.className).toContain('bg-primary/5');
    expect(dropzone.className).toContain('scale-[1.01]');
    expect(watermark).toHaveClass('animate-brand-pulse');

    fireEvent.dragLeave(dropzone);

    expect(dropzone.className).not.toContain('scale-[1.01]');
    expect(watermark).not.toHaveClass('animate-brand-pulse');
  });

  it('根据 accept 和 maxSize 拦截不合规文件', async () => {
    const onChange = vi.fn();

    render(<Upload accept=".pdf" maxSize={1} onChange={onChange} />);

    selectFiles([createFile('course.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')]);

    expect(screen.getByText('文件类型不符合要求')).toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();

    selectFiles([createFile('large.pdf', 'application/pdf', 2 * 1024 * 1024)]);

    expect(screen.getByText('文件大小超过 1MB')).toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('支持 customUpload 透传进度并使用返回链接', async () => {
    const onChange = vi.fn();
    const customUpload = vi.fn(async (_file: File, onProgress: (p: number) => void) => {
      onProgress(35);
      onProgress(100);

      return 'https://cdn.example.com/custom/report.docx';
    });

    render(<Upload customUpload={customUpload} onChange={onChange} />);

    selectFiles([createFile('report.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')]);

    await waitFor(() => expect(onChange).toHaveBeenCalledWith(['https://cdn.example.com/custom/report.docx']));
    expect(customUpload).toHaveBeenCalledTimes(1);
    expect(screen.getByText('上传完成')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
  });
});
