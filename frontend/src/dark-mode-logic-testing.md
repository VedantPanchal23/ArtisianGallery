# ArtHive Dark Mode Logic Testing Guide

## Overview
This guide provides comprehensive testing for dark mode implementation, covering theme logic, state management, persistence, and edge cases.

## 1. Theme Initialization Logic

### Priority Order Testing
```javascript
describe('Theme Initialization', () => {
  beforeEach(() => {
    localStorage.clear();
    // Reset system preference mock
  });

  test('uses localStorage theme if available', () => {
    localStorage.setItem('theme', 'dark');
    render(<ThemeProvider><TestComponent /></ThemeProvider>);

    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });

  test('falls back to system preference', () => {
    // Mock system preference to dark
    mockSystemPreference('dark');
    render(<ThemeProvider><TestComponent /></ThemeProvider>);

    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });

  test('defaults to light theme', () => {
    // No localStorage, system preference light
    mockSystemPreference('light');
    render(<ThemeProvider><TestComponent /></ThemeProvider>);

    expect(screen.getByTestId('theme')).toHaveTextContent('light');
  });
});
```

### System Preference Detection
```javascript
describe('System Preference Detection', () => {
  test('detects dark mode preference', () => {
    mockMediaQuery('(prefers-color-scheme: dark)', true);
    const { result } = renderHook(() => useSystemTheme(), {
      wrapper: ThemeProvider
    });

    expect(result.current).toBe('dark');
  });

  test('detects light mode preference', () => {
    mockMediaQuery('(prefers-color-scheme: dark)', false);
    const { result } = renderHook(() => useSystemTheme(), {
      wrapper: ThemeProvider
    });

    expect(result.current).toBe('light');
  });

  test('responds to system preference changes', () => {
    mockMediaQuery('(prefers-color-scheme: dark)', false);
    const { result, rerender } = renderHook(() => useSystemTheme(), {
      wrapper: ThemeProvider
    });

    expect(result.current).toBe('light');

    // Simulate system preference change
    mockMediaQuery('(prefers-color-scheme: dark)', true);
    fireEvent(window, new Event('change'));

    expect(result.current).toBe('dark');
  });
});
```

## 2. Theme Toggle Logic

### Toggle Functionality
```javascript
describe('Theme Toggle', () => {
  test('switches from light to dark', () => {
    const mockToggle = jest.fn();
    render(<ThemeToggle onToggle={mockToggle} theme="light" />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockToggle).toHaveBeenCalledWith('dark');
  });

  test('switches from dark to light', () => {
    const mockToggle = jest.fn();
    render(<ThemeToggle onToggle={mockToggle} theme="dark" />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockToggle).toHaveBeenCalledWith('light');
  });

  test('provides visual feedback', () => {
    render(<ThemeToggle theme="light" />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });
});
```

### State Management Integration
```javascript
describe('Theme Context Integration', () => {
  test('toggle updates context state', () => {
    render(<ThemeProvider><TestComponent /></ThemeProvider>);

    expect(screen.getByTestId('theme')).toHaveTextContent('light');

    const toggle = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(toggle);

    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });

  test('multiple toggles work correctly', () => {
    render(<ThemeProvider><TestComponent /></ThemeProvider>);

    const toggle = screen.getByRole('button', { name: /toggle theme/i });

    // Light -> Dark
    fireEvent.click(toggle);
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');

    // Dark -> Light
    fireEvent.click(toggle);
    expect(screen.getByTestId('theme')).toHaveTextContent('light');

    // Light -> Dark again
    fireEvent.click(toggle);
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });
});
```

## 3. Persistence Logic

### localStorage Operations
```javascript
describe('Theme Persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('saves theme to localStorage', () => {
    render(<ThemeProvider><TestComponent /></ThemeProvider>);

    const toggle = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(toggle);

    expect(localStorage.getItem('theme')).toBe('dark');
  });

  test('loads theme from localStorage on mount', () => {
    localStorage.setItem('theme', 'dark');

    render(<ThemeProvider><TestComponent /></ThemeProvider>);

    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });

  test('handles localStorage errors gracefully', () => {
    // Mock localStorage error
    const mockSetItem = jest.spyOn(Storage.prototype, 'setItem');
    mockSetItem.mockImplementation(() => {
      throw new Error('localStorage quota exceeded');
    });

    render(<ThemeProvider><TestComponent /></ThemeProvider>);

    const toggle = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(toggle);

    // Should not crash, theme should still work in memory
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });
});
```

