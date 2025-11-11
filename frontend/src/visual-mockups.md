/*
 * ArtHive Visual Design Mockups & Specifications
 * Text-based representation of Figma frames and visual designs
 * Generated: November 6, 2025
 */

/* ===========================================
   FIGMA FRAME STRUCTURE
   ===========================================

   FILE ORGANIZATION:
   ├── Cover
   ├── Design Tokens
   ├── Components
   │   ├── Header/Navbar
   │   ├── Profile Dropdown
   │   ├── Buttons
   │   └── Form Elements
   ├── Pages
   │   ├── Landing Page
   │   ├── About Us
   │   └── Contact Us
   └── Prototypes
       ├── Theme Toggle Flow
       └── Navigation Flow

   FRAME SIZES:
   - Desktop: 1440×1024px (main design)
   - Tablet: 768×1024px
   - Mobile: 375×667px

   GRID SYSTEM:
   - 8px base unit
   - 12-column grid on desktop
   - 8-column grid on tablet
   - 4-column grid on mobile
*/

/* ===========================================
   DESIGN TOKENS FRAME (FIGMA)
   ===========================================

   LAYOUT: 3-column grid with token categories

   COLUMN 1: COLORS
   ┌─────────────────────────────────────┐
   │           COLOR PALETTE             │
   │                                     │
   │ Primary Brand:                      │
   │ ▓▓▓▓▓▓ 50   ▓▓▓▓▓▓ 100  ▓▓▓▓▓▓ 200 │
   │ ▓▓▓▓▓▓ 300  ▓▓▓▓▓▓ 400  ▓▓▓▓▓▓ 500 │
   │ ▓▓▓▓▓▓ 600  ▓▓▓▓▓▓ 700  ▓▓▓▓▓▓ 800 │
   │ ▓▓▓▓▓▓ 900                           │
   │                                     │
   │ Secondary Brand:                    │
   │ ▓▓▓▓▓▓ 50   ▓▓▓▓▓▓ 100  ▓▓▓▓▓▓ 200 │
   │ [Similar layout]                    │
   │                                     │
   │ Semantic Colors:                    │
   │ ▓▓▓▓▓▓ Success  ▓▓▓▓▓▓ Warning      │
   │ ▓▓▓▓▓▓ Error    ▓▓▓▓▓▓ Info         │
   └─────────────────────────────────────┘

   COLUMN 2: TYPOGRAPHY & SPACING
   ┌─────────────────────────────────────┐
   │           TYPOGRAPHY                │
   │                                     │
   │ Font Family: System UI              │
   │                                     │
   │ Size Scale:                         │
   │ XS: 12px ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
   │ SM: 14px ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
   │ Base:16px ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
   │ LG: 18px ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
   │                                     │
   │           SPACING                   │
   │ Scale: 4px base unit                │
   │ 1: 4px   2: 8px   3: 12px  4: 16px │
   │ 5: 20px  6: 24px  8: 32px  10:40px │
   │ 12:48px 16:64px 20:80px 24:96px     │
   └─────────────────────────────────────┘

   COLUMN 3: COMPONENTS & STATES
   ┌─────────────────────────────────────┐
   │         COMPONENT TOKENS            │
   │                                     │
   │ Buttons:                            │
   │ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
   │ │ Primary │ │Secondary│ │  Ghost  │ │
   │ └─────────┘ └─────────┘ └─────────┘ │
   │                                     │
   │ Toggle Switch:                      │
   │ ┌──────────────┐                    │
   │ │ ○───OFF      │                    │
   │ └──────────────┘                    │
   │ ┌──────────────┐                    │
   │ │ ────○─ON     │                    │
   │ └──────────────┘                    │
   │                                     │
   │ Avatar Sizes:                       │
   │ ○ ○ ○ ○                            │
   │ S M L XL                           │
   └─────────────────────────────────────┘
*/

