/*
 * ArtHive Component Guidelines & Specifications
 * Component behavior, states, and implementation details
 * Generated: November 6, 2025
 */

/* ===========================================
   HEADER/NAVBAR COMPONENT SPEC
   ===========================================

   Purpose: Main navigation and user access point
   Location: All authenticated pages
   States: Default, Hover, Focus, Active

   STRUCTURE:
   ┌─────────────────────────────────────────────────┐
   │ [Logo] [Home] [Explore] [About] [Contact] [User] │
   └─────────────────────────────────────────────────┘

   BEHAVIOR:
   - Fixed positioning on scroll
   - Logo links to home page
   - Navigation items highlight current page
   - User dropdown shows on authenticated state
   - Responsive: Collapses to hamburger menu on mobile

   ACCESSIBILITY:
   - Keyboard navigation with Tab
   - Screen reader announcements
   - Focus management for dropdown
   - ARIA labels and roles

   RESPONSIVE BREAKPOINTS:
   - Desktop: Full navigation visible
   - Tablet (768px): Condensed navigation
   - Mobile (640px): Hamburger menu
*/

/* ===========================================
   PROFILE DROPDOWN COMPONENT SPEC
   ===========================================

   Purpose: User account access and theme toggle
   Trigger: Avatar button click
   States: Closed, Open, Item Hover, Item Focus, Item Active

   DIMENSIONS:
   - Width: 320px (var(--dropdown-width))
   - Header Height: 80px
   - Item Height: 48px
   - Border Radius: 12px (var(--dropdown-radius))

   STRUCTURE:
   ┌─────────────────────────────────────────┐
   │ ┌─────┐                                 │
   │ │Avatar│ User Name                      │
   │ │     │ user@email.com                  │
   │ └─────┘                                 │
   │ ────────────────────────────────────── │
   │ 🏠 Home              Ctrl+H             │
   │ 🧭 Explore           Ctrl+E             │
   │ 👤 My Profile        Ctrl+P             │
   │ 🛒 Cart              Ctrl+C             │
   │ ────────────────────────────────────── │
   │ ❓ Help Center                         │
   │ 🔔 What's new                          │
   │ ⌨️  Keyboard shortcuts  Ctrl+/          │
   │ 💾 Get desktop app                     │
   │ ⚙️  Settings                           │
   │ ────────────────────────────────────── │
   │ 🌙 Dark theme         [Toggle Switch]   │
   │ ────────────────────────────────────── │
   │ 🚪 Sign out                            │
   └─────────────────────────────────────────┘

   INTERACTION PATTERNS:
   - Click avatar to toggle dropdown
   - Click outside to close
   - Keyboard: Escape to close, Arrow keys to navigate
   - Hover highlights items
   - Focus shows focus ring

   THEME TOGGLE SPEC:
   - Switch component: 44px width, 24px height
   - Slider: 18px diameter, white background
   - Off state: Gray background (#d1d5db)
   - On state: Primary color (#6366f1)
   - Animation: 200ms cubic-bezier transition

   ACCESSIBILITY:
   - ARIA expanded on trigger button
   - Role="menu" on dropdown panel
   - Role="menuitem" on items
   - Keyboard navigation support
   - Screen reader announcements
   - Focus management

   VISUAL HIERARCHY:
   - Header: Gradient background, white text
   - Navigation items: Primary text, secondary icons
   - Theme toggle: Prominent placement
   - Sign out: Danger styling (red text)
   - Dividers: Subtle gradient lines
*/

/* ===========================================
   TOGGLE COMPONENT VARIANTS
   ===========================================

   SWITCH TOGGLE (Theme Toggle):
   - Purpose: Binary state changes (on/off)
   - States: Off, On, Disabled
   - Dimensions: 44×24px container, 18px slider
   - Colors: Off=neutral, On=primary brand
   - Animation: Smooth slider transition

   BUTTON TOGGLE (Alternative):
   - Purpose: Icon-based toggle actions
   - States: Default, Hover, Active, Selected
   - Dimensions: 40×40px (touch target)
   - Visual: Icon with background state
   - Use case: Alternative theme toggle in settings

   RECOMMENDATION: Use switch toggle for theme control
   - More accessible for screen readers
   - Clearer visual state indication
   - Consistent with system preferences
*/

