import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProfileDropdown from './ProfileDropdown';

// Mock the Icon component
jest.mock('./icons', () => ({
  Icon: ({ name, size, ...props }) => <span data-icon={name} style={{ fontSize: size }} {...props} />
}));

describe('ProfileDropdown', () => {
  const mockUser = {
    name: 'John Doe',
    email: 'john@example.com'
  };

  const mockOnLogout = jest.fn();

  beforeEach(() => {
    mockOnLogout.mockClear();
  });

  test('renders profile avatar with initials', () => {
    render(<ProfileDropdown user={mockUser} onLogout={mockOnLogout} />);

    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  test('toggles dropdown on avatar click', () => {
    render(<ProfileDropdown user={mockUser} onLogout={mockOnLogout} />);

    const avatar = screen.getByRole('button');
    expect(avatar).toBeInTheDocument();

    // Initially closed
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    // Click to open
    fireEvent.click(avatar);
    expect(screen.getByRole('menu')).toBeInTheDocument();

    // Click to close
    fireEvent.click(avatar);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  test('displays user information in header', () => {
    render(<ProfileDropdown user={mockUser} onLogout={mockOnLogout} />);

    const avatar = screen.getByRole('button');
    fireEvent.click(avatar);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  test('calls onLogout when sign out is clicked', () => {
    render(<ProfileDropdown user={mockUser} onLogout={mockOnLogout} />);

    const avatar = screen.getByRole('button');
    fireEvent.click(avatar);

    const signOutButton = screen.getByText('Sign out');
    fireEvent.click(signOutButton);

    expect(mockOnLogout).toHaveBeenCalledTimes(1);
  });
});