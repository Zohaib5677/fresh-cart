# SnapCart UI Redesign — Apple-Inspired Design System

## What This Plan Does

Applies the `design/DESIGN.md` design system to every customer-facing page and component of SnapCart. **Zero functionality changes.** All hooks, state, data-fetching, routing, auth, cart logic, and TypeScript types remain byte-for-byte identical. Only `className` strings, JSX layout structure, and CSS tokens are touched.

---

## Absolute Rules (Zero Tolerance)

> [!CAUTION]
> These rules apply to EVERY phase. Breaking any one of them is a hard failure.

1. **No logic changes.** Every `useState`, `useEffect`, `useMutation`, `useQuery`, event handler, callback, conditional render, and `navigate()` call stays exactly as-is.
2. **No import changes** for hooks, stores, data files, or routing utilities. Only add/change imports for icons or UI primitives where a visual replacement is needed.
3. **No TypeScript changes.** All interfaces, types, and props signatures are immutable.
4. **No token inlining.** All colors, shadows, and spacing come from CSS custom properties (`var(--...)`) or Tailwind tokens — never raw hex values in `className`.
5. **One file at a time.** Never edit two files simultaneously. Finish, verify, then move to next.
6. **Preserve all accessibility.** All `aria-*`, `role`, `disabled`, `type` attributes stay exactly as-is.
7. **Keep all shadcn/ui primitives.** `Button`, `Card`, `Badge`, `Input`, `Checkbox`, `Select`, `Sheet`, `Tabs`, `Avatar`, `Textarea`, `Slider`, `DropdownMenu`, `Accordion` — all retained. Only their `className` props change.
8. **Preserve all Framer Motion.** All `motion.div`, `AnimatePresence`, `variants`, `initial`, `animate`, `transition` props stay. Only `style` and `className` inside motion elements change where needed.

---

## Proposed Changes

---

### Phase 0 — Design Foundation (CSS Tokens + Config + Fonts)

**Goal:** Establish the complete design token layer. Every subsequent phase pulls from these tokens.

---

#### [MODIFY] [index.css](file:///d:/Ibrahim/Stipe%27s%20Fresh%20Cart/fresh-cart/src/index.css)

**What changes:**
- Replace `@import` line: swap `Playfair Display` for `DM Serif Display` (keep `Inter` unchanged)
- Rewrite `:root` CSS custom properties:
  - `--background`: `0 0% 100%` (pure white canvas)
  - `--card`: `0 0% 100%`
  - `--foreground`: `0 0% 9%` (maps to `#171717` ink)
  - `--border`: `0 0% 90%` (maps to `#e5e5e5` hairline)
  - `--input`: `0 0% 100%`
  - `--muted`: `40 20% 97%` (maps to `#fafaf5` canvas-warm)
  - `--muted-foreground`: `0 0% 45%` (maps to `#737373` ink-muted)
  - `--secondary`: `40 20% 97%` (canvas-warm)
  - `--secondary-foreground`: `0 0% 9%`
  - `--radius`: `1rem` (16px → rounded-lg = product cards)
  - Keep `--primary`, `--primary-foreground`, `--destructive`, `--accent`, `--warning` values intact (logic depends on them)
- Add new custom properties:
  ```css
  --canvas-warm: 40 20% 97%;           /* #fafaf5 */
  --canvas-parchment: 40 20% 96%;      /* #f5f5f0 */
  --surface-dark: 0 0% 10%;            /* #1a1a1a */
  --surface-black: 0 0% 0%;            /* #000000 */
  --ink: 0 0% 9%;                      /* #171717 */
  --ink-secondary: 0 0% 25%;           /* #404040 */
  --ink-muted: 0 0% 45%;               /* #737373 */
  --ink-faint: 0 0% 64%;               /* #a3a3a3 */
  --on-dark: 0 0% 100%;                /* #ffffff */
  --on-dark-muted: 0 0% 83%;           /* #d4d4d4 */
  --hairline: 0 0% 90%;                /* #e5e5e5 */
  --hairline-soft: 0 0% 94%;           /* #f0f0f0 */
  --hairline-dark: 0 0% 20%;           /* #333333 */
  --primary-subtle: 152 80% 96%;       /* #ecfdf5 */
  --shadow-card: 0 1px 3px rgba(0,0,0,0.04);
  --shadow-card-hover: 0 4px 16px rgba(0,0,0,0.08);
  --shadow-product-image: 0 4px 24px rgba(0,0,0,0.08);
  --shadow-sticky: 0 -1px 12px rgba(0,0,0,0.06);
  --shadow-modal: 0 16px 48px rgba(0,0,0,0.16);
  --shadow-dropdown: 0 4px 24px rgba(0,0,0,0.12);
  --transition-fast: 150ms cubic-bezier(0.4,0,0.2,1);
  --transition-default: 200ms cubic-bezier(0.4,0,0.2,1);
  --transition-smooth: 300ms cubic-bezier(0.4,0,0.2,1);
  ```
- Update `@layer base → body`: change font-family line to `'Inter', system-ui, sans-serif` (same, already correct)
- Update `@layer base → h1, h2, h3`: change from `'Playfair Display'` to `'DM Serif Display'`
- **Remove** the `--gradient-hero`, `--gradient-card`, `--gradient-accent` custom properties (keep the variables defined but set to `none` — some components may reference them but we will replace those at the component level)
- **Replace** the `.gradient-hero` utility to use the new surface-dark instead of the green gradient
- Add new utilities:
  ```css
  .canvas-warm { background-color: hsl(var(--canvas-warm)); }
  .surface-dark { background-color: hsl(var(--surface-dark)); }
  .surface-black-bg { background-color: hsl(var(--surface-black)); }
  .text-on-dark { color: hsl(var(--on-dark)); }
  .text-on-dark-muted { color: hsl(var(--on-dark-muted)); }
  .shadow-card { box-shadow: var(--shadow-card); }
  .shadow-card-hover { box-shadow: var(--shadow-card-hover); }
  .shadow-modal { box-shadow: var(--shadow-modal); }
  .transition-fast { transition: all var(--transition-fast); }
  .transition-smooth { transition: all var(--transition-smooth); }
  ```

