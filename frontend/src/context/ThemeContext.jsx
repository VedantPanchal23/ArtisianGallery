import React, { createContext, useContext, useState, useEffect } from 'react';

// Analytics function (placeholder - can be replaced with actual analytics service)
const trackThemeChange = (oldTheme, newTheme) => {
  console.log('Theme change analytics:', { oldTheme, newTheme });
  // In a real app, this would send to analytics service like Google Analytics, Mixpanel, etc.
  // Example: gtag('event', 'theme_change', { old_theme: oldTheme, new_theme: newTheme });
};

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Get initial theme with priority: localStorage -> system preference -> light default
  const getInitialTheme = () => {
    // 1. Check localStorage first
    try {
      const savedTheme = localStorage.getItem('arthive_theme');
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        return savedTheme;
      }
    } catch (error) {
      console.error('Error accessing localStorage for theme:', error);
    }

    // 2. Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    // 3. Default to light
    return 'light';
  };

  const [theme, setTheme] = useState(getInitialTheme);

  // Apply theme to document and localStorage when theme changes
  useEffect(() => {
    const oldTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = theme;

    // Update document attribute for CSS theming
    document.documentElement.setAttribute('data-theme', theme);

    // Persist to localStorage
    try {
      localStorage.setItem('arthive_theme', theme);
    } catch (error) {
      console.error('Error saving theme to localStorage:', error);
    }

    // Track analytics if theme actually changed
    if (oldTheme !== newTheme) {
      trackThemeChange(oldTheme, newTheme);
    }
  }, [theme]);

  // Listen for system theme changes when no localStorage preference is set
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('arthive_theme');
      if (!savedTheme) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => {
          setTheme(e.matches ? 'dark' : 'light');
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      }
    } catch (error) {
      console.error('Error setting up system theme listener:', error);
    }
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const value = {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;