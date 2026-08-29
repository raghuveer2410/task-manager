import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./api/api', () => ({
  __esModule: true,
  default: {
    defaults: {
      headers: {
        common: {},
      },
    },
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

beforeEach(() => {
  localStorage.clear();
  window.history.pushState({}, '', '/');
});

test('redirects unauthenticated users to the login page', async () => {
  render(<App />);

  expect(
    await screen.findByRole('heading', { name: /login/i })
  ).toBeInTheDocument();
});