/* ===========================================
   DISABLED/COMING SOON STATE SPEC
   ===========================================

   VISUAL TREATMENT:
   - Opacity: 0.5 (50% transparency)
   - Cursor: not-allowed
   - Background: Muted colors
   - Text: Muted text color
   - No hover effects

   INTERACTION:
   - Pointer events disabled
   - No click handlers
   - Keyboard navigation skips disabled items

   ACCESSIBILITY:
   - ARIA disabled="true"
   - Screen reader announces as disabled
   - Focus management excludes disabled items

   LABELING:
   - Text: "Coming Soon" or "Feature unavailable"
   - Tooltip: Explains when feature will be available
   - Icon: Clock or lock icon

   IMPLEMENTATION:
   .component--disabled {
     opacity: 0.5;
     cursor: not-allowed;
     pointer-events: none;
   }
*/

/* ===========================================
   AVATAR COMPONENT SPEC
   ===========================================

   VARIANTS:
   - Size: Small (32px), Medium (44px), Large (56px), X-Large (72px)
   - Type: Initials, Image, Icon, Gradient

   INITIALS AVATAR:
   - Background: Primary gradient
   - Text: White, bold, uppercase
   - Font size: Scales with avatar size
   - Fallback: First letter of name

   IMAGE AVATAR:
   - Circular crop
   - Object-fit: cover
   - Border: Subtle white border
   - Shadow: Soft drop shadow

   ACCESSIBILITY:
   - Alt text for images
   - ARIA label for initials
   - Focus indicators
   - High contrast support

   LIGHT/DARK VARIANTS:
   - Light theme: Vibrant gradients
   - Dark theme: Muted gradients
   - High contrast: Pure colors
*/

/* ===========================================
   CONTRAST REQUIREMENTS
   ===========================================

   TEXT CONTRAST RATIOS:
   - Primary text on background: 7:1 minimum (AAA)
   - Secondary text on background: 4.5:1 minimum (AA)
   - Large text (18pt+): 3:1 minimum (AA)

   COMPONENT CONTRAST:
   - Interactive elements: 3:1 minimum
   - Focus indicators: 3:1 minimum
   - Borders: 3:1 minimum

   TESTING TOOLS:
   - WebAIM Contrast Checker
   - Chrome DevTools Color Picker
   - axe DevTools accessibility audit

   IMPLEMENTATION:
   - Use design token variables
   - Test in both themes
   - Verify with color contrast tools
   - Document contrast ratios
*/

/* ===========================================
   STATE VISUAL SPECIFICATIONS
   ===========================================

   HOVER STATE:
   - Background: --bg-surface-hover
   - Transform: translateY(-1px) (subtle lift)
   - Transition: 150ms cubic-bezier
   - Shadow: Increased intensity

   FOCUS STATE:
   - Ring: 2px solid --border-focus
   - Ring offset: 2px
   - Background: --bg-surface-hover
   - No transform (accessibility)

   ACTIVE STATE:
   - Background: --bg-surface-active
   - Transform: translateY(0) (pressed effect)
   - Shadow: Reduced intensity

   DISABLED STATE:
   - Opacity: 0.5
   - Cursor: not-allowed
   - No interactions
   - Muted colors
*/

/* ===========================================
   ANIMATION SPECIFICATIONS
   ===========================================

   MICRO-INTERACTIONS:
   - Hover: 150ms ease-out
   - Focus: Instant (accessibility)
   - Active: 100ms ease-in
   - Toggle: 200ms cubic-bezier

   DROPDOWN ANIMATIONS:
   - Enter: 180ms cubic-bezier(0.16, 1, 0.3, 1)
   - Transform: scale(0.98) → scale(1)
   - Opacity: 0 → 1
   - Origin: top right

   REDUCED MOTION:
   - Respect prefers-reduced-motion
   - Disable animations when requested
   - Provide instant state changes
*/

/* ===========================================
   RESPONSIVE DESIGN SPEC
   ===========================================

   BREAKPOINTS:
   - Mobile: 0-639px
   - Tablet: 640-1023px
   - Desktop: 1024px+

   COMPONENT SCALING:
   - Padding: Reduce by 25% on mobile
   - Font size: Minimum 14px for readability
   - Touch targets: Minimum 44px
   - Spacing: Maintain proportions

   NAVIGATION COLLAPSE:
   - Desktop: Full horizontal nav
   - Tablet: Condensed with smaller labels
   - Mobile: Hamburger menu overlay
*/

/* ===========================================
   IMPLEMENTATION NOTES
   ===========================================

   CSS ARCHITECTURE:
   - Use CSS custom properties for theming
   - Component-specific CSS files
   - Utility classes for common patterns
   - BEM methodology for naming

   JAVASCRIPT PATTERNS:
   - React hooks for state management
   - Context API for theme state
   - Event delegation for performance
   - Keyboard event handling

   ACCESSIBILITY FIRST:
   - Semantic HTML structure
   - ARIA attributes and roles
   - Keyboard navigation support
   - Screen reader compatibility
   - Focus management
   - Color contrast compliance
*/