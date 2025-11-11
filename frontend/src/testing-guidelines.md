# ArtHive Frontend Testing Guidelines

## Overview
This document provides practical testing guidelines for ensuring frontend alignment, dark mode functionality, and optimal user experience in ArtHive.

## 1. Visual Alignment Testing

### Grid System Verification
- **Check**: All spacing uses multiples of 4px (base unit)
- **Tool**: Browser DevTools ruler or design overlay
- **Pass Criteria**: No elements misaligned from 8px grid

### Component Alignment Checks
```javascript
// Automated alignment test example
describe('Component Alignment', () => {
  test('navbar elements align properly', () => {
    const navbar = screen.getByRole('navigation');
    const logo = within(navbar).getByAltText('ArtHive');
    const nav = within(navbar).getByRole('list');

    // Logo should be left-aligned
    expect(logo).toHaveStyle({ textAlign: 'left' });

    // Navigation should be right-aligned
    expect(nav).toHaveStyle({ justifyContent: 'flex-end' });
  });
});
```

### Responsive Breakpoint Testing
- **Mobile (320px-480px)**: Center content, 44px minimum touch targets
- **Tablet (481px-1023px)**: Balanced layout, readable text
- **Desktop (1024px+)**: Optimal space usage, clear hierarchy

## 2. Dark Mode Testing

### Theme Toggle Functionality
```javascript
// Theme toggle test
describe('Theme Toggle', () => {
  test('switches between light and dark themes', async () => {
    render(<App />);

    // Start in light theme
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');

    // Click theme toggle
    const toggle = screen.getByRole('button', { name: /toggle theme/i });
    await userEvent.click(toggle);

    // Should switch to dark theme
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');

    // Should persist to localStorage
    expect(localStorage.getItem('theme')).toBe('dark');
  });
});
```

### Visual Consistency Checks
- **Colors**: All components use CSS custom properties
- **Contrast**: Minimum 4.5:1 ratio for normal text
- **Gradients**: Appropriate intensity for each theme
- **Shadows**: Proper opacity adjustments

### Theme Persistence Testing
```javascript
describe('Theme Persistence', () => {
  test('maintains theme across page reloads', () => {
    // Set theme in localStorage
    localStorage.setItem('theme', 'dark');

    // Reload page (simulate)
    render(<App />);

    // Should maintain dark theme
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });
});
```

## 3. User Experience Testing

### Accessibility Testing Checklist

#### Keyboard Navigation
- [ ] Tab order follows logical sequence
- [ ] Focus indicators are visible (3:1 contrast)
- [ ] Keyboard shortcuts work (Enter, Space, Escape)
- [ ] Skip links present for screen readers

#### Screen Reader Support
- [ ] All images have descriptive alt text
- [ ] Form labels are properly associated
- [ ] ARIA labels provided where needed
- [ ] Semantic HTML structure maintained

#### Motion and Animation
- [ ] Respects `prefers-reduced-motion` setting
- [ ] Animations enhance rather than distract
- [ ] Loading states provide feedback
- [ ] Transitions are smooth (60fps)

### Performance Testing

#### Core Web Vitals
```javascript
// Performance test example
describe('Performance', () => {
  test('theme toggle responds quickly', async () => {
    const startTime = performance.now();

    const toggle = screen.getByRole('button', { name: /toggle theme/i });
    await userEvent.click(toggle);

    const endTime = performance.now();
    const responseTime = endTime - startTime;

    expect(responseTime).toBeLessThan(200); // 200ms threshold
  });
});
```

#### Memory Usage
- Bundle size: <500KB gzipped
- Runtime memory: <50MB typical usage
- CSS custom properties: <100 total
- Images: Optimized and lazy-loaded

## 4. Automated Testing Setup

### Unit Tests (Jest + React Testing Library)
```javascript
// ThemeContext test setup
import { render, screen } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

const TestComponent = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span>Current theme: {theme}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
};

describe('ThemeContext', () => {
  test('provides theme context to children', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByText(/Current theme:/)).toBeInTheDocument();
  });
});
```

### Visual Regression Tests (Playwright)
```javascript
// Visual regression test
import { test, expect } from '@playwright/test';

test.describe('Theme Visual Regression', () => {
  test('light theme matches baseline', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveScreenshot('homepage-light.png');
  });

  test('dark theme matches baseline', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('theme', 'dark');
      window.location.reload();
    });
    await expect(page).toHaveScreenshot('homepage-dark.png');
  });
});
```

