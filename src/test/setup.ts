import '@testing-library/jest-dom/vitest';

const createLocalStorageMock = () => {
  const store = new Map<string, string>();

  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    get length() {
      return store.size;
    },
  };
};

const hasUsableLocalStorage = (storage: Storage | undefined) =>
  typeof storage?.getItem === 'function' &&
  typeof storage.setItem === 'function' &&
  typeof storage.clear === 'function';

try {
  if (!hasUsableLocalStorage(window.localStorage)) {
    // Node 的实验性 localStorage 标志可能污染 jsdom，这里保证测试环境拥有完整 Storage API。
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: createLocalStorageMock(),
    });
  }
} catch {
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: createLocalStorageMock(),
  });
}

if (!HTMLElement.prototype.hasPointerCapture) {
  // jsdom 尚未完整实现 Pointer Capture，Radix Select 交互测试需要这些浏览器 API 存在。
  HTMLElement.prototype.hasPointerCapture = () => false;
}

if (!HTMLElement.prototype.setPointerCapture) {
  HTMLElement.prototype.setPointerCapture = () => undefined;
}

if (!HTMLElement.prototype.releasePointerCapture) {
  HTMLElement.prototype.releasePointerCapture = () => undefined;
}

if (!HTMLElement.prototype.scrollIntoView) {
  HTMLElement.prototype.scrollIntoView = () => undefined;
}

if (!window.ResizeObserver) {
  // Radix 的表单 bubble input 在 jsdom 中会访问 ResizeObserver，这里补齐浏览器等价空实现。
  window.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
