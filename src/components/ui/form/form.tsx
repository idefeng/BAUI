import * as React from 'react';

import { cn } from '../../../lib/utils';
import {
  mockPickTechnologyInterests,
  mockSelectOptions,
  mockSwitchChecked,
  mockTechnologyInterestOptions,
  mockUsers,
  type MockSelectOptionType,
} from '../../../utils/mock';
import { Button } from '../button';
import { Checkbox, CheckboxGroup, type CheckboxGroupOption } from '../checkbox';
import { Input, type InputProps } from '../input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../select';
import { uiStyles } from '../shared/styles';
import { Switch } from '../switch';

export type FormFieldType = 'input' | 'select' | 'switch' | 'checkbox';
export type FormValues = Record<string, unknown>;

export interface FormOption {
  label: string;
  value: string;
}

export interface FormSchemaField {
  /** 字段名，对应表单值对象中的 key。 */
  name: string;
  /** 表单字段展示标签。 */
  label: string;
  /** 字段类型；checkbox 带 options 时渲染 CheckboxGroup。 */
  type: FormFieldType;
  /** 输入类字段占位文案。 */
  placeholder?: string;
  /** select 或 CheckboxGroup 的可选项。 */
  options?: FormOption[];
  /** 禁用当前字段。 */
  disabled?: boolean;
  /** Mock 类型；input 支持 name/phone/email，checkbox 可用 true 自动加载 IT 技术方向。 */
  mock?: boolean | InputProps['mock'] | MockSelectOptionType;
}

export interface FormProps extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'defaultValue' | 'onChange' | 'onSubmit'> {
  /** Schema 驱动字段配置。 */
  schema: FormSchemaField[];
  /** 受控表单值。 */
  value?: FormValues;
  /** 非受控初始值。 */
  defaultValue?: FormValues;
  /** 任一字段变更时返回完整表单值。 */
  onChange?: (value: FormValues) => void;
  /** 提交表单时返回完整表单值。 */
  onSubmit?: (value: FormValues) => void;
  /** 是否展示一键填表按钮。 */
  showMockFill?: boolean;
}

const isInputMockType = (mock: FormSchemaField['mock']): mock is InputProps['mock'] =>
  mock === 'name' || mock === 'phone' || mock === 'email';

const isSelectMockType = (mock: FormSchemaField['mock']): mock is MockSelectOptionType =>
  mock === 'department' || mock === 'project' || mock === 'trainingType' || mock === 'status';

const getFieldOptions = (field: FormSchemaField): CheckboxGroupOption[] => {
  if (field.options && field.options.length > 0) {
    return field.options;
  }

  if (field.type === 'checkbox' && field.mock === true) {
    return mockTechnologyInterestOptions();
  }

  if (field.type === 'select' && isSelectMockType(field.mock)) {
    return mockSelectOptions(field.mock);
  }

  return [];
};

const getMockInputValue = (mock: FormSchemaField['mock']) => {
  const user = mockUsers(1)[0];

  if (mock === 'phone') {
    return user.phoneMasked;
  }

  if (mock === 'email') {
    return 'student@boaoit.com';
  }

  return user.name;
};

const getMockValue = (field: FormSchemaField, index: number) => {
  if (field.type === 'switch') {
    return mockSwitchChecked(index);
  }

  if (field.type === 'checkbox') {
    const options = getFieldOptions(field);

    return options.length > 0 ? mockPickTechnologyInterests(options, index + 1) : mockSwitchChecked(index);
  }

  if (field.type === 'select') {
    return getFieldOptions(field)[0]?.value ?? '';
  }

  return getMockInputValue(field.mock);
};

export const Form = React.forwardRef<HTMLFormElement, FormProps>(
  (
    {
      className,
      defaultValue = {},
      onChange,
      onSubmit,
      schema,
      showMockFill = true,
      value,
      ...props
    },
    ref,
  ) => {
    const isControlled = value !== undefined;
    const [innerValue, setInnerValue] = React.useState<FormValues>(defaultValue);
    const formValue = isControlled ? value : innerValue;

    const commitValue = (nextValue: FormValues) => {
      if (!isControlled) {
        setInnerValue(nextValue);
      }

      onChange?.(nextValue);
    };

    const updateField = (name: string, fieldValue: unknown) => {
      commitValue({
        ...formValue,
        [name]: fieldValue,
      });
    };

    const fillMockValues = () => {
      const nextValue = schema.reduce<FormValues>(
        (result, field, index) => ({
          ...result,
          [field.name]: getMockValue(field, index),
        }),
        { ...formValue },
      );

      commitValue(nextValue);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      onSubmit?.(formValue);
    };

    const renderFieldControl = (field: FormSchemaField) => {
      const fieldValue = formValue[field.name];

      if (field.type === 'switch') {
        return (
          <Switch
            id={field.name}
            aria-label={field.label}
            checked={Boolean(fieldValue)}
            disabled={field.disabled}
            onChange={(checked) => updateField(field.name, checked)}
          />
        );
      }

      if (field.type === 'checkbox') {
        const options = getFieldOptions(field);

        if (options.length > 0) {
          return (
            <CheckboxGroup
              aria-label={field.label}
              name={field.name}
              options={options}
              value={Array.isArray(fieldValue) ? fieldValue.filter((item): item is string => typeof item === 'string') : []}
              disabled={field.disabled}
              mock={field.mock === true}
              onChange={(checkedValues) => updateField(field.name, checkedValues)}
            />
          );
        }

        return (
          <Checkbox
            id={field.name}
            aria-label={field.label}
            checked={Boolean(fieldValue)}
            disabled={field.disabled}
            onChange={(checked) => updateField(field.name, checked)}
          />
        );
      }

      if (field.type === 'select') {
        const options = getFieldOptions(field);

        return (
          <Select
            value={typeof fieldValue === 'string' ? fieldValue : undefined}
            disabled={field.disabled}
            onValueChange={(selectedValue) => updateField(field.name, selectedValue)}
          >
            <SelectTrigger id={field.name} aria-label={field.label}>
              <SelectValue placeholder={field.placeholder ?? `请选择${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }

      return (
        <Input
          id={field.name}
          value={typeof fieldValue === 'string' ? fieldValue : ''}
          placeholder={field.placeholder}
          disabled={field.disabled}
          mock={isInputMockType(field.mock) ? field.mock : undefined}
          onChange={(event) => updateField(field.name, event.currentTarget.value)}
        />
      );
    };

    return (
      <form ref={ref} className={cn('grid gap-5', className)} onSubmit={handleSubmit} {...props}>
        {schema.map((field) => (
          <div key={field.name} className="grid gap-2">
            <label htmlFor={field.name} className={uiStyles.title}>
              {field.label}
            </label>
            {renderFieldControl(field)}
          </div>
        ))}

        {showMockFill ? (
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={fillMockValues}>
              一键填表
            </Button>
            <Button type="submit">提交</Button>
          </div>
        ) : null}
      </form>
    );
  },
);

Form.displayName = 'Form';
