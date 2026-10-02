require('@testing-library/jest-dom');

// Mock next/navigation for Jest
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => '/',
}));

// Provide global mock fetch for Jest JSDOM environment
if (!global.fetch) {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          success: true,
          families: [],
          medications: [],
          logs: [],
          tasks: [],
          appointments: [],
          payments: [],
          messages: [],
        }),
    })
  );
}
