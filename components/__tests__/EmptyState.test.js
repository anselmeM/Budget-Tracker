import React from 'react';
import { render } from '@testing-library/react-native';
import EmptyState from '../EmptyState';

describe('EmptyState', () => {
  it('renders correctly without a filter label', () => {
    const { getByText } = render(<EmptyState />);
    expect(getByText('No Transactions Yet')).toBeTruthy();
    expect(getByText('Your recent transactions will appear here.')).toBeTruthy();
  });

  it('renders correctly with a filter label', () => {
    const { getByText } = render(<EmptyState filterLabel="Groceries" />);
    expect(getByText('No transactions for Groceries')).toBeTruthy();
    expect(getByText('Your recent transactions will appear here.')).toBeTruthy();
  });
});
