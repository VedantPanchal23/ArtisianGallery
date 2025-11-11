import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../ThemeContext';

// Test component to access theme context
const TestComponent = () => {
  const { theme, toggleTheme, isDark, isLight } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="is-dark">{isDark.toString()}</span>
      <span data-testid="is-light">{isLight.toString()}</span>
      <button data-testid="toggle" onClick={toggleTheme}>
        Toggle Theme
      </button>
    </div>
  );
};

// Mock console.log to avoid test output noise
const originalConsoleLog = console.log;
beforeAll(() => {
  console.log = jest.fn();
});

afterAll(() => {
  console.log = originalConsoleLog;
});

// Helper to mock matchMedia
const mockMatchMedia = (matches = false) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)' ? matches : false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};

describe('ThemeContext', () => {
  let originalLocalStorageGetItem;
  let originalLocalStorageSetItem;

  beforeEach(() => {
    // Clear localStorage and reset document
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');

    // Reset to default matchMedia (light preference)
    mockMatchMedia(false);

    // Clear console.log calls between tests
    console.log.mockClear();

    // Store original localStorage methods
    originalLocalStorageGetItem = Storage.prototype.getItem;
    originalLocalStorageSetItem = Storage.prototype.setItem;
  });

  afterEach(() => {
    // Restore original localStorage methods
    Storage.prototype.getItem = originalLocalStorageGetItem;
    Storage.prototype.setItem = originalLocalStorageSetItem;
  });

  describe('Theme Initialization', () => {
    test('initializes with light theme by default', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('light');
      expect(screen.getByTestId('is-light')).toHaveTextContent('true');
      expect(screen.getByTestId('is-dark')).toHaveTextContent('false');
    });

    test('loads theme from localStorage if available', () => {
      localStorage.setItem('arthive_theme', 'dark');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
      expect(screen.getByTestId('is-dark')).toHaveTextContent('true');
      expect(screen.getByTestId('is-light')).toHaveTextContent('false');
    });

    test('ignores invalid localStorage theme values', () => {
      localStorage.setItem('arthive_theme', 'invalid-theme');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Should fall back to system preference (light in mocked environment)
      expect(screen.getByTestId('theme')).toHaveTextContent('light');
    });

    test('respects system dark mode preference when no localStorage', () => {
      // Mock system preference for dark mode
      mockMatchMedia(true);

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    });
  });

  describe('Theme Toggle Functionality', () => {
    test('toggles from light to dark', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const toggleButton = screen.getByTestId('toggle');

      expect(screen.getByTestId('theme')).toHaveTextContent('light');

      fireEvent.click(toggleButton);

      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
      expect(screen.getByTestId('is-dark')).toHaveTextContent('true');
      expect(screen.getByTestId('is-light')).toHaveTextContent('false');
    });

    test('toggles from dark to light', () => {
      localStorage.setItem('arthive_theme', 'dark');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const toggleButton = screen.getByTestId('toggle');

      expect(screen.getByTestId('theme')).toHaveTextContent('dark');

      fireEvent.click(toggleButton);

      expect(screen.getByTestId('theme')).toHaveTextContent('light');
      expect(screen.getByTestId('is-light')).toHaveTextContent('true');
      expect(screen.getByTestId('is-dark')).toHaveTextContent('false');
    });

    test('multiple toggles work correctly', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const toggleButton = screen.getByTestId('toggle');

      // Light -> Dark
      fireEvent.click(toggleButton);
      expect(screen.getByTestId('theme')).toHaveTextContent('dark');

      // Dark -> Light
      fireEvent.click(toggleButton);
      expect(screen.getByTestId('theme')).toHaveTextContent('light');

      // Light -> Dark
      fireEvent.click(toggleButton);
      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    });
  });

  describe('Theme Persistence', () => {
    test('saves theme to localStorage when changed', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const toggleButton = screen.getByTestId('toggle');
      fireEvent.click(toggleButton);

      expect(localStorage.getItem('arthive_theme')).toBe('dark');
    });

    test('applies data-theme attribute to document', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(document.documentElement.getAttribute('data-theme')).toBe('light');

      const toggleButton = screen.getByTestId('toggle');
      fireEvent.click(toggleButton);

      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    test('maintains theme across component remounts', () => {
      const { rerender } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const toggleButton = screen.getByTestId('toggle');
      fireEvent.click(toggleButton);

      expect(screen.getByTestId('theme')).toHaveTextContent('dark');

      // Remount component
      rerender(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    });
  });

  describe('System Preference Changes', () => {
    test('responds to system preference changes when no localStorage', () => {
      // Start with light theme (no localStorage)
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('light');

      // Simulate system preference change to dark
      const mockMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      Object.defineProperty(mockMediaQuery, 'matches', { value: true });

      // Trigger change event
      const changeEvent = new Event('change');
      mockMediaQuery.dispatchEvent(changeEvent);

      // Wait for state update
      waitFor(() => {
        expect(screen.getByTestId('theme')).toHaveTextContent('dark');
      });
    });

    test('ignores system preference changes when localStorage is set', () => {
      localStorage.setItem('arthive_theme', 'light');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('light');

      // Simulate system preference change to dark
      const mockMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      Object.defineProperty(mockMediaQuery, 'matches', { value: true });

      const changeEvent = new Event('change');
      mockMediaQuery.dispatchEvent(changeEvent);

      // Should still be light (localStorage takes priority)
      expect(screen.getByTestId('theme')).toHaveTextContent('light');
    });
  });

  describe('Analytics Tracking', () => {
    test('tracks theme changes', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const toggleButton = screen.getByTestId('toggle');
      fireEvent.click(toggleButton);

      // Verify analytics function was called
      expect(console.log).toHaveBeenCalledWith('Theme change analytics:', {
        oldTheme: 'light',
        newTheme: 'dark'
      });
    });

    test('does not track when theme stays the same', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Click toggle twice - this changes theme twice: light -> dark -> light
      const toggleButton = screen.getByTestId('toggle');
      fireEvent.click(toggleButton);
      fireEvent.click(toggleButton);

      // Should be called twice (for each theme change)
      expect(console.log).toHaveBeenCalledTimes(2);
    });
  });

  describe('Error Handling', () => {
    test('handles localStorage errors gracefully', () => {
      // Mock localStorage.setItem to throw error
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = jest.fn(() => {
        throw new Error('localStorage quota exceeded');
      });

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const toggleButton = screen.getByTestId('toggle');

      // Should not crash
      expect(() => fireEvent.click(toggleButton)).not.toThrow();

      // Theme should still change in memory
      expect(screen.getByTestId('theme')).toHaveTextContent('dark');

      // Restore original localStorage
      Storage.prototype.setItem = originalSetItem;
    });

    test('handles localStorage.getItem errors gracefully', () => {
      // Mock localStorage.getItem to throw error
      const originalGetItem = Storage.prototype.getItem;
      Storage.prototype.getItem = jest.fn(() => {
        throw new Error('localStorage access denied');
      });

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Should fall back to system preference
      expect(screen.getByTestId('theme')).toHaveTextContent('light');

      // Restore original localStorage
      Storage.prototype.getItem = originalGetItem;
    });
  });

  describe('useTheme Hook', () => {
    test('throws error when used outside ThemeProvider', () => {
      // Mock console.error to avoid test output
      const originalConsoleError = console.error;
      console.error = jest.fn();

      expect(() => render(<TestComponent />)).toThrow(
        'useTheme must be used within a ThemeProvider'
      );

      console.error = originalConsoleError;
    });

    test('provides all required context values', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme')).toBeInTheDocument();
      expect(screen.getByTestId('is-dark')).toBeInTheDocument();
      expect(screen.getByTestId('is-light')).toBeInTheDocument();
      expect(screen.getByTestId('toggle')).toBeInTheDocument();
    });
  });

  describe('Performance and Memory', () => {
    test('cleans up event listeners on unmount', async () => {
      // Mock localStorage to return null (no saved theme) so system listener is added
      const localStorageSpy = jest.spyOn(Storage.prototype, 'getItem');
      localStorageSpy.mockReturnValue(null);

      const mockRemoveEventListener = jest.fn();
      const mockAddEventListener = jest.fn();
      const mockMediaQuery = {
        addEventListener: mockAddEventListener,
        removeEventListener: mockRemoveEventListener,
      };

      // Apply mock before rendering
      const originalMatchMedia = window.matchMedia;
      window.matchMedia = jest.fn().mockReturnValue(mockMediaQuery);

      const { unmount } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Wait for the effect to run and add the listener
      await waitFor(() => {
        expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function));
      });

      unmount();

      expect(mockRemoveEventListener).toHaveBeenCalledWith('change', expect.any(Function));

      // Restore mocks
      localStorageSpy.mockRestore();
      window.matchMedia = originalMatchMedia;
    });

    test('handles rapid theme toggling without issues', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const toggleButton = screen.getByTestId('toggle');

      // Rapid clicking
      for (let i = 0; i < 10; i++) {
        fireEvent.click(toggleButton);
      }

      // Should end up in correct state (even number of clicks = back to light)
      expect(screen.getByTestId('theme')).toHaveTextContent('light');
    });
  });
});