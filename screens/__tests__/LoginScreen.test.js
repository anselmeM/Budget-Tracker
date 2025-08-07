import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../LoginScreen';
import { useAuth } from '../../context/AuthContext';

jest.mock('../../context/AuthContext');

describe('LoginScreen', () => {
  it('calls login on button press', async () => {
    const login = jest.fn();
    useAuth.mockReturnValue({
      login: login,
    });

    const { getByPlaceholderText, getByText } = render(<LoginScreen navigation={{navigate: jest.fn()}} />);

    fireEvent.changeText(getByPlaceholderText('Phone/Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByText('Sign In'));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });
});