### E2E Tests (Playwright)
```javascript
// End-to-end theme test
test.describe('Theme E2E', () => {
  test('theme persists across page navigation', async ({ page }) => {
    // Start on homepage
    await page.goto('/');

    // Switch to dark theme
    await page.click('[data-testid="theme-toggle"]');

    // Navigate to another page
    await page.click('text=Explore');

    // Theme should persist
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });
});
```

## 5. Manual Testing Procedures

### Daily Testing Checklist
- [ ] Visual alignment across all pages
- [ ] Theme toggle functionality
- [ ] Responsive behavior on different screen sizes
- [ ] Keyboard navigation and accessibility
- [ ] Performance on various devices
- [ ] Cross-browser compatibility

### Weekly Testing Checklist
- [ ] Full accessibility audit
- [ ] Performance benchmarking
- [ ] User feedback review
- [ ] Cross-browser testing on latest versions
- [ ] Mobile device testing

### Monthly Testing Checklist
- [ ] Visual regression testing
- [ ] Usability testing sessions
- [ ] Performance trend analysis
- [ ] Security vulnerability assessment
- [ ] Third-party dependency updates

## 6. Browser Compatibility Testing

### Primary Browsers
- **Chrome/Edge**: Full feature support, performance baseline
- **Firefox**: CSS Grid/Flexbox, custom properties
- **Safari**: Webkit properties, iOS behaviors

### Mobile Browsers
- **iOS Safari**: Touch events, viewport handling
- **Chrome Mobile**: Android gestures, performance
- **Samsung Internet**: Android-specific features

### Testing Tools
- BrowserStack for cross-browser testing
- Sauce Labs for automated browser testing
- LambdaTest for real device testing

## 7. Bug Reporting Template

### Required Information
```
**Title:** [Clear, descriptive summary]

**Severity:** [Critical/High/Medium/Low]

**Environment:**
- Browser: [Chrome/Firefox/Safari/Edge]
- OS: [Windows/macOS/Linux/iOS/Android]
- Device: [Desktop/Mobile/Tablet]
- Theme: [Light/Dark]

**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Screenshots/Videos:**
[Attach visual evidence]

**Console Errors:**
[Paste any error messages]

**Additional Context:**
[User impact, related issues, suggested fixes]
```

## 8. Performance Monitoring

### Key Metrics to Track
- First Contentful Paint (FCP): <1.5s
- Largest Contentful Paint (LCP): <2.5s
- First Input Delay (FID): <100ms
- Cumulative Layout Shift (CLS): <0.1

### Monitoring Tools
- Lighthouse CI for automated performance testing
- WebPageTest for real-world performance data
- Chrome User Experience Report for field data
- Google Analytics for user-centric metrics

## 9. User Research Integration

### Usability Testing Script
1. **Introduction**: Explain the purpose and get consent
2. **Scenario Setup**: Provide context for the task
3. **Task Execution**: Observe user completing tasks
4. **Follow-up Questions**: Gather feedback and insights
5. **Debrief**: Discuss overall experience

### Feedback Collection
- Post-task satisfaction ratings
- Heatmaps and click tracking
- Session recordings for analysis
- Follow-up surveys for detailed feedback

## 10. Continuous Improvement

### Regular Review Cycles
- **Daily**: Automated test results review
- **Weekly**: Manual testing checklist completion
- **Monthly**: Full audit and user feedback analysis
- **Quarterly**: Comprehensive testing strategy review

### Success Metrics
- Test coverage: >90% code coverage
- Bug detection rate: <5% production bugs
- User satisfaction: >4.5/5 rating
- Performance benchmarks: Meeting all targets

### Process Improvements
- Identify bottlenecks in testing process
- Automate repetitive manual tests
- Update test cases based on user feedback
- Train team on new testing techniques

---

## Quick Reference Commands

### Running Tests
```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Visual regression
npm run test:visual

# Accessibility audit
npm run test:a11y

# Performance tests
npm run test:perf
```

### Development Server
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Testing in Different Environments
```bash
# Test in different browsers
npm run test -- --browsers chrome,firefox,safari

# Test responsive breakpoints
npm run test:responsive

# Test accessibility
npm run test:a11y -- --reporter json
```

This guidelines document should be updated regularly as the project evolves and new testing requirements emerge.