import { render, screen } from '@testing-library/react';
import { Bell } from 'lucide-react';
import { describe, expect, it } from 'vitest';

import { List, ListItem, ListItemMeta } from './list';

describe('List', () => {
  it('支持 bordered 和 split 分割线样式', () => {
    render(
      <List bordered split>
        <ListItem>
          <ListItemMeta title="开班通知" description="今晚 20:00 直播答疑" avatar={<Bell />} />
        </ListItem>
      </List>,
    );

    expect(screen.getByRole('list')).toHaveClass('border-border');
    expect(screen.getByRole('listitem')).toHaveClass('border-b');
  });

  it('Meta 支持左侧头像、标题描述和尾部操作', () => {
    render(
      <List>
        <ListItem actions={<button type="button">查看</button>}>
          <ListItemMeta avatar={<Bell />} title="学习任务" description="完成第一章课后测验" />
        </ListItem>
      </List>,
    );

    expect(screen.getByText('学习任务')).toHaveClass('text-foreground');
    expect(screen.getByRole('button', { name: '查看' })).toBeInTheDocument();
  });
});
