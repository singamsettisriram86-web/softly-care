require('@testing-library/jest-dom');

// Provide global mock fetch for Jest JSDOM environment
if (!global.fetch) {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          success: true,
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
