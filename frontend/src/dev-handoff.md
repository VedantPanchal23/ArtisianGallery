/*
 * ArtHive Design System - Developer Handoff
 * Implementation guide and usage examples
 * Generated: November 6, 2025
 */

/* ===========================================
   QUICK START
   ===========================================

   1. Import design tokens:
   ```css
   @import './design-tokens.css';
   ```

   2. Use ThemeProvider in App.jsx:
   ```jsx
   import { ThemeProvider } from './context/ThemeContext';

   function App() {
     return (
       <ThemeProvider>
         <AuthProvider>
           <CartProvider>
             {/* Your app content */}
           </CartProvider>
         </AuthProvider>
       </ThemeProvider>
     );
   }
   ```

   3. Use theme hook in components:
   ```jsx
   import { useTheme } from './context/ThemeContext';

   function MyComponent() {
     const { theme, toggleTheme, isDark } = useTheme();
     // Component logic
   }
   ```
*/

/* ===========================================
   CSS TOKEN USAGE EXAMPLES
   ===========================================

   BASIC STYLING:
   ```css
   .my-component {
     background: var(--bg-surface);
     color: var(--text-primary);
     border: 1px solid var(--border-primary);
     border-radius: var(--radius-md);
     padding: var(--space-4);
   }

   .my-component:hover {
     background: var(--bg-surface-hover);
   }
   ```

   RESPONSIVE DESIGN:
   ```css
   .responsive-component {
     padding: var(--space-4);
   }

   @media (min-width: 768px) {
     .responsive-component {
       padding: var(--space-6);
     }
   }

   @media (min-width: 1024px) {
     .responsive-component {
       padding: var(--space-8);
     }
   }
   ```

   THEME-SPECIFIC STYLING:
   ```css
   .theme-aware-component {
     background: var(--bg-primary);
     color: var(--text-primary);
   }

   /* Dark theme overrides */
   [data-theme="dark"] .theme-aware-component {
     /* Additional dark theme styles if needed */
     box-shadow: var(--shadow-lg);
   }
   ```

   GRADIENT USAGE:
   ```css
   .gradient-background {
     background: var(--gradient-primary);
   }

   .gradient-text {
     background: var(--gradient-primary);
     -webkit-background-clip: text;
     -webkit-text-fill-color: transparent;
     background-clip: text;
   }
   ```
*/

/* ===========================================
   COMPONENT IMPLEMENTATION EXAMPLES
   ===========================================

   PROFILE DROPDOWN USAGE:
   ```jsx
   import ProfileDropdown from './components/ProfileDropdown';

   function Header({ user }) {
     return (
       <header className="header">
         <nav className="navbar">
           <div className="nav-container">
             <Link to="/" className="logo">ArtHive</Link>
             <div className="nav-links">
               <Link to="/">Home</Link>
               <Link to="/explore">Explore</Link>
               <Link to="/about">About Us</Link>
               <Link to="/contact">Contact Us</Link>
             </div>
             <ProfileDropdown
               user={user}
               onLogout={() => logout()}
             />
           </div>
         </nav>
       </header>
     );
   }
   ```

   AVATAR COMPONENT:
   ```jsx
   function Avatar({ user, size = 'medium' }) {
     const initials = getInitials(user?.name);

     return (
       <div
         className={`avatar avatar--${size}`}
         role="img"
         aria-label={`${user?.name} avatar`}
       >
         <span className="avatar-initials">{initials}</span>
       </div>
     );
   }

   // CSS
   .avatar {
     border-radius: 50%;
     background: var(--gradient-primary);
     color: var(--text-inverse);
     display: flex;
     align-items: center;
     justify-content: center;
     font-weight: var(--font-weight-bold);
   }

   .avatar--small { width: var(--avatar-size-sm); height: var(--avatar-size-sm); }
   .avatar--medium { width: var(--avatar-size-md); height: var(--avatar-size-md); }
   .avatar--large { width: var(--avatar-size-lg); height: var(--avatar-size-lg); }
   .avatar--xl { width: var(--avatar-size-xl); height: var(--avatar-size-xl); }
   ```

   TOGGLE SWITCH COMPONENT:
   ```jsx
   function ToggleSwitch({ checked, onChange, disabled = false }) {
     return (
       <button
         className={`toggle-switch ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''}`}
         onClick={() => !disabled && onChange(!checked)}
         disabled={disabled}
         aria-checked={checked}
         role="switch"
       >
         <span className="toggle-slider" />
       </button>
     );
   }

   // CSS
   .toggle-switch {
     width: var(--toggle-width);
     height: var(--toggle-height);
     background: var(--toggle-bg-off);
     border-radius: var(--toggle-radius);
     position: relative;
     transition: background var(--transition-normal);
     cursor: pointer;
   }

   .toggle-switch.checked {
     background: var(--toggle-bg-on);
   }

   .toggle-slider {
     width: var(--toggle-slider-size);
     height: var(--toggle-slider-size);
     background: var(--toggle-slider-bg);
     border-radius: 50%;
     position: absolute;
     top: 3px;
     left: 3px;
     transition: transform var(--transition-normal);
     box-shadow: var(--toggle-slider-shadow);
   }

   .toggle-switch.checked .toggle-slider {
     transform: translateX(calc(var(--toggle-width) - var(--toggle-slider-size) - 6px));
   }
   ```
*/

/* ===========================================
   ACCESSIBILITY IMPLEMENTATION
   ===========================================

   FOCUS MANAGEMENT:
   ```jsx
   function Dropdown({ isOpen, children }) {
     const dropdownRef = useRef();

     useEffect(() => {
       if (isOpen) {
         const focusableElements = dropdownRef.current?.querySelectorAll(
           'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
         );
         focusableElements?.[0]?.focus();
       }
     }, [isOpen]);

     return (
       <div
         ref={dropdownRef}
         role="menu"
         aria-hidden={!isOpen}
       >
         {children}
       </div>
     );
   }
   ```

   KEYBOARD NAVIGATION:
   ```jsx
   function useKeyboardNavigation(items, onSelect) {
     const [focusedIndex, setFocusedIndex] = useState(-1);

     const handleKeyDown = (event) => {
       switch (event.key) {
         case 'ArrowDown':
           event.preventDefault();
           setFocusedIndex(prev =>
             prev < items.length - 1 ? prev + 1 : 0
           );
           break;
         case 'ArrowUp':
           event.preventDefault();
           setFocusedIndex(prev =>
             prev > 0 ? prev - 1 : items.length - 1
           );
           break;
         case 'Enter':
         case ' ':
           event.preventDefault();
           if (focusedIndex >= 0) {
             onSelect(items[focusedIndex]);
           }
           break;
         case 'Escape':
           setFocusedIndex(-1);
           break;
       }
     };

     return { focusedIndex, handleKeyDown };
   }
   ```

   SCREEN READER SUPPORT:
   ```jsx
   function ThemeToggle({ checked, onChange }) {
     return (
       <button
         onClick={() => onChange(!checked)}
         aria-pressed={checked}
         aria-label={checked ? 'Switch to light theme' : 'Switch to dark theme'}
       >
         {checked ? '🌙' : '☀️'}
       </button>
     );
   }
   ```

   HIGH CONTRAST SUPPORT:
   ```css
   @media (prefers-contrast: high) {
     .component {
       border: 2px solid;
     }

     .interactive-element:focus {
       outline: 3px solid;
       outline-offset: 2px;
     }
   }
   ```
*/

/* ===========================================
   THEME IMPLEMENTATION PATTERNS
   ===========================================

   CONDITIONAL STYLING:
   ```jsx
   function ThemedComponent() {
     const { isDark, theme } = useTheme();

     return (
       <div className={`component ${isDark ? 'component--dark' : 'component--light'}`}>
         Current theme: {theme}
       </div>
     );
   }
   ```

   DYNAMIC STYLING:
   ```jsx
   function DynamicThemedComponent() {
     const { theme } = useTheme();

     const styles = {
       backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
       color: theme === 'dark' ? '#ffffff' : '#111827',
     };

     return <div style={styles}>Dynamic theming</div>;
   }
   ```

   CSS-IN-JS WITH THEME:
   ```jsx
   const styledComponent = styled.div`
     background: ${props => props.theme === 'dark' ? '#1a1a1a' : '#ffffff'};
     color: ${props => props.theme === 'dark' ? '#ffffff' : '#111827'};
     border-radius: 8px;
     padding: 16px;
   `;

   function StyledComponent() {
     const { theme } = useTheme();
     return <StyledComponent theme={theme}>Styled content</StyledComponent>;
   }
   ```
*/

/* ===========================================
   TESTING IMPLEMENTATION
   ===========================================

   UNIT TESTS FOR THEME CONTEXT:
   ```javascript
   // __tests__/ThemeContext.test.js
   import { render, screen, fireEvent } from '@testing-library/react';
   import { ThemeProvider, useTheme } from '../context/ThemeContext';

   function TestComponent() {
     const { theme, toggleTheme, isDark } = useTheme();
     return (
       <div>
         <span data-testid="theme">{theme}</span>
         <span data-testid="is-dark">{isDark.toString()}</span>
         <button onClick={toggleTheme} data-testid="toggle">Toggle</button>
       </div>
     );
   }

   test('theme toggles correctly', () => {
     render(
       <ThemeProvider>
         <TestComponent />
       </ThemeProvider>
     );

     expect(screen.getByTestId('theme')).toHaveTextContent('light');
     expect(screen.getByTestId('is-dark')).toHaveTextContent('false');

     fireEvent.click(screen.getByTestId('toggle'));

     expect(screen.getByTestId('theme')).toHaveTextContent('dark');
     expect(screen.getByTestId('is-dark')).toHaveTextContent('true');
   });
   ```

   E2E TESTS FOR THEME PERSISTENCE:
   ```javascript
   // __tests__/theme-persistence.test.js
   test('theme persists across page reloads', async ({ page }) => {
     // Start on light theme
     await page.goto('/');
     await expect(page.locator('[data-theme]')).toHaveAttribute('data-theme', 'light');

     // Toggle to dark theme
     await page.click('[aria-label="User menu"]');
     await page.click('[aria-label="Switch to dark theme"]');
     await expect(page.locator('[data-theme]')).toHaveAttribute('data-theme', 'dark');

     // Reload page
     await page.reload();
     await expect(page.locator('[data-theme]')).toHaveAttribute('data-theme', 'dark');
   });

   test('keyboard navigation works', async ({ page }) => {
     await page.goto('/');

     // Tab to avatar
     await page.keyboard.press('Tab');
     await expect(page.locator('[aria-expanded="false"]')).toBeFocused();

     // Open dropdown
     await page.keyboard.press('Enter');
     await expect(page.locator('[aria-expanded="true"]')).toBeFocused();

     // Navigate with arrow keys
     await page.keyboard.press('ArrowDown');
     await page.keyboard.press('ArrowDown');
     await page.keyboard.press('Enter');

     // Verify theme changed
     await expect(page.locator('[data-theme]')).toHaveAttribute('data-theme', 'dark');
   });
   ```
*/

/* ===========================================
   PERFORMANCE OPTIMIZATIONS
   ===========================================

   CSS CONTAINMENT:
   ```css
   .dropdown-panel {
     contain: layout style paint;
   }
   ```

   REACT OPTIMIZATION:
   ```jsx
   const ProfileDropdown = React.memo(({ user, onLogout }) => {
     // Component logic
   });
   ```

   LAZY LOADING:
   ```jsx
   const ProfileDropdown = lazy(() => import('./ProfileDropdown'));

   function App() {
     return (
       <Suspense fallback={<div>Loading...</div>}>
         <ProfileDropdown />
       </Suspense>
     );
   }
   ```
*/

/* ===========================================
   BROWSER SUPPORT & FALLBACKS
   ===========================================

   CSS CUSTOM PROPERTIES FALLBACK:
   ```css
   .component {
     background: #ffffff; /* Fallback */
     background: var(--bg-primary);
   }
   ```

   GRADIENT FALLBACK:
   ```css
   .gradient-bg {
     background: #667eea; /* Fallback */
     background: var(--gradient-primary);
   }
   ```

   JAVASCRIPT FEATURE DETECTION:
   ```javascript
   const supportsCSSVars = window.CSS && window.CSS.supports && window.CSS.supports('--test', 'value');

   if (!supportsCSSVars) {
     // Load fallback styles
     import('./fallback-styles.css');
   }
   ```
*/

/* ===========================================
   MAINTENANCE & UPDATES
   ===========================================

   TOKEN UPDATES:
   1. Update design-tokens.css
   2. Run visual regression tests
   3. Update component documentation
   4. Notify team of breaking changes

   COMPONENT UPDATES:
   1. Update component CSS
   2. Update TypeScript interfaces
   3. Update unit tests
   4. Update documentation

   THEME EXPANSION:
   - Add new color schemes
   - Implement system theme detection
   - Add theme customization options
   - Support for theme plugins
*/

/* ===========================================
   TROUBLESHOOTING GUIDE
   ===========================================

   THEME NOT APPLYING:
   - Check ThemeProvider is at app root
   - Verify data-theme attribute on documentElement
   - Check CSS custom property definitions

   STYLING CONFLICTS:
   - Use CSS specificity carefully
   - Avoid !important declarations
   - Use component-scoped CSS modules

   ACCESSIBILITY ISSUES:
   - Test with screen readers
   - Verify keyboard navigation
   - Check color contrast ratios
   - Test with high contrast mode

   PERFORMANCE ISSUES:
   - Minimize CSS custom property usage in animations
   - Use CSS containment where possible
   - Optimize React re-renders
   - Lazy load non-critical components
*/

/* ===========================================
   RESOURCES & REFERENCES
   ===========================================

   DESIGN SYSTEM RESOURCES:
   - Material Design: https://material.io/design
   - IBM Carbon: https://carbondesignsystem.com
   - Shopify Polaris: https://polaris.shopify.com

   ACCESSIBILITY GUIDELINES:
   - WCAG 2.1: https://www.w3.org/TR/WCAG21/
   - ARIA Authoring Practices: https://www.w3.org/WAI/ARIA/apg/

   CSS RESOURCES:
   - CSS Custom Properties: https://developer.mozilla.org/en-US/docs/Web/CSS/--*
   - CSS Containment: https://developer.mozilla.org/en-US/docs/Web/CSS/contain

   TESTING TOOLS:
   - Jest: https://jestjs.io
   - React Testing Library: https://testing-library.com/docs/react-testing-library/intro/
   - Playwright: https://playwright.dev
   - axe DevTools: https://www.deque.com/axe/
*/