import * as React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  FileArchive,
  FileSpreadsheet,
  FileText,
  FileType2,
  Image as ImageIcon,
  UploadCloud,
  X,
} from 'lucide-react';

import { cn } from '../../../lib/utils';
import { BrandLogo } from '../branding';
import { Button } from '../button';
import { clampNumber } from '../shared/logic';
import { uiStatusStyles, uiStyles, type UiProgressStatus } from '../shared/styles';

export type UploadStatus = 'uploading' | 'success' | 'error';

export interface UploadProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** 限制文件类型，支持 MIME、image/* 和 .pdf/.docx 等扩展名。 */
  accept?: string;
  /** 限制文件大小，单位 MB。 */
  maxSize?: number;
  /** 是否允许一次上传多个文件。 */
  multiple?: boolean;
  /** 自定义上传逻辑，返回最终 CDN 链接。 */
  customUpload?: (file: File, onProgress: (p: number) => void) => Promise<string>;
  /** 是否启用内置高保真异步上传模拟。 */
  mock?: boolean;
  /** 任一文件上传成功后回传当前全部成功 URL。 */
  onChange?: (urls: string[]) => void;
}

interface UploadItem {
  id: string;
  file: File;
  name: string;
  progress: number;
  status: UploadStatus;
  url?: string;
  error?: string;
  previewUrl?: string;
}

const mockCdnPrefix = 'https://cdn.etlchina.internal/materials/';
const imageTypePrefix = 'image/';
const spreadsheetExtensions = ['.xls', '.xlsx', '.csv'];
const documentExtensions = ['.doc', '.docx'];
const archiveExtensions = ['.zip', '.rar', '.7z'];
const uploadProgressStatusMap = {
  uploading: 'normal',
  success: 'success',
  error: 'exception',
} satisfies Record<UploadStatus, UiProgressStatus>;

const toMegabytes = (bytes: number) => bytes / 1024 / 1024;

const normalizeFileName = (fileName: string) =>
  fileName
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();

const buildMockUrl = (file: File) => `${mockCdnPrefix}${normalizeFileName(file.name) || 'mock-file'}`;

const getFileExtension = (fileName: string) => {
  const normalizedName = fileName.toLowerCase();
  const dotIndex = normalizedName.lastIndexOf('.');

  return dotIndex >= 0 ? normalizedName.slice(dotIndex) : '';
};

const matchesAcceptToken = (file: File, token: string) => {
  const normalizedToken = token.trim().toLowerCase();

  if (!normalizedToken) {
    return true;
  }

  if (normalizedToken.startsWith('.')) {
    return file.name.toLowerCase().endsWith(normalizedToken);
  }

  if (normalizedToken.endsWith('/*')) {
    return file.type.toLowerCase().startsWith(normalizedToken.slice(0, -1));
  }

  return file.type.toLowerCase() === normalizedToken;
};

const isAcceptedFile = (file: File, accept?: string) => {
  if (!accept) {
    return true;
  }

  return accept.split(',').some((token) => matchesAcceptToken(file, token));
};

const createPreviewUrl = (file: File) => {
  if (!file.type.startsWith(imageTypePrefix) || typeof URL.createObjectURL !== 'function') {
    return undefined;
  }

  return URL.createObjectURL(file);
};

const clampProgress = (progress: number) => clampNumber(Math.round(progress), 0, 100);

const getFileIcon = (item: UploadItem) => {
  const extension = getFileExtension(item.name);

  if (item.file.type.startsWith(imageTypePrefix)) {
    return <ImageIcon className="size-5" aria-hidden="true" />;
  }

  if (extension === '.pdf') {
    return <FileType2 className="size-5" aria-hidden="true" />;
  }

  if (spreadsheetExtensions.includes(extension)) {
    return <FileSpreadsheet className="size-5" aria-hidden="true" />;
  }

  if (documentExtensions.includes(extension)) {
    return <FileText className="size-5" aria-hidden="true" />;
  }

  if (archiveExtensions.includes(extension)) {
    return <FileArchive className="size-5" aria-hidden="true" />;
  }

  return <FileText className="size-5" aria-hidden="true" />;
};

const formatFileSize = (file: File) => {
  const sizeInMb = toMegabytes(file.size);

  if (sizeInMb >= 1) {
    return `${sizeInMb.toFixed(1)}MB`;
  }

  return `${Math.max(1, Math.round(file.size / 1024))}KB`;
};

const getErrorMessage = (file: File, accept?: string, maxSize?: number) => {
  if (!isAcceptedFile(file, accept)) {
    return '文件类型不符合要求';
  }

  if (maxSize && toMegabytes(file.size) > maxSize) {
    return `文件大小超过 ${maxSize}MB`;
  }

  return undefined;
};