/* ===========================================
   HEADER/NAVBAR MOCKUPS
   ===========================================

   LIGHT THEME - DESKTOP
   ┌─────────────────────────────────────────────────────────────────────────┐
   │ ┌─────┐  [ArtHive]               [Home] [Explore] [About] [Contact]    │
   │ │ ▓▓ │                                                                │
   │ │ ▓▓ │                           ┌─────────────────────────────────┐   │
   │ └─────┘                           │ ┌─────┐                         │   │
   │                                   │ │ DA  │  Dax Virani             │   │
   │                                   │ │     │  dax@example.com        │   │
   │                                   │ └─────┘                         │   │
   │                                   │ ────────────────────────────── │   │
   │                                   │ 🏠 Home              Ctrl+H     │   │
   │                                   │ 🧭 Explore           Ctrl+E     │   │
   │                                   │ 👤 My Profile        Ctrl+P     │   │
   │                                   │ 🛒 Cart              Ctrl+C     │   │
   │                                   │ ────────────────────────────── │   │
   │                                   │ ❓ Help Center                   │   │
   │                                   │ 🔔 What's new                   │   │
   │                                   │ ⌨️  Keyboard shortcuts  Ctrl+/   │   │
   │                                   │ 💾 Get desktop app              │   │
   │                                   │ ⚙️  Settings                    │   │
   │                                   │ ────────────────────────────── │   │
   │                                   │ 🌙 Dark theme         [○───]    │   │
   │                                   │ ────────────────────────────── │   │
   │                                   │ 🚪 Sign out                     │   │
   │                                   └─────────────────────────────────┘   │
   └─────────────────────────────────────────────────────────────────────────┘

   DARK THEME - DESKTOP
   ┌─────────────────────────────────────────────────────────────────────────┐
   │ ┌─────┐  [ArtHive]               [Home] [Explore] [About] [Contact]    │
   │ │ ▓▓ │                                                                │
   │ │ ░░ │                           ┌─────────────────────────────────┐   │
   │ └─────┘                           │ ┌─────┐                         │   │
   │                                   │ │ DA  │  Dax Virani             │   │
   │                                   │ │     │  dax@example.com        │   │
   │                                   │ └─────┘                         │   │
   │                                   │ ────────────────────────────── │   │
   │                                   │ 🏠 Home              Ctrl+H     │   │
   │                                   │ 🧭 Explore           Ctrl+E     │   │
   │                                   │ 👤 My Profile        Ctrl+P     │   │
   │                                   │ 🛒 Cart              Ctrl+C     │   │
   │                                   │ ────────────────────────────── │   │
   │                                   │ ❓ Help Center                   │   │
   │                                   │ 🔔 What's new                   │   │
   │                                   │ ⌨️  Keyboard shortcuts  Ctrl+/   │   │
   │                                   │ 💾 Get desktop app              │   │
   │                                   │ ⚙️  Settings                    │   │
   │                                   │ ────────────────────────────── │   │
   │                                   │ 🌙 Dark theme         [───○]    │   │
   │                                   │ ────────────────────────────── │   │
   │                                   │ 🚪 Sign out                     │   │
   │                                   └─────────────────────────────────┘   │
   └─────────────────────────────────────────────────────────────────────────┘

   MOBILE VIEW - LIGHT THEME
   ┌─────────────────────┐
   │ ┌─────┐ [ArtHive] ≡ │
   │ │ ▓▓ │              │
   │ └─────┘             │
   │ ────────────────── │
   │ 🏠 Home             │
   │ 🧭 Explore          │
   │ 👤 My Profile       │
   │ 🛒 Cart             │
   │ ────────────────── │
   │ ❓ Help Center      │
   │ 🔔 What's new      │
   │ ⌨️  Shortcuts       │
   │ 💾 Desktop app     │
   │ ⚙️  Settings        │
   │ ────────────────── │
   │ 🌙 Dark theme [○───]│
   │ ────────────────── │
   │ 🚪 Sign out        │
   └─────────────────────┘
*/

