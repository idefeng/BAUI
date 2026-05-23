import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { App } from './app';

describe('App', () => {
  it('renders an application shell with title, navigation and actions', () => {
    render(
      <App
        title="BOAO 管理后台"
        navigation={<nav>项目导航</nav>}
        actions={<button type="button">新建项目</button>}
      >
        <main>项目工作台</main>
      </App>,
    );

    expect(screen.getByRole('heading', { name: 'BOAO 管理后台' })).toBeInTheDocument();
    expect(screen.getByText('项目导航')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '新建项目' })).toBeInTheDocument();
    expect(screen.getByText('项目工作台')).toBeInTheDocument();
  });
});
