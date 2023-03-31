import { render, screen } from '@testing-library/react';
import RepositoriesSummary from './RepositoriesSummary';

test('it displays information about the repository', () => {
  const repository = {
    language: 'JavaScript',
    stargazers_count: 99,
    open_issues: 10,
    forks: 20,
  };

  render(<RepositoriesSummary repository={repository} />);

  Object.keys(repository).forEach((key) => {
    expect(screen.getByText(new RegExp(repository[key]))).toBeInTheDocument();
  });
});