### Session Persistence
```javascript
describe('Session Persistence', () => {
  test('maintains theme across component remounts', () => {
    const { rerender } = render(<ThemeProvider><TestComponent /></ThemeProvider>);

    const toggle = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(toggle);

    expect(screen.getByTestId('theme')).toHaveTextContent('dark');

    // Remount component
    rerender(<ThemeProvider><TestComponent /></ThemeProvider>);

    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });

  test('persists theme across page navigation simulation', () => {
    // Simulate page navigation by creating new ThemeProvider instance
    localStorage.setItem('theme', 'dark');

    render(<ThemeProvider><TestComponent /></ThemeProvider>);

    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });
});
```

## 4. CSS Custom Properties Logic

### Theme Application
```javascript
describe('CSS Custom Properties', () => {
  test('applies light theme properties', () => {
    render(<ThemeProvider><TestComponent /></ThemeProvider>);

    const root = document.documentElement;
    expect(root.style.getPropertyValue('--color-background')).toBe('#ffffff');
    expect(root.style.getPropertyValue('--color-text')).toBe('#1a1a1a');
  });

  test('applies dark theme properties', () => {
    render(<ThemeProvider><TestComponent /></ThemeProvider>);

    const toggle = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(toggle);

    const root = document.documentElement;
    expect(root.style.getPropertyValue('--color-background')).toBe('#1a1a1a');
    expect(root.style.getPropertyValue('--color-text')).toBe('#ffffff');
  });

  test('transitions smoothly between themes', () => {
    render(<ThemeProvider><TestComponent /></ThemeProvider>);

    const root = document.documentElement;
    const initialTransition = root.style.getPropertyValue('transition');

    expect(initialTransition).toContain('background-color');
    expect(initialTransition).toContain('color');
  });
});
```

### Component-Specific Properties
```javascript
describe('Component Theme Properties', () => {
  test('applies navbar theme properties', () => {
    render(<ThemeProvider><Navbar /></ThemeProvider>);

    const navbar = screen.getByRole('navigation');
    const styles = window.getComputedStyle(navbar);

    // Check that CSS custom properties are applied
    expect(styles.backgroundColor).toBe('var(--color-navbar-bg)');
  });

  test('applies button theme variants', () => {
    render(<ThemeProvider><Button variant="primary">Test</Button></ThemeProvider>);

    const button = screen.getByRole('button');
    const styles = window.getComputedStyle(button);

    expect(styles.backgroundColor).toBe('var(--color-button-primary-bg)');
    expect(styles.color).toBe('var(--color-button-primary-text)');
  });
});
```

## 5. Edge Cases and Error Handling

### Invalid Theme Values
```javascript
describe('Invalid Theme Handling', () => {
  test('handles invalid localStorage theme', () => {
    localStorage.setItem('theme', 'invalid-theme');

    render(<ThemeProvider><TestComponent /></ThemeProvider>);

    // Should fall back to system preference or light theme
    expect(['light', 'dark']).toContain(screen.getByTestId('theme').textContent);
  });

  test('handles corrupted localStorage data', () => {
    localStorage.setItem('theme', '{invalid-json}');

    render(<ThemeProvider><TestComponent /></ThemeProvider>);

    // Should not crash and use fallback
    expect(screen.getByTestId('theme')).toBeInTheDocument();
  });
});
```

### Browser Compatibility
```javascript
describe('Browser Compatibility', () => {
  test('works without CSS custom property support', () => {
    // Mock lack of CSS custom property support
    mockCSSCustomProperties(false);

    render(<ThemeProvider><TestComponent /></ThemeProvider>);

    // Should fall back to class-based theming
    expect(document.documentElement).toHaveClass('theme-light');
  });

  test('handles localStorage unavailable', () => {
    // Mock localStorage unavailable
    mockLocalStorageUnavailable();

    render(<ThemeProvider><TestComponent /></ThemeProvider>);

    // Should work with memory-only state
    const toggle = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(toggle);

    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });
});
```

