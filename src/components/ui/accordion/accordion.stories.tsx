import type { Meta, StoryObj } from '@storybook/react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion';

const meta = {
  title: 'UI/Accordion',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <Accordion type="single" collapsible defaultValue="item-1" className="flex w-full max-w-3xl flex-col gap-3">
      <AccordionItem value="item-1">
        <AccordionTrigger>组件如何适配暗黑模式？</AccordionTrigger>
        <AccordionContent>
          所有颜色都来自 Tailwind 语义化 token，并通过 dark: 前缀补齐深色背景下的对比度。
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>是否可以受控使用？</AccordionTrigger>
        <AccordionContent>
          可以。Accordion 直接透传 Radix Root 的 value、defaultValue、onValueChange 等能力。
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" defaultValue={['design', 'accessibility']} className="flex w-full max-w-3xl flex-col gap-3">
      <AccordionItem value="design">
        <AccordionTrigger>设计规范</AccordionTrigger>
        <AccordionContent>
          使用科技蓝主色、现代大圆角和宽松留白，适合企业后台和业务系统的高频界面。
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="accessibility">
        <AccordionTrigger>可访问性</AccordionTrigger>
        <AccordionContent>
          交互语义、键盘行为和展开状态均由 Radix 管理，外层只负责品牌样式。
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="content">
        <AccordionTrigger>内容区域</AccordionTrigger>
        <AccordionContent>
          内容区支持文本、表单、按钮组或业务自定义节点，默认会随展开状态平滑过渡。
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const CompactFaq: Story = {
  render: () => (
    <div className="w-full max-w-3xl rounded-2xl border border-border bg-secondary p-4 dark:border-border-dark dark:bg-secondary-dark">
      <Accordion type="single" collapsible className="flex flex-col gap-3">
        <AccordionItem value="faq-1">
          <AccordionTrigger>Storybook 中如何查看暗黑模式？</AccordionTrigger>
          <AccordionContent>
            打开 ThemeToggle 故事页切换 html.dark 后，再回到任意组件故事页即可检查深色样式。
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="faq-2">
          <AccordionTrigger>能否替换展开图标？</AccordionTrigger>
          <AccordionContent>
            AccordionTrigger 支持 icon 属性，业务侧可以传入任意 lucide-react 图标。
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};
