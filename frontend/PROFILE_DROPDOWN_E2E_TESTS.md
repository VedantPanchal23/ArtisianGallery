# ProfileDropdown E2E Test Scenarios

## Overview
These end-to-end test scenarios validate the ProfileDropdown component's functionality in real browser environments, focusing on user interactions, accessibility, and cross-browser compatibility.

## Test Environment Setup

### Prerequisites
- Browser: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Screen resolution: 1920x1080 (desktop), 375x667 (mobile)
- Network: Stable connection for theme persistence testing
- localStorage: Enabled and functional

### Test Data
```javascript
const testUser = {
  name: "John Doe",
  email: "john.doe@example.com"
};
```

## E2E Test Scenarios

### 1. Basic Dropdown Interaction
**Scenario**: User opens and closes the profile dropdown
**Steps**:
1. Navigate to page with ProfileDropdown
2. Click on profile avatar button
3. Verify dropdown panel appears with user info and menu items
4. Click avatar button again
5. Verify dropdown closes

**Expected Results**:
- Dropdown opens smoothly with animation
- User name and email display correctly
- All menu items visible
- Dropdown closes without animation lag

### 2. Keyboard Navigation
**Scenario**: User navigates dropdown using keyboard only
**Steps**:
1. Tab to profile avatar button
2. Press Enter to open dropdown
3. Use Arrow Down to navigate through menu items
4. Use Arrow Up to navigate backwards
5. Press Enter on "Settings" item
6. Verify navigation to settings page
7. Press Escape to close dropdown

**Expected Results**:
- Focus moves correctly through all interactive elements
- Visual focus indicators appear on focused items
- Enter activates menu items appropriately
- Escape closes dropdown and returns focus to avatar

### 3. Theme Toggle Persistence
**Scenario**: Dark mode preference persists across sessions
**Steps**:
1. Start with light theme active
2. Open dropdown and toggle "Dark theme" to ON
3. Verify immediate theme change (background, text colors)
4. Refresh page
5. Verify dark theme persists
6. Toggle back to light theme
7. Refresh and verify light theme persists

**Expected Results**:
- Theme changes apply immediately to dropdown and page
- localStorage contains correct theme value
- Theme persists across page refreshes
- System preference detection works on first load

### 4. Mobile Responsiveness
**Scenario**: Dropdown works correctly on mobile devices
**Steps**:
1. Resize browser to mobile viewport (375px width)
2. Open dropdown
3. Verify panel positioning and sizing
4. Scroll page while dropdown open
5. Verify dropdown stays positioned correctly
6. Close dropdown and verify no layout issues

**Expected Results**:
- Dropdown panel fits within viewport
- No horizontal scrolling required
- Panel repositions on scroll if needed
- Touch interactions work correctly

### 5. Accessibility Compliance
**Scenario**: Screen reader and keyboard-only navigation
**Steps**:
1. Enable screen reader (NVDA, JAWS, or VoiceOver)
2. Navigate to profile avatar using Tab
3. Verify screen reader announces "User menu, button, collapsed"
4. Press Enter to open dropdown
5. Verify screen reader announces menu and items
6. Navigate through items with Arrow keys
7. Verify each item announced correctly
8. Press Escape
9. Verify dropdown closes and focus returns

**Expected Results**:
- All ARIA labels present and correct
- Screen reader announces state changes
- Focus management works properly
- No accessibility violations in automated testing

### 6. Menu Item Actions
**Scenario**: All menu items perform correct actions
**Steps**:
1. Open dropdown
2. Click each navigation link
3. Verify correct page navigation
4. Open dropdown again
5. Click "Sign out"
6. Verify logout callback executed
7. Verify user redirected to login/home page

**Expected Results**:
- All links navigate to correct URLs
- Logout function called with proper event handling
- No JavaScript errors during navigation
- Loading states handled appropriately

### 7. Cross-Browser Compatibility
**Scenario**: Component works across different browsers
**Steps**:
1. Test in Chrome, Firefox, Safari, Edge
2. Open dropdown in each browser
3. Verify visual appearance matches design
4. Test keyboard navigation
5. Test theme toggle
6. Verify animations work smoothly

**Expected Results**:
- Consistent appearance across browsers
- All functionality works in each browser
- Animations perform similarly
- No browser-specific bugs

### 8. Error Handling
**Scenario**: Component handles edge cases gracefully
**Steps**:
1. Load component with missing user prop
2. Load component with invalid user data
3. Trigger logout with network error
4. Test with localStorage disabled
5. Test with JavaScript disabled (basic functionality)

**Expected Results**:
- No JavaScript errors thrown
- Graceful fallbacks for missing data
- Appropriate error messages displayed
- Component remains functional in degraded states

## Performance Benchmarks

### Animation Performance
- Dropdown open/close: < 100ms
- Theme toggle: < 50ms
- Keyboard navigation: < 16ms (60fps)

### Memory Usage
- Initial load: < 50KB additional JavaScript
- Runtime memory: < 10MB total for component
- No memory leaks during repeated open/close cycles

## Automated Testing Commands

```bash
# Run E2E tests with Cypress
npx cypress run --spec "cypress/integration/profile-dropdown.spec.js"

# Run accessibility tests with axe-core
npx cypress run --spec "cypress/integration/accessibility.spec.js"

# Run visual regression tests
npx cypress run --spec "cypress/integration/visual-regression.spec.js"
```

## Success Criteria

- [ ] All E2E scenarios pass in at least 2 major browsers
- [ ] Accessibility score > 95% (Lighthouse)
- [ ] Performance score > 90% (Lighthouse)
- [ ] No JavaScript errors in browser console
- [ ] Visual consistency across browsers and devices
- [ ] Keyboard navigation works without mouse
- [ ] Theme persistence works across sessions