/** Upload 通用上传组件，支持拖拽、mock 上传、自定义上传和进度展示。 */
export const Upload = React.forwardRef<HTMLDivElement, UploadProps>(
  (
    {
      accept,
      className,
      customUpload,
      maxSize,
      mock = false,
      multiple = false,
      onChange,
      ...props
    },
    ref,
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const itemsRef = React.useRef<UploadItem[]>([]);
    const intervalsRef = React.useRef<Set<number>>(new Set());
    const [items, setItems] = React.useState<UploadItem[]>([]);
    const [isDragging, setIsDragging] = React.useState(false);

    React.useEffect(() => {
      itemsRef.current = items;
    }, [items]);

    React.useEffect(
      () => () => {
        intervalsRef.current.forEach((timer) => window.clearInterval(timer));
        intervalsRef.current.clear();
        itemsRef.current.forEach((item) => {
          if (item.previewUrl) {
            URL.revokeObjectURL(item.previewUrl);
          }
        });
      },
      [],
    );

    const updateItem = React.useCallback((id: string, patch: Partial<UploadItem>) => {
      setItems((currentItems) =>
        currentItems.map((item) => (item.id === id ? { ...item, ...patch } : item)),
      );
    }, []);

    const completeItem = React.useCallback(
      (id: string, url: string) => {
        setItems((currentItems) => {
          const nextItems = currentItems.map((item) =>
            item.id === id ? { ...item, progress: 100, status: 'success' as const, url } : item,
          );
          const urls = nextItems.flatMap((item) => (item.status === 'success' && item.url ? [item.url] : []));

          onChange?.(urls);

          return nextItems;
        });
      },
      [onChange],
    );

    const failItem = React.useCallback((id: string, error: string) => {
      updateItem(id, { error, status: 'error' });
    }, [updateItem]);

    const runMockUpload = React.useCallback(
      (item: UploadItem) => {
        const timer = window.setInterval(() => {
          setItems((currentItems) => {
            const currentItem = currentItems.find((candidate) => candidate.id === item.id);

            if (!currentItem || currentItem.status !== 'uploading') {
              window.clearInterval(timer);
              intervalsRef.current.delete(timer);
              return currentItems;
            }

            // 使用 5% 到 10% 的随机步进，模拟真实网络波动下的上传速度。
            const nextProgress = clampNumber(currentItem.progress + 5 + Math.floor(Math.random() * 6), 0, 100);

            if (nextProgress >= 100) {
              window.clearInterval(timer);
              intervalsRef.current.delete(timer);
              const nextItems = currentItems.map((candidate) =>
                candidate.id === item.id
                  ? { ...candidate, progress: 100, status: 'success' as const, url: buildMockUrl(candidate.file) }
                  : candidate,
              );
              const urls = nextItems.flatMap((candidate) =>
                candidate.status === 'success' && candidate.url ? [candidate.url] : [],
              );

              onChange?.(urls);

              return nextItems;
            }

            return currentItems.map((candidate) =>
              candidate.id === item.id ? { ...candidate, progress: nextProgress } : candidate,
            );
          });
        }, 100);

        intervalsRef.current.add(timer);
      },
      [onChange],
    );

    const runUpload = React.useCallback(
      async (item: UploadItem) => {
        if (mock || !customUpload) {
          runMockUpload(item);
          return;
        }

        try {
          const url = await customUpload(item.file, (progress) => updateItem(item.id, { progress: clampProgress(progress) }));

          completeItem(item.id, url);
        } catch (error) {
          failItem(item.id, error instanceof Error ? error.message : '上传失败，请稍后重试');
        }
      },
      [completeItem, customUpload, failItem, mock, runMockUpload, updateItem],
    );

    const appendFiles = React.useCallback(
      (fileList: FileList | File[]) => {
        const files = Array.from(fileList);
        const nextFiles = multiple ? files : files.slice(0, 1);
        const nextItems = nextFiles.map<UploadItem>((file) => {
          const error = getErrorMessage(file, accept, maxSize);

          return {
            id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
            error,
            file,
            name: file.name,
            previewUrl: createPreviewUrl(file),
            progress: error ? 0 : 0,
            status: error ? 'error' : 'uploading',
          };
        });

        setItems((currentItems) => {
          if (!multiple) {
            currentItems.forEach((item) => {
              if (item.previewUrl) {
                URL.revokeObjectURL(item.previewUrl);
              }
            });
          }

          return multiple ? [...currentItems, ...nextItems] : nextItems;
        });
        nextItems.filter((item) => item.status === 'uploading').forEach((item) => {
          void runUpload(item);
        });
      },
      [accept, maxSize, multiple, runUpload],
    );

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.currentTarget.files) {
        appendFiles(event.currentTarget.files);
        // 清空 input value，允许连续选择同名文件时仍触发 change。
        event.currentTarget.value = '';
      }
    };

    const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      setIsDragging(false);

      if (event.dataTransfer.files.length > 0) {
        appendFiles(event.dataTransfer.files);
      }
    };

    const handleRemove = (id: string) => {
      setItems((currentItems) => {
        const removedItem = currentItems.find((item) => item.id === id);

        if (removedItem?.previewUrl) {
          URL.revokeObjectURL(removedItem.previewUrl);
        }

        return currentItems.filter((item) => item.id !== id);
      });
    };

    return (
      <div
        ref={ref}
        data-testid="upload-root"
        className={cn('grid gap-4', uiStyles.textForeground, className)}
        {...props}
      >
        <label
          data-testid="upload-dropzone"
          onDragEnter={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={(event) => {
            event.preventDefault();
            setIsDragging(false);
          }}
          onDrop={handleDrop}
          className={cn(
            'group relative flex min-h-56 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-border bg-surface p-8 text-center shadow-button transition-all duration-300 dark:border-border-dark dark:bg-surface-dark',
            uiStyles.focusBreathingRing,
            'hover:border-primary hover:bg-primary/5 dark:hover:border-primary-dark dark:hover:bg-primary-dark-soft/35',
            isDragging && 'scale-[1.01] border-primary bg-primary/5 dark:border-primary-dark dark:bg-primary-dark-soft/45',
          )}
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              inputRef.current?.click();
            }
          }}
        >
          <input
            ref={inputRef}
            aria-label="选择上传文件"
            type="file"
            accept={accept}
            multiple={multiple}
            className="sr-only"
            onChange={handleInputChange}
          />
          <div
            data-testid="upload-brand-watermark"
            className={cn(
              'pointer-events-none absolute inset-0 flex items-center justify-center text-primary transition-all duration-500 dark:text-primary-dark',
              isDragging ? 'animate-brand-pulse opacity-20' : 'opacity-10',
            )}
            aria-hidden="true"
          >
            <BrandLogo variant="icon" size="lg" className="size-36" />
          </div>
          <div className="relative z-10 flex flex-col items-center">
            <span className="flex size-16 items-center justify-center rounded-3xl bg-primary-soft text-primary transition-transform duration-300 group-hover:scale-105 dark:bg-primary-dark-soft dark:text-primary-dark">
              <UploadCloud className="size-8" aria-hidden="true" />
            </span>
            <span className={cn('mt-5 text-lg font-semibold', uiStyles.textForeground)}>拖拽文件到这里，或点击上传</span>
            <span className={cn('mt-2 max-w-lg text-sm leading-6', uiStyles.textMuted)}>
              {multiple ? '支持多文件批量上传' : '支持单文件上传'}
              {accept ? ` · 类型限制：${accept}` : ''}
              {maxSize ? ` · 单文件不超过 ${maxSize}MB` : ''}
            </span>
          </div>
        </label>

        {items.length > 0 ? (
          <ul className="grid gap-3" aria-label="上传文件列表">
            {items.map((item) => (
              <li
                key={item.id}
                className={cn('grid gap-3 rounded-3xl p-4', uiStyles.surfaceCard)}
              >
                <div className="grid grid-cols-[3rem_1fr_auto] items-center gap-3">
                  <div className={uiStyles.mutedIconTile}>
                    {item.previewUrl ? (
                      <img src={item.previewUrl} alt={`${item.name} 缩略图`} className="size-full object-cover" />
                    ) : (
                      getFileIcon(item)
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className={cn('truncate text-sm font-semibold', uiStyles.textForeground)}>{item.name}</p>
                    <p className={cn('mt-1 text-xs', uiStyles.textMuted)}>
                      {formatFileSize(item.file)}
                      {item.status === 'success' ? ' · 上传完成' : item.status === 'error' ? ` · ${item.error}` : ' · 上传中'}
                    </p>
                  </div>
                  <Button
                    aria-label={`移除 ${item.name}`}
                    size="sm"
                    variant="ghost"
                    className="size-9 px-0"
                    onClick={() => handleRemove(item.id)}
                  >
                    <X className="size-4" aria-hidden="true" />
                  </Button>
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center justify-between gap-3 text-xs font-medium">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1.5',
                        item.status === 'success' && 'text-success dark:text-success-dark',
                        item.status === 'error' && 'text-danger dark:text-danger-dark',
                        item.status === 'uploading' && 'text-primary dark:text-primary-dark',
                      )}
                    >
                      {item.status === 'success' ? (
                        <CheckCircle2 className="size-4" aria-hidden="true" />
                      ) : item.status === 'error' ? (
                        <AlertCircle className="size-4" aria-hidden="true" />
                      ) : (
                        <UploadCloud className="size-4" aria-hidden="true" />
                      )}
                      {item.status === 'success' ? '上传完成' : item.status === 'error' ? '上传失败' : '正在上传'}
                    </span>
                    <span>{item.status === 'error' ? item.error : `${item.progress}%`}</span>
                  </div>
                  <div
                    role="progressbar"
                    aria-label={`${item.name} 上传进度`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={item.progress}
                    className="h-2.5 overflow-hidden rounded-full bg-muted dark:bg-muted-dark"
                  >
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-300',
                        uiStatusStyles.progress[uploadProgressStatusMap[item.status]],
                      )}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    );
  },
);

Upload.displayName = 'Upload';
