import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TransactionListItem from '../transactions/TransactionListItem';

describe('TransactionListItem', () => {
  const item = {
    title: 'Test Transaction',
    amount: 100,
  };
  const onDelete = jest.fn();
  const onEdit = jest.fn();
  const categoryLabel = 'Test Category';

  it('renders correctly', () => {
    const { getByText } = render(
      <TransactionListItem
        item={item}
        onDelete={onDelete}
        onEdit={onEdit}
        categoryLabel={categoryLabel}
      />
    );

    expect(getByText('Test Transaction')).toBeTruthy();
    expect(getByText('Test Category')).toBeTruthy();
    expect(getByText('+$100.00')).toBeTruthy();
  });

  it('calls onEdit when pressed', () => {
    const { getByText } = render(
      <TransactionListItem
        item={item}
        onDelete={onDelete}
        onEdit={onEdit}
        categoryLabel={categoryLabel}
      />
    );

    fireEvent.press(getByText('Test Transaction'));
    expect(onEdit).toHaveBeenCalled();
  });
});
