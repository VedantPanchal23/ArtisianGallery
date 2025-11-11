# ProfileDropdown Component Documentation

## Overview
The ProfileDropdown component implements a comprehensive TradingView-style user menu with modern UI design, accessibility compliance, and full keyboard navigation support.

## Features
- **Visual Design**: 280-320px panel with gradient header matching TradingView aesthetics
- **Dark Mode Toggle**: Persistent theme switching with localStorage and system preference detection
- **Keyboard Navigation**: Full arrow key navigation, Enter activation, Escape dismissal
- **Accessibility**: WCAG compliant with ARIA roles, focus management, and screen reader support
- **Smooth Animations**: GPU-accelerated transforms and CSS transitions
- **Responsive Design**: Adapts to different screen sizes and orientations

## Usage

```jsx
import ProfileDropdown from './components/ProfileDropdown';

function UserProfile({ user, onLogout }) {
  return (
    <div>
      <ProfileDropdown
        user={user}
        onLogout={onLogout}
      />
    </div>
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `user` | Object | Yes | User object with `name` and `email` properties |
| `onLogout` | Function | Yes | Callback function called when user clicks "Sign out" |

## User Object Structure

```javascript
{
  name: "John Doe",
  email: "john@example.com"
}
```

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Move focus to avatar button |
| `Enter` or `Space` | Open/close dropdown |
| `Arrow Down` | Navigate to next menu item |
| `Arrow Up` | Navigate to previous menu item |
| `Enter` | Activate focused menu item |
| `Escape` | Close dropdown |
| `Tab` | Move focus out of dropdown |

## Menu Items

The dropdown contains the following menu sections:

### Navigation Links
- Home (`/`)
- Explore (`/explore`)
- My Profile (`/profile`)
- Cart (`/cart`)

### Support & Features
- Help Center (`/help`)
- What's new (`/whats-new`)
- Keyboard shortcuts (`/shortcuts`) - `Ctrl /`
- Get desktop app (`/desktop`)

### Settings
- Settings (`/settings`)
- Dark theme toggle (persistent)

### Account
- Sign out (calls `onLogout` prop)

## Theme Persistence

The component automatically:
- Detects system color scheme preference on first load
- Stores user theme choice in localStorage under `arthive_theme` key
- Applies theme immediately on toggle
- Persists theme across browser sessions

## Accessibility Features

- **ARIA Roles**: `menu`, `menuitem`, `menuitemcheckbox`
- **Focus Management**: Proper focus trapping and restoration
- **Screen Reader Support**: Descriptive labels and state announcements
- **Keyboard Support**: Full keyboard navigation without mouse
- **High Contrast**: Sufficient color contrast ratios
- **Semantic HTML**: Proper heading hierarchy and landmarks

## CSS Variables

The component uses CSS variables for theming:

```css
:root {
  --dropdown-bg: #ffffff;
  --dropdown-border: #e1e5e9;
  --dropdown-shadow: rgba(0, 0, 0, 0.1);
  --dropdown-hover: #f8f9fa;
  --text-primary: #1a1a1a;
  --text-secondary: #6c757d;
  --accent-primary: #2962ff;
  --danger-color: #dc3545;
}

[data-theme="dark"] {
  --dropdown-bg: #1e222d;
  --dropdown-border: #2a2e39;
  --dropdown-shadow: rgba(0, 0, 0, 0.3);
  --dropdown-hover: #2a2e39;
  --text-primary: #d1d4dc;
  --text-secondary: #787b86;
  --accent-primary: #2962ff;
  --danger-color: #ff6b6b;
}
```

## Testing

The component includes comprehensive unit tests covering:
- Avatar initials rendering
- Dropdown toggle functionality
- User information display
- Logout callback execution

Run tests with:
```bash
npm test
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Dependencies

- React 16.8+ (uses hooks internally)
- Lucide React (for icons)
- Modern browser with CSS Variables support