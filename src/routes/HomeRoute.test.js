import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomeRoute from './HomeRoute';

import { createServer } from '../test/server';

// const handlers = [
//   rest.get('/api/repositories', (req, res, ctx) => {
//     const query = req.url.searchParams.get('q');
//     // console.log('query', query);
//     const language = query.split('language:')[1];

//     return res(
//       ctx.json({
//         items: [
//           {
//             full_name: `${language}_one`,
//             id: 1,
//           },
//           {
//             full_name: `${language}_two`,
//             id: 2,
//           },
//         ],
//       })
//     );
//   }),
// ];

// const server = setupServer(...handlers);

// beforeAll(() => server.listen());
// afterEach(() => server.resetHandlers());
// afterAll(() => server.close());

createServer([
  {
    path: '/api/repositories',
    res: (req, res, ctx) => {
      const query = req.url.searchParams.get('q');
      const language = query.split('language:')[1];

      return {
        items: [
          {
            full_name: `${language}_one`,
            id: 1,
          },
          {
            full_name: `${language}_two`,
            id: 2,
          },
        ],
      };
    },
  },
]);

test('it renders 2 links for each language', async () => {
  render(
    <MemoryRouter>
      <HomeRoute />
    </MemoryRouter>
  );

  // Loop over each language
  // For each language, expect to see 2 links
  // Expect that the links have the appropriate full_name

  const languages = [
    'javascript',
    'typescript',
    'rust',
    'go',
    'python',
    'java',
  ];

  for (const language of languages) {
    const links = await screen.findAllByRole('link', {
      name: new RegExp(`${language}_`),
    });
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveTextContent(`${language}_one`);
    expect(links[1]).toHaveTextContent(`${language}_two`);
    expect(links[0]).toHaveAttribute('href', `/repositories/${language}_one`);
    expect(links[1]).toHaveAttribute('href', `/repositories/${language}_two`);
  }
});