/* ===========================================
   COMPONENT STATE MOCKUPS
   ===========================================

   PROFILE DROPDOWN - HOVER STATE
   ┌─────────────────────────────────┐
   │ ┌─────┐                         │ ← Header (gradient background)
   │ │ DA  │  Dax Virani             │
   │ │     │  dax@example.com        │
   │ └─────┘                         │
   │ ────────────────────────────── │
   │ 🏠 Home              Ctrl+H     │ ← Normal state
   │ 🧭 Explore           Ctrl+E     │ ← Normal state
   │ 👤 My Profile        Ctrl+P     │ ← HOVERED: Light gray background
   │ 🛒 Cart              Ctrl+C     │ ← Normal state
   │ ────────────────────────────── │
   │ ❓ Help Center                   │ ← Normal state
   │ 🔔 What's new                   │ ← Normal state
   │ ⌨️  Keyboard shortcuts  Ctrl+/   │ ← Normal state
   │ 💾 Get desktop app              │ ← Normal state
   │ ⚙️  Settings                    │ ← Normal state
   │ ────────────────────────────── │
   │ 🌙 Dark theme         [○───]    │ ← Normal state
   │ ────────────────────────────── │
   │ 🚪 Sign out                     │ ← Normal state
   └─────────────────────────────────┘

   PROFILE DROPDOWN - FOCUS STATE
   ┌─────────────────────────────────┐
   │ ┌─────┐                         │
   │ │ DA  │  Dax Virani             │
   │ │     │  dax@example.com        │
   │ └─────┘                         │
   │ ────────────────────────────── │
   │ 🏠 Home              Ctrl+H     │
   │ 🧭 Explore           Ctrl+E     │
   │ 👤 My Profile        Ctrl+P     │ ← FOCUSED: Blue outline ring
   │ 🛒 Cart              Ctrl+C     │
   │ ────────────────────────────── │
   │ ❓ Help Center                   │
   │ 🔔 What's new                   │
   │ ⌨️  Keyboard shortcuts  Ctrl+/   │
   │ 💾 Get desktop app              │
   │ ⚙️  Settings                    │
   │ ────────────────────────────── │
   │ 🌙 Dark theme         [○───]    │
   │ ────────────────────────────── │
   │ 🚪 Sign out                     │
   └─────────────────────────────────┘

   PROFILE DROPDOWN - ACTIVE STATE
   ┌─────────────────────────────────┐
   │ ┌─────┐                         │
   │ │ DA  │  Dax Virani             │
   │ │     │  dax@example.com        │
   │ └─────┘                         │
   │ ────────────────────────────── │
   │ 🏠 Home              Ctrl+H     │
   │ 🧭 Explore           Ctrl+E     │
   │ 👤 My Profile        Ctrl+P     │ ← ACTIVE: Darker background, pressed
   │ 🛒 Cart              Ctrl+C     │
   │ ────────────────────────────── │
   │ ❓ Help Center                   │
   │ 🔔 What's new                   │
   │ ⌨️  Keyboard shortcuts  Ctrl+/   │
   │ 💾 Get desktop app              │
   │ ⚙️  Settings                    │
   │ ────────────────────────────── │
   │ 🌙 Dark theme         [○───]    │
   │ ────────────────────────────── │
   │ 🚪 Sign out                     │
   └─────────────────────────────────┘

   PROFILE DROPDOWN - DISABLED STATE
   ┌─────────────────────────────────┐
   │ ┌─────┐                         │
   │ │ DA  │  Dax Virani             │
   │ │     │  dax@example.com        │
   │ └─────┘                         │
   │ ────────────────────────────── │
   │ 🏠 Home              Ctrl+H     │ ← 50% opacity, no interactions
   │ 🧭 Explore           Ctrl+E     │ ← 50% opacity, no interactions
   │ 👤 My Profile        Ctrl+P     │ ← 50% opacity, no interactions
   │ 🛒 Cart              Ctrl+C     │ ← 50% opacity, no interactions
   │ ────────────────────────────── │
   │ ❓ Help Center                   │ ← 50% opacity, no interactions
   │ 🔔 What's new                   │ ← 50% opacity, no interactions
   │ ⌨️  Keyboard shortcuts  Ctrl+/   │ ← 50% opacity, no interactions
   │ 💾 Get desktop app              │ ← DISABLED: "Coming Soon" label
   │ ⚙️  Settings                    │ ← 50% opacity, no interactions
   │ ────────────────────────────── │
   │ 🌙 Dark theme         [○───]    │ ← Normal state (theme toggle always enabled)
   │ ────────────────────────────── │
   │ 🚪 Sign out                     │ ← Normal state
   └─────────────────────────────────┘
*/

