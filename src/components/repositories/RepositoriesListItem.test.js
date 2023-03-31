import { render, screen, act } from '@testing-library/react';
import RepositoriesListItem from './RepositoriesListItem';
import { MemoryRouter } from 'react-router-dom';

// const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

//* Mock out the FileIcon component so that it doesn't try to load the icon and cause an "act" error
// jest.mock('../tree/FileIcon', () => {
//   return function FileIcon() {
//     return 'File Icon Component';
//   };
// });

const repository = {
  full_name: 'facebook/react',
  language: 'JavaScript',
  description: 'The library for web and native user interfaces',
  owner: { login: 'facebook' },
  name: 'react',
  html_url: 'https://github.com/facebook/react',
};

function renderComponent() {
  render(
    <MemoryRouter>
      <RepositoriesListItem repository={repository} />
    </MemoryRouter>
  );
}

test('it shows a link to the Github repository', async () => {
  renderComponent();

  //* Need to wait for the FileIcon component to load the icon (finish its state update)...unless we mock it out
  await screen.findByRole('img', { name: repository.language });

  //* Only if nothing else works should you use "act" to wrap the code that is causing the error or to give a pause for state updates
  // await act(async () => {
  //   await pause(100);
  // });

  expect(
    screen.getByRole('link', { name: /github repository/i })
  ).toHaveAttribute('href', repository.html_url);
});

test('shows a fileicon with the appropriate language', async () => {
  renderComponent();

  //* Need to wait for the FileIcon component to load the icon (finish its state update)...unless we mock it out
  const icon = await screen.findByRole('img', { name: repository.language });

  expect(icon).toBeInTheDocument();
  expect(icon).toHaveClass('js-icon');
});

test('shows a link to the code editor page', async () => {
  renderComponent();

  //* Need to wait for the FileIcon component to load the icon (finish its state update)...unless we mock it out
  await screen.findByRole('img', { name: repository.language });

  expect(screen.getByRole('link', { name: /facebook/i })).toHaveAttribute(
    'href',
    `/repositories/${repository.full_name}`
  );
});
