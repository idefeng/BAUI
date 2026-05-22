import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion';

describe('Accordion', () => {
  it('基于 Radix Accordion 支持点击展开内容', async () => {
    const user = userEvent.setup();

    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>组件规范</AccordionTrigger>
          <AccordionContent>所有组件使用语义化 token。</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    const trigger = screen.getByRole('button', { name: '组件规范' });

    expect(trigger).toHaveClass('rounded-2xl');
    await user.click(trigger);

    expect(screen.getByText('所有组件使用语义化 token。')).toBeVisible();
  });

  it('使用现代大圆角、动画和暗黑模式类名', () => {
    render(
      <Accordion type="single" defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>暗黑模式</AccordionTrigger>
          <AccordionContent data-testid="accordion-content">支持 dark class。</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    expect(screen.getByRole('button', { name: '暗黑模式' }).className).toContain('dark:');
    expect(screen.getByTestId('accordion-content').className).toContain('data-[state=open]:animate-accordion-down');
  });
});