**What must NOT change:**
- `@tailwind base; @tailwind components; @tailwind utilities;` directives
- `.dark` theme block (keep dark mode variables — they're used by shadcn internals)
- All keyframe animations (`float`, `accordion-down/up`, `fade-in`, `slide-in`, `scale-in`)
- `--sidebar-*` variables (used by admin dashboard)
- `--badge-top-selling`, `--badge-exclusive`, `--badge-promo` variables

---

#### [MODIFY] [tailwind.config.ts](file:///d:/Ibrahim/Stipe%27s%20Fresh%20Cart/fresh-cart/tailwind.config.ts)

**What changes:**
- `fontFamily.display`: change `['Playfair Display', 'serif']` → `['DM Serif Display', 'Georgia', 'serif']`
- Add `fontFamily.serif` entry: `['DM Serif Display', 'Georgia', 'serif']`
- Add new color tokens that map to the new CSS variables:
  ```ts
  'canvas-warm': 'hsl(var(--canvas-warm))',
  'canvas-parchment': 'hsl(var(--canvas-parchment))',
  'surface-dark': 'hsl(var(--surface-dark))',
  'surface-black': 'hsl(var(--surface-black))',
  'ink': 'hsl(var(--ink))',
  'ink-secondary': 'hsl(var(--ink-secondary))',
  'ink-muted': 'hsl(var(--ink-muted))',
  'ink-faint': 'hsl(var(--ink-faint))',
  'on-dark': 'hsl(var(--on-dark))',
  'on-dark-muted': 'hsl(var(--on-dark-muted))',
  'hairline': 'hsl(var(--hairline))',
  'hairline-soft': 'hsl(var(--hairline-soft))',
  'primary-subtle': 'hsl(var(--primary-subtle))',
  ```
- Add new box-shadow tokens:
  ```ts
  'card': 'var(--shadow-card)',
  'card-hover': 'var(--shadow-card-hover)',
  'product-img': 'var(--shadow-product-image)',
  'sticky': 'var(--shadow-sticky)',
  'modal': 'var(--shadow-modal)',
  'dropdown': 'var(--shadow-dropdown)',
  ```
- Update `borderRadius`:
  ```ts
  'none': '0px',
  'xs': '4px',
  'sm': '8px',
  'md': '12px',
  'lg': '16px',
  'xl': '20px',
  '2xl': '24px',
  'pill': '9999px',
  'full': '9999px',
  // Keep existing lg/md/sm that use var(--radius) for shadcn compat
  ```

**What must NOT change:**
- `content` array
- `darkMode` setting
- All existing color tokens (`primary`, `secondary`, `muted`, `accent`, `destructive`, `popover`, `card`, `success`, `warning`, `badge`, `sidebar`)
- All `keyframes` and `animation` entries
- `plugins` array

---

#### [MODIFY] [index.html](file:///d:/Ibrahim/Stipe%27s%20Fresh%20Cart/fresh-cart/index.html)

**What changes:**
- Replace the Google Fonts `@import` URL to include `DM+Serif+Display:ital,wght@0,400` alongside Inter:
  ```
  https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@300;400;500;600;700;800&display=swap
  ```
  Add as a `<link rel="preconnect">` + `<link rel="stylesheet">` in `<head>` (more performant than CSS @import)
- Update `<meta name="theme-color">` from `#16a34a` to `#000000` (global nav is now black)

**What must NOT change:**
- All other meta tags, OG tags, analytics comments, favicon links, `<div id="root">`, script tag

---

### Phase 1 — Global Shell (Header + Footer + FloatingNav)

**Dependency:** Phase 0 must be complete first.

---

#### [MODIFY] [Header.tsx](file:///d:/Ibrahim/Stipe%27s%20Fresh%20Cart/fresh-cart/src/components/layout/Header.tsx)

**What changes — visual only:**
- `<header>` outer: `bg-card/95 backdrop-blur-md border-b border-border` → `bg-surface-black border-b border-hairline-dark`
- Logo text span: `text-foreground` → `text-on-dark`
- Search bar wrapper `<div>`: add `max-w-sm` on desktop for tighter search
- `SearchAutocomplete` — no className change here (handled in Phase 3)
- Wishlist `Button`: `variant="ghost"` stays, add `text-on-dark hover:text-primary` 
- User `DropdownMenuTrigger Button`: add `text-on-dark hover:text-primary`
- Cart `Button`: add `text-on-dark hover:text-primary`
- Cart `Badge`: stays `bg-primary text-primary-foreground` (no change)
- Mobile menu toggle `Button`: add `text-on-dark`
- **Category nav strip** (currently inside the same header `<div>`):
  - Move category nav to its own `<div>` with `bg-background border-b border-hairline` (white strip below the black nav)
  - Category link active state: keep `bg-primary/10 text-primary font-semibold border-b-2 border-primary` 
  - Inactive: `text-ink-muted hover:text-ink`
  - "All Products" button: same inactive styling
- Mobile menu panel: `bg-card` → `bg-background border-t border-hairline`

**What must NOT change:**
- All state (`isMenuOpen`), `useCartStore`, `useAuth`, `useWishlist` hooks
- All `Link` destinations, `navigate`, `signOut` calls
- `DropdownMenu` content and all its `DropdownMenuItem` contents
- `SearchAutocomplete` component and its `onClose` prop
- `categories` import and map logic
- `activeCategory` URL param logic
- `AnimatePresence` / `motion.div` animation on mobile menu

---

#### [MODIFY] [Footer.tsx](file:///d:/Ibrahim/Stipe%27s%20Fresh%20Cart/fresh-cart/src/components/layout/Footer.tsx)

**What changes — visual only:**
- Outer `<footer>`: `bg-foreground text-background/90` → `bg-surface-dark text-on-dark-muted`
- Newsletter section `<div>`: remove `gradient-hero` class → `bg-surface-dark border-b border-hairline-dark`
- Newsletter `<h3>`: keep `font-display` (now renders in DM Serif Display), `text-primary-foreground` → `text-on-dark`
- Newsletter `<p>`: `text-primary-foreground/80` → `text-on-dark-muted`
- Newsletter `Input`: `bg-background/10 border-background/20 text-primary-foreground placeholder:text-primary-foreground/60` → `bg-white/10 border-white/20 text-on-dark placeholder:text-on-dark-muted`
- Newsletter `Button`: `variant="secondary"` → `variant="default"` with explicit `className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-pill"`
- Brand `<span>` SnapCart text: `text-background` → `text-on-dark`
- Brand `<p>`: `text-background/70` → `text-on-dark-muted`
- Social icon links: `text-background/70 hover:text-primary` → `text-on-dark-muted hover:text-primary`
- Column headings `<h4>`: `text-background` → `text-on-dark`
- All link `<li>` items: `text-background/70 hover:text-primary` → `text-on-dark-muted hover:text-primary`
- Contact `<li>` items: `text-background/70` → `text-on-dark-muted`
- Bottom bar divider: `border-background/10` → `border-hairline-dark`
- Bottom bar text `<p>`: `text-background/60` → `text-ink-faint` (maps to `text-on-dark-muted` on dark bg, so use explicit `text-white/40`)
- Payment images opacity: keep `opacity-70`

**What must NOT change:**
- All `Link` components and their `to` destinations
- All social icon `<a href="#">` placeholders
- All contact details (address, phone, email)
- Form structure and `Input` / `Button` elements

---

#### [MODIFY] [FloatingNav.tsx](file:///d:/Ibrahim/Stipe%27s%20Fresh%20Cart/fresh-cart/src/components/layout/FloatingNav.tsx)

**What changes — visual only:**
- The floating bottom-right buttons: change `variant="secondary"` back button to `className="rounded-full shadow-modal h-12 w-12 bg-surface-dark text-on-dark border border-hairline-dark hover:bg-surface-dark/80"`
- Home button: keep `className="rounded-full shadow-modal h-12 w-12"` with primary color (already correct)
- The overall container `className`: add `md:flex` to hide on desktop, `hidden md:hidden sm:flex` — wait, actually the current component is a simple back/home floating button. Keep its logic, just update colors as above.

**What must NOT change:**
- `useNavigate`, `useLocation` hooks
- `isHome`, `isAdmin` conditional render logic
- `navigate(-1)` and `navigate('/')` calls
- `AnimatePresence` / `motion.div` animation config

---

### Phase 2 — Home Page Sections

**Dependency:** Phase 0 + Phase 1 must be complete.

---

#### [MODIFY] [FlatDiscountBanner.tsx](file:///d:/Ibrahim/Stipe%27s%20Fresh%20Cart/fresh-cart/src/components/home/FlatDiscountBanner.tsx)

**What changes — visual only:**
- Outer `<div>` inside `motion.div`: `bg-gradient-to-r from-amber-500 via-orange-500 to-red-500` → `bg-primary` (solid emerald)
- `<p>` banner text: keep `text-white font-bold text-lg md:text-xl`
- `% OFF` badge span: `bg-white/20` → `bg-white/25`, `font-mono font-bold` → `font-bold text-primary-foreground`
- `Link → Button`: `variant="secondary" className="bg-white text-orange-600 hover:bg-white/90 font-semibold"` → `className="bg-white text-primary hover:bg-white/90 font-semibold rounded-pill"`
- Remove the two `motion.div` decorative spinning `Sparkles` elements (visual noise)
- Keep the dismiss `button` with `text-white/70 hover:text-white`

**What must NOT change:**
- `settings`, `dismissed` state
- `fetchSettings` async Supabase call
- `if (!settings || dismissed) return null` guard
- `AnimatePresence` wrapper and `motion.div` entrance/exit animations
- `setDismissed(true)` on dismiss button click

---

#### [MODIFY] [HeroSection.tsx](file:///d:/Ibrahim/Stipe%27s%20Fresh%20Cart/fresh-cart/src/components/home/HeroSection.tsx)

**What changes — visual only:**
- `<section>` style: replace the `background: 'linear-gradient(135deg, #064e3b ...)'` inline style → `background: 'hsl(0 0% 10%)'` (surface-dark #1a1a1a — clean dark tile)
- Remove or neutralize the two decorative orb `motion.div` elements (the radial-gradient orbs) — set their `background` to `transparent` so the code stays but they're invisible, OR simplify: set their opacity to 0
- Keep the subtle grid overlay `<div>` (the `backgroundImage` lines pattern) — it's subtle and good
- Keep the 3 floating decorative dots `motion.div` elements
- Left column headline `motion.h1`: remove inline `style={{ color: '#ffffff' }}` → add `className` with `text-on-dark` (use `text-white`)
- Animated shimmer `<span>` inside h1: this uses `WebkitBackgroundClip: 'text'` with a gradient — this is fine to keep as-is (it's the product highlight text)
- The label badge above headline (`inline-flex...`): update `style.background` to `rgba(255,255,255,0.1)`, `style.border` to `rgba(255,255,255,0.15)`, `style.color` to `#d4d4d4` (on-dark-muted)
- Lead paragraph: `style={{ color: 'rgba(255,255,255,0.72)' }}` → keep as-is
- "Shop Now" `Button` inline styles: update `background` to `linear-gradient(135deg, #059669, #047857)`, `color` to `#ffffff` (was `#022c22` — dark on light green, now white on deeper green)
- "Learn More" / "Explore" button: keep its ghost styles
- Right column hero image: keep the floating animation, the glow div, the image src
- Floating delivery card: update `background` to `rgba(0,0,0,0.85)`, `border` to `rgba(5,150,105,0.3)` (emerald border, not green-tinted)
- Trust badges grid: update item `background` from `rgba(255,255,255,0.09)` → `rgba(255,255,255,0.06)`, `border` to `rgba(255,255,255,0.08)` for more subtlety

**What must NOT change:**
- `useMotionValue`, `useSpring`, `handleMouseMove` mouse parallax logic
- All `Link` components and their destinations
- `containerVariants`, `fadeUp` animation variant objects
- All `motion.div` and `motion.img` with their `animate`, `transition`, `whileHover`, `whileTap` props
- Trust badge data array and map
- `<style>` block with `@keyframes shimmer`

---

#### [MODIFY] [CategorySection.tsx](file:///d:/Ibrahim/Stipe%27s%20Fresh%20Cart/fresh-cart/src/components/home/CategorySection.tsx)

**What changes — visual only:**
- Section `<section>`: `bg-secondary/30` → `bg-canvas-warm` (warm parchment section)
- Section inner padding: `py-12` → `py-16`
- Section title `<h2>`: `font-display text-3xl font-bold text-foreground` → `font-display text-3xl font-bold text-ink` (DM Serif Display will render automatically)
- Section subtitle `<p>`: `text-muted-foreground` → `text-ink-muted`
- Category grid: `grid-cols-2 md:grid-cols-5` → `grid-cols-3 md:grid-cols-5 lg:grid-cols-10` using gap-4. Actually keep the `grid-cols-2 md:grid-cols-5` for correct column count.
- For each category item, **replace the circular image approach** with a card-style pill:
  - Remove `<div className="relative mx-auto w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden ...">` and its inner `<img>` + overlay
  - Replace with: `<div className="flex flex-col items-center gap-3 p-4 bg-background rounded-xl border border-hairline shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-smooth group-hover:border-primary">`
  - Inside: category icon as `<span className="text-3xl">{category.icon}</span>` (emoji)
  - Category name: `<p className="text-xs font-semibold text-ink group-hover:text-primary transition-fast text-center">`
- Keep the `categoryImages` object defined but it won't be used in the new layout (leave it in place — don't remove, to avoid any potential future use)

**What must NOT change:**
- `categories` import from `@/data/products`
- All `Link` components and `to={/products?category=${category.id}}` destinations
- All `motion.div` wrapper animation (opacity/y entrance)
- The `categoryImages` record (keep defined but don't use in JSX)

---

#### [MODIFY] [ProductSection.tsx](file:///d:/Ibrahim/Stipe%27s%20Fresh%20Cart/fresh-cart/src/components/home/ProductSection.tsx)

**What changes — visual only:**
- Section `<section>`: `py-12` → `py-16`
- Section container `<div>`: keep `container mx-auto px-4`
- Header row: keep `flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8`
- `<h2>` title: `font-display text-2xl md:text-3xl font-bold text-foreground` → `font-display text-2xl md:text-3xl font-bold text-ink` (DM Serif Display auto)
- Badge span: `bg-primary/10 text-primary text-xs font-semibold rounded-full` → `bg-primary-subtle text-primary text-xs font-semibold rounded-pill px-3 py-1 uppercase tracking-wide`
- Subtitle `<p>`: `text-muted-foreground` → `text-ink-muted`
- "View All" `Button`: `variant="outline"` → add explicit `className="rounded-pill border-hairline text-ink hover:text-primary hover:border-primary transition-fast"`
- Product grid: `grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6` → `grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6` (uniform gap)

**What must NOT change:**
- `ProductSectionProps` interface
- `viewAllLink`, `badge`, `title`, `subtitle`, `products` props usage
- `Link to={viewAllLink}` component
- `ProductCard` map

---

#### [MODIFY] [PromoBanner.tsx](file:///d:/Ibrahim/Stipe%27s%20Fresh%20Cart/fresh-cart/src/components/home/PromoBanner.tsx)

**What changes — visual only:**
- Section `<section>`: `py-12` → `py-16`
- Promo 1 card `motion.div`: `bg-gradient-to-br from-success/20 to-success/5` → `bg-surface-dark` (dark card)
- Promo 1 `<span>` label: `text-success` → `text-primary` (emerald on dark)
- Promo 1 `<h3>`: `text-foreground` → `text-on-dark font-display`
- Promo 1 `<p>`: `text-muted-foreground` → `text-on-dark-muted`
- Promo 1 `Button`: keep `bg-primary hover:bg-primary/90 text-primary-foreground rounded-pill`
- Promo 2 card `motion.div`: `bg-gradient-to-br from-warning/20 to-warning/5` → `bg-[#222222]` (surface-dark-2, slightly different)
- Promo 2 `<span>` label: `text-warning` → `text-accent` (amber, stays warm signal)
- Promo 2 `<h3>`: `text-foreground` → `text-on-dark font-display`
- Promo 2 `<p>`: `text-muted-foreground` → `text-on-dark-muted`
- Promo 2 `Button`: `bg-warning hover:bg-warning/90 text-warning-foreground` → `bg-primary hover:bg-primary/90 text-primary-foreground rounded-pill` (single accent color rule)
- Add `p-10` or `p-8` padding to both cards (ensure generous breathing room)

**What must NOT change:**
- `Link to` destinations (`/products?category=kitchen`, `/products?category=general`)
- Both `motion.div` entrance animations (`initial`, `whileInView`, `viewport`, `transition`)
- `Clock` icon and its span text

---

### Phase 3 — Product Components

**Dependency:** Phase 0 must be complete.

---

#### [MODIFY] [ProductCard.tsx](file:///d:/Ibrahim/Stipe%27s%20Fresh%20Cart/fresh-cart/src/components/products/ProductCard.tsx)

**What changes — visual only:**
- Outer `motion.div`: keep all Framer Motion props
- `Card`: `border-0 shadow-md hover:shadow-product` → `border border-hairline-soft shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-smooth rounded-lg bg-background`
- Wishlist `Button`: `bg-background/80 backdrop-blur-sm hover:bg-background` → `bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm rounded-full` (keep `rounded-full` and size-icon)
- **Image container** `<div>`: `aspect-square overflow-hidden bg-secondary/30` → `aspect-square overflow-hidden bg-canvas-warm rounded-md m-3` (warm pedestal, internal padding via margin on container, or use `p-4` inside)
  - Actually: make it `relative aspect-square bg-canvas-warm rounded-md mx-3 mt-3 flex items-center justify-center`
  - `<img>` inside: `w-full h-full object-cover group-hover:scale-105 transition-transform duration-500` → `w-full h-full object-contain group-hover:scale-102 transition-transform duration-500 p-3`
- Badge position: `absolute top-3 left-3` → `absolute top-2 left-2` (now relative to card, not image since image has mx-3)
  - Actually keep at `absolute top-3 left-3 z-10` — they float over the image container
- Badge styling: Top Selling `bg-badge-top-selling text-accent-foreground` → add `rounded-xs text-xs uppercase tracking-wide`
- Category `<p>`: `text-xs text-muted-foreground uppercase tracking-wide mb-1` → `text-xs text-ink-muted uppercase tracking-widest mb-1`
- Product name `<h3>`: `font-semibold text-foreground hover:text-primary` → `font-semibold text-ink hover:text-primary text-sm line-clamp-2`
- Unit `<p>`: `text-sm text-muted-foreground mb-2` → `text-xs text-ink-muted mb-2`
- Star `className`: `fill-warning text-warning` → keep (amber stars, correct)
- Rating count span: `text-sm text-muted-foreground` → `text-xs text-ink-muted`
- Price span: `text-lg font-bold text-foreground` → `text-base font-bold text-ink` (price-card weight)
- Original price span: `text-sm text-muted-foreground line-through` → `text-xs text-ink-muted line-through`
- Quantity stepper `<div>`: `flex items-center border border-border rounded-md` → `flex items-center border border-hairline rounded-pill bg-surface-pearl`
- Quantity `Button`s: keep `variant="ghost" size="icon" h-8 w-8`
- Add-to-cart `Button`: `flex-1 bg-primary hover:bg-primary/90 text-primary-foreground` → `flex-1 bg-primary hover:bg-primary-hover text-primary-foreground rounded-pill` + add `size="sm"` (keep)

**What must NOT change:**
- `useState` for `quantity`, `isHovered`
- `useCartStore`, `useWishlist` hooks
- `handleAddToCart` function and `toast.success` call
- `motion.div` animation props
- All `Link to={/product/${product.id}}` wrappers
- `onMouseEnter`/`onMouseLeave` handlers
- All badge conditional renders (`product.isTopSelling`, `product.isExclusive`, `product.discountPercentage`)
- `setQuantity(Math.max(1, quantity - 1))` and `setQuantity(quantity + 1)` handlers

---

#### [MODIFY] [SearchAutocomplete.tsx](file:///d:/Ibrahim/Stipe%27s%20Fresh%20Cart/fresh-cart/src/components/search/SearchAutocomplete.tsx)

**What changes — visual only:**
- `Input`: `pl-10 pr-10 h-11 w-full bg-secondary/50 border-0 focus-visible:ring-primary` → `pl-10 pr-10 h-10 w-full bg-white/10 border border-white/20 text-on-dark placeholder:text-on-dark-muted focus-visible:ring-primary rounded-pill` 
  - Note: on dark nav, input needs light-on-dark styling. But the search is also used on mobile below the header (white bg context). Use `bg-muted border-hairline text-ink placeholder:text-ink-muted` for the non-header context, or make it context-aware via a `dark` prop.
  - **Safest approach:** Set `className` to `pl-10 pr-10 h-10 w-full bg-muted border border-hairline focus-visible:ring-primary rounded-pill text-ink placeholder:text-ink-muted` — muted bg works on both white and dark surfaces.
- Dropdown `motion.div`: `bg-card border border-border rounded-lg shadow-lg` → `bg-background border border-hairline rounded-lg shadow-dropdown`
- Each result `button`: `hover:bg-secondary/50` → `hover:bg-canvas-warm`; selected: `bg-secondary` → `bg-canvas-warm`
- Product thumbnail inside results: `rounded object-cover` → `rounded-sm object-contain bg-canvas-warm`
- Product name: `font-medium text-foreground` → `font-medium text-ink`
- Category: `text-sm text-muted-foreground` → `text-xs text-ink-muted capitalize`
- Price: `text-primary font-semibold` → `text-primary font-bold text-sm`
- "Search for..." bottom row: `text-primary hover:bg-secondary/50` → `text-primary hover:bg-canvas-warm text-sm`
- "View all results" divider: `border-t border-border` → `border-t border-hairline`
- Dismiss `Button`: keep `variant="ghost" size="icon"`, add `text-ink-muted hover:text-ink`
- `Search` icon: keep `text-muted-foreground` → `text-ink-muted`

**What must NOT change:**
- `useState` for `query`, `isOpen`, `selectedIndex`
- `useRef`, `useNavigate`
- `useProducts` hook
- `filteredProducts` computation logic
- All keyboard handler logic (`ArrowDown`, `ArrowUp`, `Enter`, `Escape`)
- `handleSelect` function and `navigate` calls
- `AnimatePresence` + `motion.div` for dropdown

---

#### [MODIFY] [ProductReviews.tsx](file:///d:/Ibrahim/Stipe%27s%20Fresh%20Cart/fresh-cart/src/components/products/ProductReviews.tsx)

**What changes — visual only:**
- Outer `Card`: add `border-hairline shadow-card rounded-xl`
- `CardTitle`: `flex items-center justify-between` — no class change, content is fine
- Review form background: `bg-secondary/50 rounded-lg` → `bg-canvas-warm rounded-lg border border-hairline`
- "Already reviewed" panel: `bg-primary/10 rounded-lg` → `bg-primary-subtle rounded-lg border border-primary/20`
- "Sign in" prompt panel: `bg-secondary/50 rounded-lg` → `bg-canvas-warm rounded-lg`
- Individual review `<div>`: `border border-border rounded-lg` → `border border-hairline-soft rounded-lg`
- Reviewer name `<p>`: `font-medium` → `font-semibold text-ink`
- Date span: `text-xs text-muted-foreground` → `text-xs text-ink-muted`
- Review text `<p>`: `text-sm text-muted-foreground` → `text-sm text-ink-secondary`
- Submit `Button`: default → add `rounded-pill` class
- `StarRating` stars: `fill-amber-400 text-amber-400` → keep (amber, correct per design)
- Loading spinner: `border-b-2 border-primary` → keep (correct)

**What must NOT change:**
- All Supabase queries and mutations (`submitReview`, `deleteReview`)
- `useAuth` hook usage
- `useQuery`, `useMutation`, `useQueryClient`
- `userReview` detection logic (including JSON parse)
- `StarRating` component's interactive logic
- `handleSubmit` function
- `averageRating` calculation
- All `toast.success`, `toast.error` calls

---

### Phase 4 — Catalog Page

**Dependency:** Phase 0 + Phase 3 (ProductCard) must be complete.

---

#### [MODIFY] [Products.tsx](file:///d:/Ibrahim/Stipe%27s%20Fresh%20Cart/fresh-cart/src/pages/Products.tsx)

**What changes — visual only:**
- Page `<div>` wrapper: `min-h-screen flex flex-col` — no change
- `<main>`: `container mx-auto px-4 py-8` — no change
- Page `<h1>`: `font-display text-3xl font-bold text-foreground mb-2` → `font-display text-3xl font-bold text-ink mb-2`
- Count `<p>`: `text-muted-foreground` → `text-ink-muted`
- Sidebar `<aside>`: `hidden lg:block w-64 shrink-0` → keep width. Inner `<div>`: `sticky top-32 bg-card rounded-xl p-6 border border-border` → `sticky top-32 bg-background rounded-xl p-6 border border-hairline shadow-card`
- Sidebar icon `Filter`: `text-primary` → keep
- Filter section `<h3>` headings (Categories, Price Range, Discounted): `font-semibold text-foreground mb-3` → `font-semibold text-ink mb-3 text-sm uppercase tracking-wide`
- Category label: `text-sm` → `text-sm text-ink`
- "Clear All Filters" `Button`: `variant="outline"` → add `className="w-full rounded-pill border-hairline text-ink-muted hover:text-ink hover:border-ink transition-fast"`
- Active filter `Badge` chips: `variant="secondary" className="cursor-pointer"` → `className="cursor-pointer bg-primary-subtle text-primary border border-primary/20 rounded-pill text-xs px-3 py-1 hover:bg-primary/20 transition-fast"`
- Mobile filter `Button`: `variant="outline"` → add `className="rounded-pill border-hairline"`
- `SheetContent`: `side="left"` — no change needed
- Sort `SelectTrigger`: add `className="rounded-sm border-hairline h-9 text-sm"`
- Toolbar divider `<div>`: `border-b border-border` → `border-b border-hairline`
- Products grid: `grid-cols-2 md:grid-cols-3 gap-4 md:gap-6` → `grid-cols-2 md:grid-cols-3 gap-6`
- Empty state: `text-center py-16` → `text-center py-24`; `<p>`: `text-muted-foreground text-lg mb-4` → `text-ink-muted text-lg mb-6`; `Button`: `variant="outline"` → add `className="rounded-pill border-hairline"`

**What must NOT change:**
- All `useState` hooks (`sortBy`, `selectedCategories`, `priceRange`, `showDiscounted`)
- `useSearchParams`, `useProducts` hooks
- `categoryParam`, `filterParam`, `queryParam` URL param reading
- `useEffect` that syncs `categoryParam` to state
- `filteredProducts` `useMemo` computation (all filtering + sorting logic)
- `toggleCategory`, `clearFilters` functions
- `FilterContent` inner component definition and render
- `Sheet` / `SheetContent` mobile filter drawer
- `Select` sort dropdown and its `onValueChange`
- All `categories.find()` label lookups
- `isLoading` guard and `Loader2` spinner

---

### Phase 5 — Product Detail Page

**Dependency:** Phase 0 + Phase 3 must be complete.

---

#### [MODIFY] [ProductDetail.tsx](file:///d:/Ibrahim/Stipe%27s%20Fresh%20Cart/fresh-cart/src/pages/ProductDetail.tsx)

**What changes — visual only:**
- Loading state: keep exactly as-is
- 404 state: keep exactly as-is
- Breadcrumb `<nav>`: `text-sm text-muted-foreground mb-8` → `text-xs text-ink-muted mb-8`; link hover `hover:text-primary` → keep; active span `text-foreground` → `text-ink`
- Image `motion.div`:
  - Image container `<div>`: `aspect-square rounded-2xl overflow-hidden bg-secondary/30` → `aspect-square rounded-xl overflow-hidden bg-canvas-warm p-6 flex items-center justify-center shadow-product-img`
  - `<img>`: `w-full h-full object-cover` → `w-full h-full object-contain`
- Category label `<p>`: `text-sm text-muted-foreground uppercase tracking-wide mb-2` → `text-xs text-ink-muted uppercase tracking-widest mb-2`
- Product `<h1>`: `font-display text-3xl md:text-4xl font-bold text-foreground mb-4` → `text-3xl md:text-4xl font-bold text-ink mb-4` (not `font-display` for product name — use Inter as per design: product names are `display-md` which is Inter 600)
  - Actually: per DESIGN.md `product-detail-info`, name is in `display-md` (Inter 32px 600). So: `className="text-3xl md:text-4xl font-bold text-ink mb-4"` with `font-sans` (Inter)
- Rating stars: `fill-warning text-warning` → keep; count span `font-medium` → keep; review count `text-muted-foreground` → `text-ink-muted`
- Price `<span>`: `text-3xl font-bold text-foreground` → `text-3xl font-bold text-ink`
- Original price `<span>`: `text-xl text-muted-foreground line-through` → `text-lg text-ink-muted line-through`
- Save `Badge`: `bg-success text-success-foreground` → `bg-primary-subtle text-primary border border-primary/20`
- Unit `<p>`: `text-muted-foreground mb-6` → `text-ink-secondary mb-6`; inner `span`: `font-medium text-foreground` → `font-medium text-ink`
- Description `<p>`: `text-muted-foreground mb-8` → `text-ink-secondary mb-8`
- Stock In Stock: `text-success` → `text-primary`; dot `bg-success` → `bg-primary`
- Stock Out: keep `text-destructive` and `bg-destructive`
- Quantity stepper `<div>`: `flex items-center border border-border rounded-lg` → `flex items-center border border-hairline rounded-pill bg-canvas-warm`
- Stepper `Button`s: keep `variant="ghost" size="icon" h-12 w-12`
- "Add to Cart" `Button`: keep `size="lg" bg-primary hover:bg-primary/90 text-primary-foreground` → add `rounded-pill flex-1`
- "Buy Now" `Button`: `size="lg" variant="outline" flex-1` → add `rounded-pill border-hairline text-ink hover:border-primary hover:text-primary`
- "Add to Wishlist" ghost `Button`: keep but add `hover:text-primary transition-fast`
- Trust badge icons container `<div>`: `w-10 h-10 rounded-full bg-success/10` → `w-10 h-10 rounded-full bg-primary-subtle`; icon `text-success` → `text-primary`
- Shield badge: `bg-primary/10` stays, `text-primary` stays
- Trust badge `<p>`: `font-medium text-sm` → `font-medium text-sm text-ink`; desc `text-xs text-muted-foreground` → `text-xs text-ink-muted`
- Trust badge section divider: `border-t border-border` → `border-t border-hairline`
- **Tabs** `TabsList`: `w-full justify-start border-b border-border rounded-none bg-transparent p-0` → keep (already clean)
- `TabsTrigger` active: `data-[state=active]:border-primary` → keep
- Tab content description `<p>`: `text-muted-foreground` → `text-ink-secondary`
- Specs `<h3>`: `text-lg font-semibold text-foreground` → `text-lg font-semibold text-ink`
- Specs `<li>`: `text-muted-foreground` → `text-ink-secondary`
- Related products `<h2>`: `font-display text-2xl font-bold text-foreground mb-6` → `font-display text-2xl font-bold text-ink mb-6`

**What must NOT change:**
- `useParams`, `useProduct`, `useProducts`, `useCartStore` hooks
- `useState` for `quantity`
- `handleAddToCart`, `handleBuyNow` functions and `toast.success` calls
- `relatedProducts` filter and slice logic
- All `Link` and breadcrumb destinations
- `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` and their `value` props
- `ProductReviews` component render
- `ProductCard` map for related products
- Loading and 404 guard renders

---

### Phase 6 — Cart & Checkout Pages

**Dependency:** Phase 0 must be complete. Read full source of `Cart.tsx` and `Checkout.tsx` before starting.

> [!IMPORTANT]
> The AI executing this phase MUST read and fully understand `Cart.tsx` and `Checkout.tsx` before making any changes. The logic in these files (cart calculations, delivery threshold, coupon application, JazzCash/bank/COD payment flows, screenshot upload) must not be touched.

---

#### [MODIFY] [Cart.tsx](file:///d:/Ibrahim/Stipe%27s%20Fresh%20Cart/fresh-cart/src/pages/Cart.tsx)

**Design targets:**
- Page title: Inter 32px 600 (`text-3xl font-bold text-ink`)
- Cart item rows: white card with `border border-hairline-soft rounded-lg p-4 shadow-card`
- Item thumbnail container: `w-20 h-20 rounded-md bg-canvas-warm flex items-center justify-center`
- Item thumbnail `<img>`: `object-contain w-full h-full p-2`
- Item name: `font-semibold text-ink text-sm`
- Item price caption: `text-xs text-ink-muted`
- Quantity stepper: `border border-hairline rounded-pill bg-canvas-warm`
- Line total: `font-bold text-ink`
- Remove button: `text-ink-muted hover:text-destructive transition-fast`
- Cart summary card: `bg-canvas-warm rounded-xl border border-hairline p-6`
- Summary rows: `flex justify-between text-sm text-ink`
- Divider: `border-hairline`
- Total row: `text-xl font-bold text-ink`
- Delivery threshold progress bar: `bg-primary h-1 rounded-full`
- "Proceed to Checkout" `Button`: `w-full rounded-pill bg-primary text-primary-foreground`
- Empty cart state: centered `ShoppingCart` icon 64px in `text-ink-faint`, title `text-xl font-semibold text-ink`, desc `text-ink-muted`, "Continue Shopping" `Button` with `rounded-pill`
- Free delivery message: `text-primary font-medium text-sm`

---

#### [MODIFY] [Checkout.tsx](file:///d:/Ibrahim/Stipe%27s%20Fresh%20Cart/fresh-cart/src/pages/Checkout.tsx)

**Design targets:**
- Stepper bar: 3 steps with circle numbers. Active: `bg-primary text-on-primary`. Completed: `bg-primary text-on-primary` with checkmark. Upcoming: `border-2 border-hairline text-ink-muted`. Connecting line: `bg-hairline` → active segment `bg-primary`. Step labels: `text-xs text-ink-muted`, active `text-primary font-semibold`.
- Step card container: `bg-background border border-hairline rounded-xl p-6 shadow-card`
- Form `Input` fields: `border-hairline rounded-sm focus-visible:ring-primary h-11`
- Section headings inside cards: `font-semibold text-ink text-base mb-4`
- Payment method radio cards: each option `flex items-center gap-3 p-4 rounded-lg border border-hairline cursor-pointer`. Selected: `border-2 border-primary bg-primary-subtle`. Radio dot: `w-4 h-4 rounded-full border-2 border-hairline`. Selected radio: `border-primary` with `bg-primary` inner dot.
- "Next" / "Place Order" buttons: `rounded-pill bg-primary text-primary-foreground w-full` or `flex-1`
- "Back" buttons: `rounded-pill variant="outline" border-hairline`
- Screenshot upload area: `border-2 border-dashed border-hairline rounded-lg p-6 text-center text-ink-muted hover:border-primary transition-fast`
- Order summary sidebar: `bg-canvas-warm rounded-xl p-6 border border-hairline` — sticky on desktop

---

### Phase 7 — User & Static Pages

**Dependency:** Phase 0 must be complete. Read source of each page before editing.

> [!IMPORTANT]
> The AI executing this phase MUST read each page file before editing it. Do not guess at the current structure.

---

#### [MODIFY] [Orders.tsx](file:///d:/Ibrahim/Stipe%27s%20Fresh%20Cart/fresh-cart/src/pages/Orders.tsx)

**Design targets:**
- Page title: `font-display text-3xl font-bold text-ink`
- Order card: `bg-background border border-hairline rounded-lg p-6 shadow-card hover:shadow-card-hover transition-smooth`
- Order number: `font-semibold text-ink text-sm`
- Order date: `text-xs text-ink-muted`
- Status badge — reuse design system badge variants (see DESIGN.md `order-status-badge`):
  - Pending: `bg-accent-amber-soft text-amber border border-amber/20 rounded-pill text-xs px-3 py-1 uppercase tracking-wide font-semibold`
  - Shipped: `bg-purple/10 text-purple border border-purple/20 ...`
  - Delivered: `bg-primary-subtle text-primary border border-primary/20 ...`
  - Cancelled: `bg-destructive/10 text-destructive border border-destructive/20 ...`
- Item thumbnails row: small 40×40 images with `rounded-sm bg-canvas-warm object-contain`
- Total: `font-bold text-ink`
- "View Details" link: `text-primary hover:underline text-sm`
- Empty state: centered icon + `font-display text-xl text-ink` heading + `text-ink-muted` desc + primary pill button

---

#### [MODIFY] [OrderDetails.tsx](file:///d:/Ibrahim/Stipe%27s%20Fresh%20Cart/fresh-cart/src/pages/OrderDetails.tsx)

**Design targets:**
- Same order card style as Orders.tsx
- Line item rows: thumbnail `bg-canvas-warm rounded-md object-contain`, name `font-semibold text-ink`, qty + price `text-ink-muted text-sm`
- Address card: `bg-canvas-warm rounded-lg p-4 border border-hairline`
- Price breakdown rows: same as cart summary style

---

#### [MODIFY] [Wishlist.tsx](file:///d:/Ibrahim/Stipe%27s%20Fresh%20Cart/fresh-cart/src/pages/Wishlist.tsx)

**Design targets:**
- Grid of `ProductCard` components — no change needed here (Phase 3 handles cards)
- Page title: `font-display text-3xl font-bold text-ink`
- Empty state: `Heart` icon in `text-ink-faint`, heading `font-display text-xl text-ink`, desc `text-ink-muted`, "Browse Products" `Button` with `rounded-pill`

---

#### [MODIFY] [Auth.tsx](file:///d:/Ibrahim/Stipe%27s%20Fresh%20Cart/fresh-cart/src/pages/Auth.tsx)

**Design targets:**
- Page background: `bg-canvas-warm min-h-screen flex items-center justify-center py-12`
- Auth card: `bg-background rounded-xl border border-hairline shadow-modal max-w-md w-full mx-4 p-8`
- Logo + brand: centered at top of card
- Tab switcher (Sign In / Sign Up): styled as pill selector
- Form inputs: `border-hairline rounded-sm h-11 focus-visible:ring-primary`
- Submit button: `w-full rounded-pill bg-primary text-primary-foreground h-11`
- Divider "or": `border-hairline`
- "Sign in to your account" / register headings: `font-display text-2xl text-ink`

---

#### [MODIFY] [Contact.tsx](file:///d:/Ibrahim/Stipe%27s%20Fresh%20Cart/fresh-cart/src/pages/Contact.tsx)

**Design targets:**
- Page title: `font-display text-3xl font-bold text-ink`
- Contact info cards: `bg-canvas-warm rounded-lg p-6 border border-hairline`
- Icon containers: `w-10 h-10 rounded-full bg-primary-subtle flex items-center justify-center` with `text-primary` icons
- Form card: `bg-background border border-hairline rounded-xl p-6 shadow-card`
- Form inputs + textarea: `border-hairline rounded-sm focus-visible:ring-primary`
- Submit `Button`: `rounded-pill bg-primary text-primary-foreground`

---

#### [MODIFY] [FAQ.tsx](file:///d:/Ibrahim/Stipe%27s%20Fresh%20Cart/fresh-cart/src/pages/FAQ.tsx)

**Design targets:**
- Page background: `bg-canvas-parchment` for the whole page or just the hero strip
- Page title: `font-display text-3xl font-bold text-ink`
- `Accordion` items: `border border-hairline rounded-lg mb-3 bg-background shadow-card`
- Accordion trigger: `font-semibold text-ink hover:text-primary transition-fast`
- Accordion content: `text-ink-secondary`

---

#### [MODIFY] [NotFound.tsx](file:///d:/Ibrahim/Stipe%27s%20Fresh%20Cart/fresh-cart/src/pages/NotFound.tsx)

**Design targets:**
- Center-aligned full-screen: `min-h-screen flex flex-col items-center justify-center bg-background`
- "404" large text: `font-display text-8xl font-bold text-ink`
- Subtitle: `font-display text-2xl text-ink mb-4`
- Description: `text-ink-muted mb-8`
- "Go Home" `Button`: `rounded-pill bg-primary text-primary-foreground`
- "Go Back" `Button`: `rounded-pill variant="outline" border-hairline ml-3`

---

## Verification Plan

### After Each Phase
1. Run `npm run dev` (or confirm it is already running)
2. Open `http://localhost:5173` (or the dev URL)
3. Visually verify the changed components look correct
4. Click every interactive element: cart add, wishlist toggle, search, category nav, filters, checkout steps
5. Check no console errors related to missing classes or undefined tokens

### Automated
```bash
npm run build
# Must produce zero TypeScript errors and zero build errors
```

### Manual Checklist (Final)
- [ ] Global nav is true black with white text
- [ ] Category nav strip is white/light below the black nav
- [ ] Footer is dark surface with legible text
- [ ] Product cards have warm off-white image backgrounds
- [ ] All CTAs are pill-shaped (rounded-pill)
- [ ] No green gradient backgrounds on any UI element
- [ ] Hero section is clean dark tile (not heavy gradient)
- [ ] Category section shows card-style pills, not circles
- [ ] DM Serif Display renders for h1/h2/h3 (section headings, hero)
- [ ] Star ratings are amber
- [ ] All prices display as `Rs. X,XXX` (no changes to formatPrice)
- [ ] Cart add/remove works
- [ ] Search autocomplete works
- [ ] Wishlist toggle works
- [ ] Checkout all 3 steps navigate correctly
- [ ] Auth sign in/out works
- [ ] Admin dashboard at `/admin` is completely untouched
- [ ] No 404s for any route

---

## Open Questions

> [!IMPORTANT]
> Please confirm the following before execution begins:

1. **Font loading:** DM Serif Display will be loaded from Google Fonts via `<link>` in index.html.
2. **Phase order:** Execution proceeds sequentially Phase 0 → 1 → 2 → 3 → 4 → 5 → 6 → 7.
3. **Admin dashboard:** Confirmed completely excluded from this redesign (`/admin` and `/admin/login`).
4. **Mobile bottom nav:** User selected: **Build a full 4-icon bottom nav bar (Home, Categories, Cart with badge, Account/Orders)**. Update `FloatingNav.tsx` / `MobileNav.tsx` accordingly in Phase 1.
