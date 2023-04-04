import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SWRConfig } from 'swr';

import AuthButtons from './AuthButtons';
import { createServer } from '../../test/server';

async function renderComponent() {
  //! clear the SWR cache
  render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <MemoryRouter>
        <AuthButtons />
      </MemoryRouter>
    </SWRConfig>
  );
  //! wait for any links to be rendered
  await screen.findAllByRole('link');
}

//* NOT SIGNED IN
describe('when user is not signed in', () => {
  createServer([
    {
      path: '/api/user',
      res: (req, res, ctx) => {
        return {
          user: null,
        };
      },
    },
  ]);

  test('the sign in and sign up buttons are rendered', async () => {
    await renderComponent();

    const signInLink = screen.getByRole('link', { name: /sign in/i });
    const signUpLink = screen.getByRole('link', { name: /sign up/i });

    expect(signInLink).toBeInTheDocument();
    expect(signUpLink).toBeInTheDocument();
    expect(signInLink).toHaveAttribute('href', '/signin');
    expect(signUpLink).toHaveAttribute('href', '/signup');
  });

  test('the sign out button is not rendered', async () => {
    await renderComponent();

    const signOutLink = screen.queryByRole('link', { name: /sign out/i });

    expect(signOutLink).not.toBeInTheDocument();
  });
});

//* SIGNED IN
describe('when user is signed in', () => {
  createServer([
    {
      path: '/api/user',
      res: (req, res, ctx) => {
        return {
          user: {
            id: 1,
            email: 'john@email.com',
          },
        };
      },
    },
  ]);

  test('the sign in and sign up buttons are not rendered', async () => {
    await renderComponent();

    const signInLink = screen.queryByRole('link', { name: /sign in/i });
    const signUpLink = screen.queryByRole('link', { name: /sign up/i });

    expect(signInLink).not.toBeInTheDocument();
    expect(signUpLink).not.toBeInTheDocument();
  });

  test('the sign out button is rendered', async () => {
    await renderComponent();

    const signOutLink = screen.getByRole('link', { name: /sign out/i });

    expect(signOutLink).toBeInTheDocument();
    expect(signOutLink).toHaveAttribute('href', '/signout');
  });
});