### Performance Edge Cases
```javascript
describe('Performance Edge Cases', () => {
  test('handles rapid theme toggling', () => {
    render(<ThemeProvider><TestComponent /></ThemeProvider>);

    const toggle = screen.getByRole('button', { name: /toggle theme/i });

    // Rapid clicking
    for (let i = 0; i < 10; i++) {
      fireEvent.click(toggle);
    }

    // Should end up in correct state
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });

  test('theme toggle during component unmount', () => {
    const { unmount } = render(<ThemeProvider><TestComponent /></ThemeProvider>);

    const toggle = screen.getByRole('button', { name: /toggle theme/i });

    // Start toggle operation
    fireEvent.click(toggle);

    // Unmount during theme transition
    unmount();

    // Should not cause memory leaks or errors
    expect(console.error).not.toHaveBeenCalled();
  });
});
```

## 6. Analytics Integration

### Theme Change Tracking
```javascript
describe('Theme Analytics', () => {
  test('tracks theme changes', () => {
    const mockAnalytics = jest.fn();
    mockAnalytics.track = jest.fn();

    render(<ThemeProvider analytics={mockAnalytics}><TestComponent /></ThemeProvider>);

    const toggle = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(toggle);

    expect(mockAnalytics.track).toHaveBeenCalledWith('theme_change', {
      old_theme: 'light',
      new_theme: 'dark',
      source: 'toggle'
    });
  });

  test('tracks system preference changes', () => {
    const mockAnalytics = jest.fn();
    mockAnalytics.track = jest.fn();

    render(<ThemeProvider analytics={mockAnalytics}><TestComponent /></ThemeProvider>);

    // Simulate system preference change
    mockSystemPreferenceChange('dark');

    expect(mockAnalytics.track).toHaveBeenCalledWith('theme_change', {
      old_theme: 'light',
      new_theme: 'dark',
      source: 'system'
    });
  });
});
```

### Error Tracking
```javascript
describe('Error Analytics', () => {
  test('tracks theme initialization errors', () => {
    const mockAnalytics = jest.fn();
    mockAnalytics.trackError = jest.fn();

    // Force an error in theme initialization
    mockThemeInitializationError();

    render(<ThemeProvider analytics={mockAnalytics}><TestComponent /></ThemeProvider>);

    expect(mockAnalytics.trackError).toHaveBeenCalledWith(
      'theme_initialization_error',
      expect.any(Error)
    );
  });

  test('tracks localStorage errors', () => {
    const mockAnalytics = jest.fn();
    mockAnalytics.trackError = jest.fn();

    mockLocalStorageError();

    render(<ThemeProvider analytics={mockAnalytics}><TestComponent /></ThemeProvider>);

    const toggle = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(toggle);

    expect(mockAnalytics.trackError).toHaveBeenCalledWith(
      'localStorage_error',
      expect.any(Error)
    );
  });
});
```

## 7. Integration Testing

### Multi-Component Theme Synchronization
```javascript
describe('Multi-Component Theme Sync', () => {
  test('all components update simultaneously', () => {
    render(
      <ThemeProvider>
        <Navbar />
        <MainContent />
        <Footer />
      </ThemeProvider>
    );

    const toggle = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(toggle);

    // All components should reflect dark theme
    expect(screen.getByTestId('navbar')).toHaveAttribute('data-theme', 'dark');
    expect(screen.getByTestId('main')).toHaveAttribute('data-theme', 'dark');
    expect(screen.getByTestId('footer')).toHaveAttribute('data-theme', 'dark');
  });

  test('theme changes propagate to nested components', () => {
    render(
      <ThemeProvider>
        <div>
          <ThemeConsumer />
          <div>
            <ThemeConsumer />
          </div>
        </div>
      </ThemeProvider>
    );

    const toggle = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(toggle);

    // All nested consumers should update
    const consumers = screen.getAllByTestId('theme-consumer');
    consumers.forEach(consumer => {
      expect(consumer).toHaveTextContent('dark');
    });
  });
});
```