/* ===========================================
   TOGGLE COMPONENT VARIATIONS
   ===========================================

   SWITCH TOGGLE (RECOMMENDED)
   ┌─────────────────────────────────────┐
   │ Toggle Switch Component Variants    │
   │                                     │
   │ Light Theme - OFF:                  │
   │ ┌──────────────┐                    │
   │ │ ○───OFF      │                    │
   │ └──────────────┘                    │
   │                                     │
   │ Light Theme - ON:                   │
   │ ┌──────────────┐                    │
   │ │ ────○─ON     │                    │
   │ └──────────────┘                    │
   │                                     │
   │ Dark Theme - OFF:                   │
   │ ┌──────────────┐                    │
   │ │ ○───OFF      │                    │
   │ └──────────────┘                    │
   │                                     │
   │ Dark Theme - ON:                    │
   │ ┌──────────────┐                    │
   │ │ ────○─ON     │                    │
   │ └──────────────┘                    │
   └─────────────────────────────────────┘

   BUTTON TOGGLE (ALTERNATIVE)
   ┌─────────────────────────────────────┐
   │ Button Toggle Variants              │
   │                                     │
   │ Light Theme - Default:              │
   │ ┌─────────┐                         │
   │ │   🌙    │                         │
   │ │ Dark    │                         │
   │ └─────────┘                         │
   │                                     │
   │ Light Theme - Active:               │
   │ ┌─────────┐                         │
   │ │   🌙    │                         │
   │ │ Dark    │                         │
   │ └─────────┘  ← Blue background      │
   │                                     │
   │ Dark Theme - Default:               │
   │ ┌─────────┐                         │
   │ │   ☀️    │                         │
   │ │ Light   │                         │
   │ └─────────┘                         │
   │                                     │
   │ Dark Theme - Active:                │
   │ ┌─────────┐                         │
   │ │   ☀️    │                         │
   │ │ Light   │                         │
   │ └─────────┘  ← Blue background      │
   └─────────────────────────────────────┘
*/

/* ===========================================
   AVATAR SPECIFICATIONS
   ===========================================

   AVATAR SIZE SCALE
   ┌─────────────────────────────────────┐
   │ Avatar Size Specifications          │
   │                                     │
   │ Small (32px):                       │
   │ ┌─────┐  Font: 12px, Weight: 700    │
   │ │  D  │                             │
   │ └─────┘                             │
   │                                     │
   │ Medium (44px):                      │
   │ ┌─────┐  Font: 16px, Weight: 700    │
   │ │  DA │                             │
   │ └─────┘                             │
   │                                     │
   │ Large (56px):                       │
   │ ┌─────┐  Font: 20px, Weight: 700    │
   │ │ DAX │                             │
   │ └─────┘                             │
   │                                     │
   │ X-Large (72px):                     │
   │ ┌─────┐  Font: 24px, Weight: 700    │
   │ │DAX V│                             │
   │ └─────┘                             │
   └─────────────────────────────────────┘

   AVATAR THEME VARIATIONS
   ┌─────────────────────────────────────┐
   │ Light Theme Avatar                  │
   │ ┌─────┐                             │
   │ │ ▓▓ │  Gradient: Blue to Purple    │
   │ │ ▓▓ │  Text: White                 │
   │ └─────┘  Border: Subtle white       │
   │                                     │
   │ Dark Theme Avatar                   │
   │ ┌─────┐                             │
   │ │ ░░ │  Gradient: Muted blue-purple │
   │ │ ░░ │  Text: White                 │
   │ └─────┘  Border: Subtle white       │
   │                                     │
   │ High Contrast Avatar                │
   │ ┌─────┐                             │
   │ │ ▓▓ │  Solid: Pure blue            │
   │ │ ▓▓ │  Text: White                 │
   │ └─────┘  Border: Black              │
   └─────────────────────────────────────┘
*/

