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
];

describe('Form schema consumer', () => {
  it('按 schema 渲染 switch 和 CheckboxGroup，并正确绑定值', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(
      <Form
        schema={learnerProfileSchema}
        value={{ intranetEnabled: false, techDirections: ['frontend'] }}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole('switch', { name: '是否开通内网权限' }));
    await user.click(screen.getByRole('checkbox', { name: 'Java' }));

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
  });

  it('一键填表会为 switch 生成布尔值并为 CheckboxGroup 随机勾选 1 到 2 项', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<Form schema={learnerProfileSchema} onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: '一键填表' }));

    const latestValue = onChange.mock.calls.at(-1)?.[0];

    expect(typeof latestValue.intranetEnabled).toBe('boolean');
    expect(latestValue.techDirections.length).toBeGreaterThanOrEqual(1);
    expect(latestValue.techDirections.length).toBeLessThanOrEqual(2);
    expect(latestValue.techDirections.every((value: string) => ['frontend', 'java', 'ai-agent', 'go'].includes(value))).toBe(true);
  });
});