### Theme and Route Integration
```javascript
describe('Theme and Routing', () => {
  test('theme persists across route changes', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    );

    // Set dark theme
    const toggle = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(toggle);

    // Navigate to different route
    const link = screen.getByRole('link', { name: /explore/i });
    fireEvent.click(link);

    // Theme should persist
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });
});
```

## 8. Accessibility Testing

### Screen Reader Announcements
```javascript
describe('Screen Reader Support', () => {
  test('announces theme changes', () => {
    render(<ThemeProvider><TestComponent /></ThemeProvider>);

    const toggle = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(toggle);

    // Should announce theme change to screen readers
    expect(screen.getByText('Switched to dark theme')).toBeInTheDocument();
  });

  test('provides theme status to assistive technology', () => {
    render(<ThemeProvider><TestComponent /></ThemeProvider>);

    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('Current theme: light');

    const toggle = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(toggle);

    expect(status).toHaveTextContent('Current theme: dark');
  });
});
```

### Keyboard Navigation
```javascript
describe('Keyboard Navigation', () => {
  test('theme toggle accessible via keyboard', () => {
    render(<ThemeProvider><TestComponent /></ThemeProvider>);

    const toggle = screen.getByRole('button', { name: /toggle theme/i });

    // Focus toggle
    toggle.focus();
    expect(document.activeElement).toBe(toggle);

    // Activate with Enter
    fireEvent.keyDown(toggle, { key: 'Enter' });
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');

    // Activate with Space
    fireEvent.keyDown(toggle, { key: ' ' });
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
  });
});
```

## 9. Performance Testing

### Theme Switch Performance
```javascript
describe('Theme Switch Performance', () => {
  test('theme toggle completes within 200ms', async () => {
    render(<ThemeProvider><TestComponent /></ThemeProvider>);

    const toggle = screen.getByRole('button', { name: /toggle theme/i });

    const startTime = performance.now();
    fireEvent.click(toggle);
    const endTime = performance.now();

    expect(endTime - startTime).toBeLessThan(200);
  });

  test('CSS transitions are smooth', () => {
    render(<ThemeProvider><TestComponent /></ThemeProvider>);

    const element = screen.getByTestId('themed-element');
    const styles = window.getComputedStyle(element);

    // Should use GPU-accelerated properties
    expect(styles.transition).toMatch(/transform|opacity/);
  });
});
```

### Memory Leak Prevention
```javascript
describe('Memory Management', () => {
  test('cleans up event listeners on unmount', () => {
    const mockRemoveListener = jest.fn();
    window.matchMedia = jest.fn().mockReturnValue({
      addListener: jest.fn(),
      removeListener: mockRemoveListener
    });

    const { unmount } = render(<ThemeProvider><TestComponent /></ThemeProvider>);

    unmount();

    expect(mockRemoveListener).toHaveBeenCalled();
  });

  test('no memory leaks during rapid toggling', () => {
    render(<ThemeProvider><TestComponent /></ThemeProvider>);

    const toggle = screen.getByRole('button', { name: /toggle theme/i });

    // Rapid toggling shouldn't cause memory issues
    for (let i = 0; i < 100; i++) {
      fireEvent.click(toggle);
    }

    // Component should still function normally
    expect(screen.getByTestId('theme')).toBeInTheDocument();
  });
});
```

## 10. Cross-Browser Testing Matrix

### Browser-Specific Logic
```javascript
describe('Cross-Browser Compatibility', () => {
  test('handles Safari CSS custom property quirks', () => {
    mockBrowser('Safari');

    render(<ThemeProvider><TestComponent /></ThemeProvider>);

    // Should use Safari-compatible CSS
    const root = document.documentElement;
    expect(root.style.getPropertyValue('--color-text')).toBeDefined();
  });

  test('falls back for IE11 CSS variable support', () => {
    mockBrowser('IE11');

    render(<ThemeProvider><TestComponent /></ThemeProvider>);

    // Should use class-based theming fallback
    expect(document.documentElement).toHaveClass('theme-light');
  });
});
```

This comprehensive testing guide ensures robust dark mode functionality across all scenarios and edge cases.