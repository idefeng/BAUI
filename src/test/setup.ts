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
