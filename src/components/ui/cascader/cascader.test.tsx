import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Cascader, type CascaderOption } from './cascader';

const orgOptions: CascaderOption[] = [
  {
    value: 'tech',
    label: '技术中心',
    children: [
      {
        value: 'rd',
        label: '核心研发部',
        children: [
          { value: 'frontend', label: '前端组' },
          { value: 'backend', label: '后端组' },
        ],
      },
    ],
  },
  {
    value: 'ops',
    label: '运营中心',
    children: [{ value: 'content', label: '内容运营组' }],
  },
];

const ControlledCascader = ({
  defaultValue = [],
  baRegionLevel,
  type = 'default',
  onChange,
  mock = false,
}: {
  defaultValue?: string[];
  baRegionLevel?: 'PROVINCE' | 'CITY' | 'DISTRICT';
  type?: 'default' | 'region';
  onChange?: (value: string[], selectedOptions: CascaderOption[]) => void;
  mock?: boolean;
}) => {
  const [value, setValue] = React.useState(defaultValue);

  return (
    <Cascader
      mock={mock}
      options={mock ? undefined : orgOptions}
      type={type}
      ba_region_level={baRegionLevel}
      value={value}
      placeholder="请选择组织"
      onChange={(nextValue, selectedOptions) => {
        setValue(nextValue);
        onChange?.(nextValue, selectedOptions);
      }}
    />
  );
};

describe('Cascader', () => {
  it('优雅回显完整路径并支持一键清除', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<ControlledCascader defaultValue={['tech', 'rd', 'frontend']} onChange={onChange} />);

    expect(screen.getByRole('combobox', { name: '技术中心 / 核心研发部 / 前端组' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '清除选择' }));

    expect(onChange).toHaveBeenCalledWith([], []);
    expect(screen.getByRole('combobox', { name: '请选择组织' })).toBeInTheDocument();
  });

  it('已有选中值重新打开时保留完整展开路径', async () => {
    const user = userEvent.setup();

    render(<ControlledCascader defaultValue={['tech', 'rd', 'frontend']} />);

    await user.click(screen.getByRole('combobox', { name: '技术中心 / 核心研发部 / 前端组' }));

    expect(screen.getByRole('menuitem', { name: /技术中心/ })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /核心研发部/ })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: '前端组' })).toBeInTheDocument();
  });

  it('展开多级菜单，并且只有点击叶子节点才触发最终 onChange', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<ControlledCascader onChange={onChange} />);

    await user.click(screen.getByRole('combobox', { name: '请选择组织' }));
    await user.click(screen.getByRole('menuitem', { name: /技术中心/ }));

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('menuitem', { name: /核心研发部/ })).toBeInTheDocument();

    await user.click(screen.getByRole('menuitem', { name: /核心研发部/ }));
    await user.click(screen.getByRole('menuitem', { name: '前端组' }));

    expect(onChange).toHaveBeenCalledWith(
      ['tech', 'rd', 'frontend'],
      [
        expect.objectContaining({ value: 'tech', label: '技术中心' }),
        expect.objectContaining({ value: 'rd', label: '核心研发部' }),
        expect.objectContaining({ value: 'frontend', label: '前端组' }),
      ],
    );
    expect(screen.getByRole('combobox', { name: '技术中心 / 核心研发部 / 前端组' })).toBeInTheDocument();
  });

  it('mock 模式在没有传入 options 时自动加载组织架构树', async () => {
    const user = userEvent.setup();

    render(<ControlledCascader mock />);

    await user.click(screen.getByRole('combobox', { name: '请选择组织' }));
    await user.click(screen.getByRole('menuitem', { name: /灵境实训总公司/ }));

    expect(screen.getByRole('menuitem', { name: /技术中心/ })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /学习产品中心/ })).toBeInTheDocument();
  });

  it('region 模式自动加载全国行政区划，并支持选择到区县级', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<ControlledCascader type="region" defaultValue={[]} onChange={onChange} />);

    await user.click(screen.getByRole('combobox', { name: '请选择组织' }));
    await user.click(screen.getByRole('menuitem', { name: /广东省/ }));
    await user.click(screen.getByRole('menuitem', { name: /广州市/ }));
    await user.click(screen.getByRole('menuitem', { name: '天河区' }));

    expect(onChange).toHaveBeenCalledWith(
      ['440000', '440100', '440106'],
      [
        expect.objectContaining({ value: '440000', label: '广东省' }),
        expect.objectContaining({ value: '440100', label: '广州市' }),
        expect.objectContaining({ value: '440106', label: '天河区' }),
      ],
    );
    expect(screen.getByRole('combobox', { name: '广东省 / 广州市 / 天河区' })).toBeInTheDocument();
  });

  it('region 模式设置 ba_region_level=CITY 时只能选择到市级', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<ControlledCascader type="region" baRegionLevel="CITY" defaultValue={[]} onChange={onChange} />);

    await user.click(screen.getByRole('combobox', { name: '请选择组织' }));
    await user.click(screen.getByRole('menuitem', { name: /广东省/ }));
    await user.click(screen.getByRole('menuitem', { name: '广州市' }));

    expect(onChange).toHaveBeenCalledWith(
      ['440000', '440100'],
      [
        expect.objectContaining({ value: '440000', label: '广东省' }),
        expect.objectContaining({ value: '440100', label: '广州市' }),
      ],
    );
    expect(screen.queryByRole('menuitem', { name: '天河区' })).not.toBeInTheDocument();
  });
});
