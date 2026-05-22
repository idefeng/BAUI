import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Form, type FormSchemaField } from './form';

const learnerProfileSchema: FormSchemaField[] = [
  {
    name: 'studentName',
    label: '学员姓名',
    type: 'input',
    placeholder: '请输入学员姓名',
    mock: 'name',
  },
  {
    name: 'intranetEnabled',
    label: '是否开通内网权限',
    type: 'switch',
  },
  {
    name: 'techDirections',
    label: '选修技术方向',
    type: 'checkbox',
    mock: true,
  },
  {
    name: 'expectedSalary',
    label: '期望薪资',
    type: 'slider',
    min: 8000,
    max: 20000,
    step: 1000,
  },
  {
    name: 'assignedLearners',
    label: '分配学员',
    type: 'transfer',
    titles: ['未分配学员', '已分配学员'],
    mock: true,
  },
  {
    name: 'organizationScope',
    label: '组织范围',
    type: 'treeselect',
    placeholder: '请选择组织范围',
    mock: true,
  },
];

describe('Form schema consumer', () => {
  it('按 schema 渲染 switch、CheckboxGroup、Slider 和 Transfer，并正确绑定值', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(
      <Form
        schema={learnerProfileSchema}
        value={{
          intranetEnabled: false,
          techDirections: ['frontend'],
          expectedSalary: 12000,
          assignedLearners: ['transfer-user-001'],
        }}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole('switch', { name: '是否开通内网权限' }));
    await user.click(screen.getByRole('checkbox', { name: 'Java' }));
    screen.getByRole('slider', { name: '期望薪资' }).focus();
    await user.keyboard('{ArrowRight}');
    await user.click(screen.getByRole('checkbox', { name: '周明轩' }));
    await user.click(screen.getByRole('button', { name: '移至右侧' }));

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        intranetEnabled: true,
      }),
    );
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        techDirections: ['frontend', 'java'],
      }),
    );
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        expectedSalary: 13000,
      }),
    );
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        assignedLearners: ['transfer-user-001', 'transfer-user-002'],
      }),
    );
  });

  it('一键填表会为 switch、CheckboxGroup、Slider、Transfer 和 TreeSelect 生成合理 mock 值', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<Form schema={learnerProfileSchema} onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: '一键填表' }));

    const latestValue = onChange.mock.calls.at(-1)?.[0];

    expect(typeof latestValue.intranetEnabled).toBe('boolean');
    expect(latestValue.techDirections.length).toBeGreaterThanOrEqual(1);
    expect(latestValue.techDirections.length).toBeLessThanOrEqual(2);
    expect(latestValue.techDirections.every((value: string) => ['frontend', 'java', 'ai-agent', 'go'].includes(value))).toBe(true);
    expect(latestValue.expectedSalary).toBeGreaterThanOrEqual(8000);
    expect(latestValue.expectedSalary).toBeLessThanOrEqual(20000);
    expect(latestValue.expectedSalary % 1000).toBe(0);
    expect(latestValue.expectedSalary).toBe(12000);
    expect(latestValue.assignedLearners).toHaveLength(3);
    expect(latestValue.assignedLearners.every((key: string) => key.startsWith('transfer-user-'))).toBe(true);
    expect(latestValue.organizationScope.length).toBeGreaterThanOrEqual(2);
    expect(latestValue.organizationScope.length).toBeLessThanOrEqual(4);
    expect(latestValue.organizationScope.every((key: string) => key.startsWith('global-'))).toBe(true);
  });
});