/* ===========================================
   CONTRAST COMPLIANCE MOCKUPS
   ===========================================

   CONTRAST RATIO TESTING
   ┌─────────────────────────────────────┐
   │ Contrast Compliance Examples        │
   │                                     │
   │ Primary Text on Background:         │
   │ ████████████████████████████████    │
   │ Primary text (7:1 ratio)            │
   │                                     │
   │ Secondary Text on Background:       │
   │ ████████████████████████████████    │
   │ Secondary text (4.5:1 ratio)        │
   │                                     │
   │ Large Text on Background:           │
   │ ████████████████████████████████    │
   │ Large text (3:1 ratio)              │
   │                                     │
   │ Interactive Element Contrast:       │
   │ ┌─────────────────────────────┐     │
   │ │ Button text (3:1 ratio)     │     │
   │ └─────────────────────────────┘     │
   │                                     │
   │ Focus Indicator Contrast:           │
   │ ┌─────────────────────────────┐     │
   │ │                           [ ] │   │
   │ │ Button text             Focus│   │
   │ │                           [ ] │   │
   │ └─────────────────────────────┘     │
   └─────────────────────────────────────┘

   ACCESSIBILITY TESTING SCENARIOS:
   - Normal vision: All text readable
   - Low vision: Large text meets 3:1 ratio
   - Color blind: No color-only information
   - High contrast: Pure black/white combinations
   - Reduced motion: Instant state changes
*/

/* ===========================================
   RESPONSIVE DESIGN MOCKUPS
   ===========================================

   TABLET VIEW (768px)
   ┌─────────────────────────────────────┐
   │ ┌─────┐ [ArtHive]   [≡]             │
   │ │ ▓▓ │                              │
   │ └─────┘                             │
   │ ────────────────────────────────── │
   │ 🏠 Home  🧭 Explore  👤 Profile     │
   │ 🛒 Cart  ❓ Help     ⚙️  Settings    │
   │ ────────────────────────────────── │
   │ 🌙 Dark theme [○───]  🚪 Sign out   │
   └─────────────────────────────────────┘

   MOBILE VIEW (375px)
   ┌─────────────────────┐
   │ ┌─────┐ [≡]         │
   │ │ ▓▓ │              │
   │ └─────┘             │
   │ ────────────────── │
   │ 🏠 Home             │
   │ 🧭 Explore          │
   │ 👤 My Profile       │
   │ 🛒 Cart             │
   │ ────────────────── │
   │ ❓ Help Center      │
   │ 🔔 What's new      │
   │ ⌨️  Shortcuts       │
   │ 💾 Desktop app     │
   │ ⚙️  Settings        │
   │ ────────────────── │
   │ 🌙 Dark theme [○───]│
   │ ────────────────── │
   │ 🚪 Sign out        │
   └─────────────────────────────────────┘
*/

/* ===========================================
   PROTOTYPE FLOW SPECIFICATIONS
   ===========================================

   THEME TOGGLE INTERACTION FLOW:
   1. User clicks avatar → Dropdown opens
   2. User clicks theme toggle → Instant visual feedback
   3. Theme transition: 200ms smooth color change
   4. Dropdown stays open during transition
   5. Analytics event fired: theme_change
   6. localStorage updated: 'arthive_theme'

   KEYBOARD NAVIGATION FLOW:
   1. Tab to avatar button → Focus ring appears
   2. Enter/Space → Dropdown opens
   3. Arrow keys → Navigate menu items
   4. Enter on theme toggle → Theme changes
   5. Escape → Close dropdown
   6. Tab → Move to next focusable element

   MOBILE NAVIGATION FLOW:
   1. Tap hamburger menu → Slide-in navigation
   2. Tap theme toggle → Theme changes
   3. Tap outside → Close navigation
   4. Swipe gestures → Navigate sections
*/

/* ===========================================
   IMPLEMENTATION NOTES FOR FIGMA
   ===========================================

   COMPONENT LIBRARY STRUCTURE:
   - Atoms: Buttons, Inputs, Avatars, Toggles
   - Molecules: Dropdown, Navigation, Cards
   - Organisms: Header, Footer, Forms
   - Templates: Page layouts
   - Pages: Specific page designs

   DESIGN SYSTEM FEATURES:
   - Auto-layout for responsive design
   - Component variants for states
   - Shared styles for consistency
   - Grid and spacing overlays
   - Prototype interactions
   - Accessibility annotations

   EXPORT SPECIFICATIONS:
   - CSS custom properties for tokens
   - Component HTML structure
   - Responsive breakpoint guides
   - Color contrast ratios
   - Accessibility compliance notes
*/