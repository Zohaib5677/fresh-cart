---
version: 1.0
name: SnapCart-design-system
description: >
  A photography-first, Apple-inspired design system for SnapCart — Pakistan's Premium
  Home Decor & Essentials e-commerce platform. Every screen is a gallery wall where the
  product is the art. Edge-to-edge hero sections alternate warm and cool canvases, framed
  by Inter headlines with negative letter-spacing and a single Emerald (#059669) interactive
  color. UI chrome recedes so the merchandise speaks — no decorative gradients on controls,
  no shadows on chrome, only the one signature elevation under product imagery resting on
  a surface. The store grid, cart, checkout, and category pages share the same restrained
  chassis, expressed at different volumes.

colors:
  # ── Brand & Accent ──────────────────────────────────────────────
  primary: "#059669"              # Emerald — the single interactive color
  primary-hover: "#047857"        # Deeper emerald on hover
  primary-focus: "#10b981"        # Brighter emerald for focus rings
  primary-on-dark: "#34d399"      # Lighter emerald for links on dark surfaces
  primary-subtle: "#ecfdf5"       # Whisper-green tint for backgrounds

  # ── Accent (warm) ───────────────────────────────────────────────
  accent-amber: "#f59e0b"         # Star ratings, "Top Selling" badges, sale flashes
  accent-amber-soft: "#fef3c7"    # Amber tint for badge backgrounds
  accent-purple: "#8b5cf6"        # "Exclusive" product badge
  accent-purple-soft: "#ede9fe"   # Purple tint for badge backgrounds
  accent-red: "#ef4444"           # Destructive actions, "Sale" badges, stock warnings
  accent-red-soft: "#fef2f2"      # Red tint for error/alert backgrounds

  # ── Surfaces ────────────────────────────────────────────────────
  canvas: "#ffffff"               # Dominant white canvas — product grids, cards, modals
  canvas-warm: "#fafaf5"          # Warm off-white — alternating sections, category strips
  canvas-parchment: "#f5f5f0"     # Signature warm parchment — footer, info sections
  surface-pearl: "#fafafa"        # Near-white button fills, input backgrounds
  surface-card: "#ffffff"         # Product card surface
  surface-elevated: "#ffffff"     # Modals, sheets, popovers
  surface-dark-1: "#1a1a1a"       # Primary dark tile — hero sections, promotional banners
  surface-dark-2: "#222222"       # Secondary dark tile — adjacent dark sections
  surface-dark-3: "#111111"       # Deep dark — video backdrops, immersive sections
  surface-black: "#000000"        # True black — nav bar background
  surface-overlay: "rgba(0, 0, 0, 0.5)"  # Modal/sheet backdrop overlay
  surface-chip: "rgba(255, 255, 255, 0.85)" # Translucent chip over photography

  # ── Text ────────────────────────────────────────────────────────
  ink: "#171717"                  # Primary text on light surfaces — near-black, not pure black
  ink-secondary: "#404040"        # Secondary body text, descriptions
  ink-muted: "#737373"            # Tertiary text, placeholders, disabled labels
  ink-faint: "#a3a3a3"            # Fine-print, legal, timestamps
  on-primary: "#ffffff"           # Text on primary-colored backgrounds
  on-dark: "#ffffff"              # Text on dark surfaces
  on-dark-muted: "#d4d4d4"       # Secondary text on dark surfaces

  # ── Borders & Dividers ──────────────────────────────────────────
  hairline: "#e5e5e5"             # Default 1px border — cards, inputs, dividers
  hairline-soft: "#f0f0f0"        # Softer border — section dividers within cards
  hairline-dark: "#333333"        # Borders on dark surfaces
  ring-focus: "#059669"           # Focus ring color (matches primary)

  # ── Status ──────────────────────────────────────────────────────
  status-pending: "#f59e0b"       # Order pending
  status-processing: "#3b82f6"    # Order processing / verification
  status-shipped: "#8b5cf6"       # Order shipped
  status-delivered: "#059669"     # Order delivered (matches primary)
  status-cancelled: "#ef4444"     # Order cancelled

typography:
  hero-display:
    fontFamily: "'DM Serif Display', Georgia, 'Times New Roman', serif"
    fontSize: 56px
    fontWeight: 400
    lineHeight: 1.07
    letterSpacing: -0.5px
  display-lg:
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
    fontSize: 40px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: -0.4px
  display-md:
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
    fontSize: 32px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.32px
  section-title:
    fontFamily: "'DM Serif Display', Georgia, 'Times New Roman', serif"
    fontSize: 28px
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: -0.2px
  lead:
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
    fontSize: 24px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: -0.1px
  lead-light:
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
    fontSize: 20px
    fontWeight: 300
    lineHeight: 1.5
    letterSpacing: 0
  tagline:
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.1px
  body-strong:
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: -0.1px
  body:
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: -0.1px
  body-small:
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: -0.06px
  caption:
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0
  caption-strong:
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0
  price-display:
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.0
    letterSpacing: -0.2px
  price-card:
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.0
    letterSpacing: -0.1px
  price-original:
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.0
    letterSpacing: 0
    textDecoration: line-through
  button-large:
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.0
    letterSpacing: 0
  button-default:
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.0
    letterSpacing: 0
  button-small:
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.0
    letterSpacing: 0
  nav-link:
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.0
    letterSpacing: 0
  fine-print:
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0
  badge:
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
    fontSize: 11px
    fontWeight: 600
    lineHeight: 1.0
    letterSpacing: 0.4px
    textTransform: uppercase

rounded:
  none: 0px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 20px
  2xl: 24px
  pill: 9999px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  section: 80px

shadows:
  product-image: "0 4px 24px rgba(0, 0, 0, 0.08)"
  product-hover: "0 8px 40px rgba(0, 0, 0, 0.12)"
  card-rest: "0 1px 3px rgba(0, 0, 0, 0.04)"
  card-hover: "0 4px 16px rgba(0, 0, 0, 0.08)"
  sticky-bar: "0 -1px 12px rgba(0, 0, 0, 0.06)"
  modal: "0 16px 48px rgba(0, 0, 0, 0.16)"
  dropdown: "0 4px 24px rgba(0, 0, 0, 0.12)"

transitions:
  fast: "150ms cubic-bezier(0.4, 0, 0.2, 1)"
  default: "200ms cubic-bezier(0.4, 0, 0.2, 1)"
  smooth: "300ms cubic-bezier(0.4, 0, 0.2, 1)"
  slow: "500ms cubic-bezier(0.4, 0, 0.2, 1)"
  spring: "400ms cubic-bezier(0.34, 1.56, 0.64, 1)"

components:
  # ── Navigation ──────────────────────────────────────────────────
  global-nav:
    backgroundColor: "{colors.surface-black}"
    textColor: "{colors.on-dark}"
    typography: "{typography.nav-link}"
    height: 48px
    backdropFilter: none
    description: >
      Persistent top bar — logo left, search center-left, account/wishlist/cart icons right.
      True black background. On mobile, collapses to logo + hamburger + cart icon.

  category-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-small}"
    height: 44px
    borderBottom: "1px solid {colors.hairline}"
    backdropFilter: "saturate(180%) blur(20px)"
    description: >
      Sticky below global-nav. Horizontal scrollable list of category pills.
      On scroll, gains frosted-glass blur. Hides on mobile — categories move to hamburger.

  # ── Buttons ─────────────────────────────────────────────────────
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-default}"
    rounded: "{rounded.pill}"
    padding: "10px 24px"
    height: 40px
    activeTransform: "scale(0.97)"
    description: "The signature SnapCart action pill. Every primary CTA is this."

  button-primary-large:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-large}"
    rounded: "{rounded.pill}"
    padding: "14px 32px"
    height: 48px
    description: "Hero CTAs — 'Shop Now', 'Explore Collection'. Rare and prominent."

  button-secondary:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    typography: "{typography.button-default}"
    rounded: "{rounded.pill}"
    padding: "10px 24px"
    height: 40px
    border: "1.5px solid {colors.primary}"
    description: "Ghost pill — used alongside a primary button. 'View Details' next to 'Add to Cart'."

  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.button-default}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
    height: 36px
    description: "Low-emphasis action — filter toggles, 'Clear All', navigation helpers."

  button-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-dark}"
    typography: "{typography.button-default}"
    rounded: "{rounded.pill}"
    padding: "10px 24px"
    height: 40px
    description: "Used on light surfaces where primary green would clash with surrounding green content."

  button-icon:
    backgroundColor: "{colors.surface-pearl}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    size: 40px
    border: "1px solid {colors.hairline}"
    description: "Circular icon button — wishlist heart, cart icon, search, close. Always 40×40."

  button-icon-on-image:
    backgroundColor: "{colors.surface-chip}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    size: 36px
    backdropFilter: "blur(8px)"
    description: "Floating over product images — wishlist toggle, quick-view. Translucent glass."

  button-add-to-cart:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-default}"
    rounded: "{rounded.pill}"
    padding: "8px 20px"
    height: 36px
    icon: "shopping-bag (16px, left)"
    description: "Compact 'Add to Cart' button used inside product cards."

  button-quantity:
    backgroundColor: "{colors.surface-pearl}"
    textColor: "{colors.ink}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.pill}"
    height: 36px
    padding: "0 4px"
    description: >
      Inline quantity stepper: [ − ] count [ + ]. The minus and plus are icon buttons
      at 28×28. Count sits centered between them. Replaces 'Add to Cart' after first add.

  # ── Product Cards ───────────────────────────────────────────────
  product-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    border: "1px solid {colors.hairline-soft}"
    shadow: "{shadows.card-rest}"
    hoverShadow: "{shadows.card-hover}"
    hoverTranslateY: "-2px"
    transition: "{transitions.smooth}"
    description: >
      The workhorse card. White surface, subtle hairline border, whisper shadow at rest.
      On hover: lifts 2px and shadow deepens. No border-radius change on hover.
      Interior layout: product image (aspect 1:1, padded 16px, object-fit contain on
      canvas-warm background) → category label in caption → product name in body-strong
      (2-line clamp) → star rating row → price block → 'Add to Cart' pill or quantity stepper.

  product-card-image:
    backgroundColor: "{colors.canvas-warm}"
    rounded: "{rounded.md}"
    aspectRatio: "1 / 1"
    padding: 16px
    objectFit: contain
    description: >
      Product image container inside the card. Warm off-white background separates the
      image from the card chrome. The product floats on the surface — the warm tone acts
      as the pedestal. No shadow on the image inside cards.

  product-card-badge:
    typography: "{typography.badge}"
    rounded: "{rounded.xs}"
    padding: "3px 8px"
    position: "absolute top-12px left-12px"
    variants:
      top-selling:
        backgroundColor: "{colors.accent-amber}"
        textColor: "#ffffff"
      exclusive:
        backgroundColor: "{colors.accent-purple}"
        textColor: "#ffffff"
      sale:
        backgroundColor: "{colors.accent-red}"
        textColor: "#ffffff"
      new:
        backgroundColor: "{colors.primary}"
        textColor: "#ffffff"
    description: "Small pill badge floating over the top-left of the product image."

  # ── Hero Sections ───────────────────────────────────────────────
  hero-section-dark:
    backgroundColor: "{colors.surface-dark-1}"
    textColor: "{colors.on-dark}"
    padding: "{spacing.section} {spacing.lg}"
    minHeight: "75vh"
    description: >
      Full-bleed dark hero on the home page. Centered stack: serif headline in
      hero-display → lead paragraph in on-dark-muted → 'Shop Now' primary-large CTA
      + 'Explore Categories' secondary CTA. A large product composition image sits
      below or to the side. On mobile: stacks vertically, min-height drops to 60vh.

  hero-section-light:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    padding: "{spacing.section} {spacing.lg}"
    description: >
      Light hero variant. Used for category landing pages and seasonal campaigns.
      Same centered stack structure as the dark hero.

  promo-banner:
    backgroundColor: "{colors.surface-dark-2}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.xl}"
    padding: "{spacing.2xl}"
    description: >
      Mid-page promotional block. Dark surface with rounded corners (unlike the full-bleed
      hero). Contains a deal headline, countdown or offer text, and a primary CTA.
      Product image floats to the right on desktop, stacks below on mobile.

  # ── Category Section ────────────────────────────────────────────
  category-section:
    backgroundColor: "{colors.canvas-warm}"
    padding: "{spacing.section} {spacing.lg}"
    description: >
      Full-width warm parchment strip. Section title in section-title (serif, 28px) →
      Horizontally scrollable row of category-pill components. On desktop, wraps into
      a grid of 5–6 per row.

  category-pill:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.caption-strong}"
    rounded: "{rounded.xl}"
    padding: "16px"
    border: "1px solid {colors.hairline}"
    shadow: "{shadows.card-rest}"
    hoverShadow: "{shadows.card-hover}"
    width: "auto"
    description: >
      Category card — square-ish with a centered category icon (or small image) above
      the category name. On hover: lifts with shadow. Active/selected state: border
      changes to 2px solid primary.

  # ── Product Grid ────────────────────────────────────────────────
  product-section:
    backgroundColor: "{colors.canvas}"
    padding: "{spacing.section} {spacing.lg}"
    description: >
      Section wrapper for a product grid. Contains a section header row (section-title
      left + 'View All →' text-link right) and a responsive grid of product-card components.
      Grid: 4-col desktop / 3-col tablet / 2-col mobile.

  product-grid:
    columns-desktop: 4
    columns-tablet: 3
    columns-mobile: 2
    gap: "{spacing.lg}"
    maxWidth: 1280px
    description: "Responsive product card grid. Centered with auto margins."

  # ── Catalog Page ────────────────────────────────────────────────
  catalog-sidebar:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    border: "1px solid {colors.hairline}"
    padding: "{spacing.lg}"
    width: 280px
    description: >
      Left sidebar on the catalog page (desktop only). Contains:
      • Search input
      • Category filter list (checkboxes)
      • Price range slider
      • Discount toggle
      • 'Clear All Filters' ghost button at the bottom.
      On mobile: hidden — opens as a slide-in sheet from the left.

  filter-chip:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-small}"
    rounded: "{rounded.pill}"
    padding: "6px 14px"
    border: "1px solid {colors.hairline}"
    description: >
      Applied filter tag shown above the product grid. Contains filter name + tiny ✕ icon.
      Active state: bg primary-subtle, border primary, text primary.

  sort-select:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-small}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
    border: "1px solid {colors.hairline}"
    height: 36px
    description: "Compact sort dropdown — 'Price: Low to High', 'Newest', 'Top Rated', etc."

  # ── Product Detail Page ─────────────────────────────────────────
  product-detail-image-gallery:
    backgroundColor: "{colors.canvas-warm}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
    description: >
      Large product image viewer on the detail page. Main image area (aspect 4:3 on
      desktop, 1:1 on mobile) with thumbnail strip below. Warm background gives the
      product a soft pedestal. Thumbnails are 64×64 rounded-sm with hairline border,
      active thumbnail gets a 2px primary border.

  product-detail-info:
    textColor: "{colors.ink}"
    description: >
      Right-side product information panel. Layout top-to-bottom:
      • Category label in caption (muted)
      • Product name in display-md (32px / 600)
      • Star rating row with count in caption
      • Price block: current price in price-display (20px / 700) + original price
        struck through in price-original + discount % badge
      • Short description in body (16px / 400)
      • Quantity stepper (button-quantity)
      • 'Add to Cart' button-primary-large (full width)
      • 'Add to Wishlist' button-secondary (full width)
      • Stock status indicator

  product-detail-tabs:
    typography: "{typography.body-strong}"
    description: >
      Tab bar below the hero area. Three tabs: 'Description', 'Specifications', 'Reviews'.
      Tab labels in body-strong, inactive in ink-muted. Active tab has a 2px bottom
      border in primary. Tab content area uses body typography.

  # ── Cart Page ───────────────────────────────────────────────────
  cart-item-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "{spacing.md}"
    border: "1px solid {colors.hairline-soft}"
    description: >
      Horizontal card for each cart item. Left: product thumbnail (80×80, rounded-md,
      canvas-warm bg). Center: product name in body-strong + unit price in caption.
      Right: quantity stepper + line total in price-card + remove icon button.
      On mobile: thumbnail and info stack vertically, quantity + price row below.

  cart-summary:
    backgroundColor: "{colors.canvas-warm}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "{spacing.lg}"
    description: >
      Sticky right-column summary on desktop. Contains:
      • Subtotal, delivery fee, discount rows (body + price right-aligned)
      • Coupon input row (search-input style + 'Apply' ghost button)
      • Divider hairline
      • Total in display-md
      • 'Proceed to Checkout' button-primary-large (full width)
      • Free delivery threshold progress bar (thin primary-colored bar)

  # ── Checkout Page ───────────────────────────────────────────────
  checkout-stepper:
    typography: "{typography.caption-strong}"
    description: >
      Three-step horizontal stepper at the top of checkout: Shipping → Payment → Review.
      Each step is a circle (24×24) numbered with connecting line. Active step: primary
      fill. Completed step: primary fill with checkmark. Upcoming: hairline border.

  checkout-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    border: "1px solid {colors.hairline}"
    padding: "{spacing.lg}"
    description: >
      Each checkout step renders inside this card. Contains form fields for shipping
      address (inputs styled per search-input but rectangular with rounded-sm) or
      payment method radio cards.

  payment-method-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    border: "1px solid {colors.hairline}"
    padding: "{spacing.md}"
    description: >
      Radio-selectable payment option. Shows payment icon + name + description.
      Selected state: border 2px primary, bg primary-subtle. Unselected: hairline border.
      Options: JazzCash, Bank Transfer, Cash on Delivery.

  # ── Search ──────────────────────────────────────────────────────
  search-input:
    backgroundColor: "{colors.surface-pearl}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "10px 20px 10px 44px"
    height: 44px
    border: "1px solid {colors.hairline}"
    focusBorder: "1px solid {colors.primary}"
    icon: "search (18px, left 14px, muted)"
    description: >
      Pill-shaped search field in the header. Leading search icon. On focus, border turns
      primary. Autocomplete dropdown appears below (search-dropdown).

  search-dropdown:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    shadow: "{shadows.dropdown}"
    border: "1px solid {colors.hairline}"
    padding: "{spacing.xs} 0"
    maxHeight: 400px
    description: >
      Live search results overlay. Each result row: small product thumbnail (48×48) +
      product name in body-small + price in caption-strong. Hover: bg canvas-warm.
      Bottom row: 'View all results for "query"' text-link.

  # ── Discount / Announcement ─────────────────────────────────────
  announcement-bar:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.caption}"
    height: 36px
    padding: "8px {spacing.lg}"
    description: >
      Thin bar pinned above the global-nav. Shows site-wide offers: 'Free Delivery
      on orders above Rs. 500' or '20% OFF — Use code SNAP20'. Dismissible with
      a small ✕ icon on the right.

  # ── Ratings & Reviews ──────────────────────────────────────────
  star-rating:
    filledColor: "{colors.accent-amber}"
    emptyColor: "{colors.hairline}"
    size: 14px
    gap: 2px
    description: "Inline star row. Filled stars are amber, empty are hairline gray."

  review-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "{spacing.md}"
    border: "1px solid {colors.hairline-soft}"
    description: >
      Single review block. Top row: reviewer name in body-strong + date in caption muted.
      Below: star-rating component. Below: review text in body. Stacks vertically with
      spacing-md between reviews.

  # ── Order Status ────────────────────────────────────────────────
  order-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    border: "1px solid {colors.hairline}"
    padding: "{spacing.lg}"
    description: >
      Order summary card in the orders list. Top row: Order # in body-strong + date
      in caption muted + status badge. Below: list of item thumbnails (40×40 row).
      Bottom row: total in price-card + 'View Details →' text-link.

  order-status-badge:
    typography: "{typography.badge}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
    variants:
      pending:
        backgroundColor: "{colors.accent-amber-soft}"
        textColor: "{colors.status-pending}"
      processing:
        backgroundColor: "#eff6ff"
        textColor: "{colors.status-processing}"
      shipped:
        backgroundColor: "{colors.accent-purple-soft}"
        textColor: "{colors.status-shipped}"
      delivered:
        backgroundColor: "{colors.primary-subtle}"
        textColor: "{colors.status-delivered}"
      cancelled:
        backgroundColor: "{colors.accent-red-soft}"
        textColor: "{colors.status-cancelled}"

  # ── Floating / Sticky Elements ──────────────────────────────────
  floating-cart-bar:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    shadow: "{shadows.sticky-bar}"
    height: 64px
    padding: "12px {spacing.lg}"
    backdropFilter: "saturate(180%) blur(20px)"
    description: >
      Appears on product detail page (mobile only) when the main 'Add to Cart' button
      scrolls out of view. Pinned to bottom of viewport. Left: price in price-display.
      Right: 'Add to Cart' button-primary.

  mobile-bottom-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-muted}"
    shadow: "{shadows.sticky-bar}"
    height: 56px
    borderTop: "1px solid {colors.hairline}"
    description: >
      Fixed bottom navigation bar on mobile. Four icons: Home, Categories, Cart (with
      badge count), Account. Active icon colored primary. Inactive icons in ink-muted.

  # ── Inputs & Forms ──────────────────────────────────────────────
  input-field:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "10px 14px"
    height: 44px
    border: "1px solid {colors.hairline}"
    focusBorder: "2px solid {colors.primary}"
    placeholderColor: "{colors.ink-muted}"
    description: "Standard form input — shipping address, contact form, coupon code, etc."

  textarea-field:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "10px 14px"
    minHeight: 120px
    border: "1px solid {colors.hairline}"
    focusBorder: "2px solid {colors.primary}"
    description: "Multi-line input — contact form message, review body."

  select-field:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "10px 14px"
    height: 44px
    border: "1px solid {colors.hairline}"
    description: "Dropdown select — city selector in checkout, sort options."

  checkbox:
    size: 18px
    rounded: "{rounded.xs}"
    border: "1.5px solid {colors.hairline}"
    checkedBg: "{colors.primary}"
    checkedIcon: "check (12px, white)"
    description: "Category filter checkboxes, 'Remember me', terms acceptance."

  radio:
    size: 18px
    rounded: "{rounded.full}"
    border: "1.5px solid {colors.hairline}"
    selectedBorder: "1.5px solid {colors.primary}"
    selectedDot: "8px solid {colors.primary}"
    description: "Payment method selection, delivery option selection."

  # ── Toast Notifications ─────────────────────────────────────────
  toast:
    backgroundColor: "{colors.surface-dark-1}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-small}"
    rounded: "{rounded.lg}"
    padding: "12px 16px"
    shadow: "{shadows.modal}"
    description: >
      Appears bottom-right on desktop, bottom-center on mobile. Dark surface for contrast.
      Contains icon + message + optional action link. Auto-dismisses in 4 seconds.
      Success: left accent border in primary. Error: left accent border in accent-red.

  # ── Footer ──────────────────────────────────────────────────────
  footer:
    backgroundColor: "{colors.surface-dark-1}"
    textColor: "{colors.on-dark-muted}"
    padding: "{spacing.3xl} {spacing.lg}"
    description: >
      Dark footer. Top section: 4-column grid — Brand (logo + tagline + social icons),
      Quick Links, Customer Service, Newsletter signup. Links in on-dark-muted, hover
      to on-dark. Newsletter input is a pill with 'Subscribe' primary button inline.
      Bottom row: copyright in fine-print + payment method icons (JazzCash, bank logos, COD).
      Divider between sections: 1px hairline-dark.

  # ── Miscellaneous ───────────────────────────────────────────────
  breadcrumb:
    typography: "{typography.caption}"
    textColor: "{colors.ink-muted}"
    separator: "/"
    activeColor: "{colors.ink}"
    description: "Navigation breadcrumb on product detail and category pages."

  empty-state:
    textColor: "{colors.ink-muted}"
    description: >
      Centered illustration (64px icon in ink-faint) + headline in tagline + body text
      in body muted + primary CTA button. Used for empty cart, empty wishlist, no results.

  skeleton-loader:
    backgroundColor: "{colors.canvas-warm}"
    shimmerColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    description: "Pulsing placeholder blocks while data loads. Matches the shape of the content it replaces."

  modal:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "{spacing.lg}"
    shadow: "{shadows.modal}"
    overlay: "{colors.surface-overlay}"
    maxWidth: 480px
    description: "Centered modal dialog for confirmations, quick-view, login prompt."

  sheet-mobile:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl} {rounded.xl} 0 0"
    padding: "{spacing.lg}"
    shadow: "{shadows.modal}"
    description: >
      Bottom sheet on mobile for filters, sort options, mini-cart preview.
      Slides up with a drag handle at the top (40×4px, rounded-pill, hairline color).
---

## Overview

SnapCart is Pakistan's premium home decor & essentials marketplace — a curated e-commerce platform selling kitchen & dining, household essentials, dairy, beverages, fresh produce, clothing, and health & beauty products. The design system adapts Apple's photography-first, museum-gallery philosophy to a warm, product-centered shopping experience.

Every screen treats the product as the centerpiece. UI chrome dissolves into the background — no decorative gradients on controls, no heavy shadows on buttons, no competing colors. A single Emerald green (`{colors.primary}` — #059669) carries every interactive signal: links, CTAs, focus rings, active states. There is no second brand color for actions. Typography alternates between the confident warmth of DM Serif Display for editorial moments (hero headlines, section titles) and the clean precision of Inter for everything functional (body, buttons, navigation, pricing).

Surfaces alternate between clean white, warm parchment, and dark charcoal to create visual rhythm without borders — the color change itself acts as the section divider, exactly as Apple does it. Product imagery sits on warm off-white pedestals (`{colors.canvas-warm}`) inside cards, floating without heavy shadows. Elevation is whisper-soft: a `{shadows.card-rest}` at rest, a gentle `{shadows.card-hover}` on interaction.

**Key Characteristics:**
- Photography-first: every product card, hero, and detail page lets the product image dominate. UI recedes.
- Single emerald accent (`{colors.primary}` — #059669) for every interactive element. No second action color.
- Warm surface palette: pure white canvas ↔ warm parchment ↔ dark charcoal, with surface changes acting as dividers.
- Two typography voices: DM Serif Display (editorial warmth, hero headlines) and Inter (functional precision, body/UI).
- Pill-shaped CTAs (`{rounded.pill}`) are the signature action shape. Cards use `{rounded.lg}` (16px). Inputs use `{rounded.sm}` (8px).
- Whisper-soft elevation — shadows are barely visible at rest, gentle on hover. No shadows on buttons, nav, or text.
- Active/press state: `transform: scale(0.97)` on every button — the system-wide micro-interaction.
- Product image pedestal: warm off-white (`{colors.canvas-warm}`) background inside cards gives products a gallery feel.

## Colors

### Brand & Accent
- **Emerald** (`{colors.primary}` — #059669): The single interactive color. All CTAs, text links, focus rings, active states, cart badge, delivery progress bar. This green is confident but not loud — it reads as premium, not playful.
- **Emerald Hover** (`{colors.primary-hover}` — #047857): Slightly darker on hover. The shift is subtle — a deepening, not a color change.
- **Emerald Focus** (`{colors.primary-focus}` — #10b981): Brighter for keyboard focus outlines — accessibility-first.
- **Emerald on Dark** (`{colors.primary-on-dark}` — #34d399): Lighter emerald for links and interactive elements on dark surfaces, where the standard emerald would disappear.
- **Emerald Subtle** (`{colors.primary-subtle}` — #ecfdf5): A whisper-green tint used as background for selected states, success alerts, and delivered-order badges.

### Accent (Non-Interactive)
These are informational colors only — they never carry a "click me" signal:
- **Amber** (`{colors.accent-amber}` — #f59e0b): Star ratings, "Top Selling" badges, pending order status. Warm and attention-drawing.
- **Purple** (`{colors.accent-purple}` — #8b5cf6): "Exclusive" product badges. Aspirational and rare.
- **Red** (`{colors.accent-red}` — #ef4444): "Sale" badges, stock warnings, destructive actions, error states. Used sparingly.

### Surface System
- **Canvas** (`{colors.canvas}` — #ffffff): The dominant white. Product grids, cards, modals, inputs.
- **Canvas Warm** (`{colors.canvas-warm}` — #fafaf5): Warm off-white. Product image pedestals, alternating sections, category strips. This is SnapCart's equivalent of Apple's Parchment — just warm enough to create rhythm.
- **Canvas Parchment** (`{colors.canvas-parchment}` — #f5f5f0): Warmer still. Footer background on some pages, info sections, FAQ page canvas.
- **Pearl** (`{colors.surface-pearl}` — #fafafa): Input field and icon button backgrounds.
- **Dark 1** (`{colors.surface-dark-1}` — #1a1a1a): Primary dark surface — hero sections, footer, promotional banners.
- **Dark 2** (`{colors.surface-dark-2}` — #222222): Secondary dark — adjacent dark sections, promo cards.
- **Dark 3** (`{colors.surface-dark-3}` — #111111): Deep dark — immersive product showcases.
- **Black** (`{colors.surface-black}` — #000000): True black — global nav bar only.

### Text
- **Ink** (`{colors.ink}` — #171717): Primary text on light surfaces. Near-black, not pure black — keeps the page feeling photographic.
- **Ink Secondary** (`{colors.ink-secondary}` — #404040): Product descriptions, secondary body text.
- **Ink Muted** (`{colors.ink-muted}` — #737373): Placeholders, disabled labels, breadcrumbs.
- **Ink Faint** (`{colors.ink-faint}` — #a3a3a3): Fine-print, timestamps, legal text.
- **On Dark** (`{colors.on-dark}` — #ffffff): All text on dark surfaces.
- **On Dark Muted** (`{colors.on-dark-muted}` — #d4d4d4): Secondary text on dark surfaces — footer links, dark-tile descriptions.

### No Decorative Gradients
SnapCart follows Apple's zero-gradient rule for UI chrome. Gradients may appear in promotional hero imagery (photographic, not CSS-based) but never on buttons, cards, nav, or controls. Depth comes from surface color change, not from gradient overlays.

## Typography

### Font Stack
- **Editorial / Display**: `'DM Serif Display', Georgia, 'Times New Roman', serif` — A refined serif with personality. Used at hero and section-title sizes only. Gives SnapCart a premium editorial voice that pure sans-serif can't achieve for a lifestyle/home brand.
- **Functional / UI**: `'Inter', system-ui, -apple-system, sans-serif` — Clean, neutral, optimized for screens. Everything from body copy to buttons to navigation. Inter at weight 600 with tight tracking approximates Apple's SF Pro Display.

### Hierarchy

| Token | Size | Weight | Line Height | Tracking | Font | Use |
|---|---|---|---|---|---|---|
| `hero-display` | 56px | 400 | 1.07 | -0.5px | DM Serif Display | Home hero headline |
| `display-lg` | 40px | 600 | 1.1 | -0.4px | Inter | Page titles, promotional headlines |
| `display-md` | 32px | 600 | 1.2 | -0.32px | Inter | Product detail name, cart total |
| `section-title` | 28px | 400 | 1.25 | -0.2px | DM Serif Display | Section headings on home & catalog |
| `lead` | 24px | 400 | 1.4 | -0.1px | Inter | Hero subtitles, section descriptions |
| `lead-light` | 20px | 300 | 1.5 | 0 | Inter | Light-atmosphere editorial text |
| `tagline` | 18px | 600 | 1.3 | -0.1px | Inter | Sub-section labels, empty state titles |
| `body-strong` | 16px | 600 | 1.5 | -0.1px | Inter | Product names in cards, form labels |
| `body` | 16px | 400 | 1.6 | -0.1px | Inter | Default paragraph, descriptions |
| `body-small` | 14px | 400 | 1.5 | -0.06px | Inter | Filter labels, sidebar text, secondary info |
| `caption` | 13px | 400 | 1.4 | 0 | Inter | Category labels, dates, meta info |
| `caption-strong` | 13px | 600 | 1.3 | 0 | Inter | Emphasized captions, step labels |
| `price-display` | 20px | 700 | 1.0 | -0.2px | Inter | Primary price on product detail |
| `price-card` | 16px | 700 | 1.0 | -0.1px | Inter | Price on product cards, cart totals |
| `price-original` | 14px | 400 | 1.0 | 0 | Inter | Struck-through original price |
| `button-large` | 16px | 500 | 1.0 | 0 | Inter | Hero CTA buttons |
| `button-default` | 14px | 500 | 1.0 | 0 | Inter | Standard button text |
| `button-small` | 13px | 500 | 1.0 | 0 | Inter | Compact button text |
| `nav-link` | 13px | 400 | 1.0 | 0 | Inter | Global nav, category nav items |
| `fine-print` | 12px | 400 | 1.4 | 0 | Inter | Footer legal, timestamps |
| `badge` | 11px | 600 | 1.0 | 0.4px | Inter | Product badges, status badges (UPPERCASE) |

### Principles
- **DM Serif Display is the editorial voice.** Used only at 28px+ for hero headlines and section titles. It's the warm, curated "this is a lifestyle brand" signal. Never used for functional UI.
- **Inter is the workhorse.** Every button, every label, every price, every input. Clean and invisible.
- **Negative letter-spacing at display sizes.** Headlines at 16px and above carry slight tracking tighten (-0.1 to -0.5px). This produces the same "tight headline" cadence as Apple's SF Pro Display.
- **Body at 16px / 400 / 1.6** — slightly more generous line-height than Apple's 1.47. E-commerce product descriptions need to breathe more than marketing copy.
- **Weight 500 for buttons only.** The weight ladder is 300 (rare light) / 400 (body) / 500 (buttons) / 600 (strong/headlines) / 700 (prices). Weight 500 is exclusively for interactive button text — it's the "you can click me" weight.
- **Price typography is its own track.** Prices use weight 700 — the boldest weight in the system. They must be the most scannable element after the product image.
- **Badge text is UPPERCASE at 11px with 0.4px tracking.** This makes badges readable at small sizes without increasing font size.

### Currency Format
All prices display in Pakistani Rupee format: `Rs. X,XXX` — using the `formatPrice()` helper. Thousand separators use commas. No decimal places for whole numbers.

## Layout

### Spacing System
- **Base unit:** 8px. All structural spacing snaps to multiples of 4 or 8.
- **Tokens:** `xxs` 4px · `xs` 8px · `sm` 12px · `md` 16px · `lg` 24px · `xl` 32px · `2xl` 48px · `3xl` 64px · `section` 80px.
- **Section vertical padding:** `{spacing.section}` (80px) inside hero and section wrappers; drops to 48px on mobile.
- **Card internal padding:** `{spacing.md}` (16px) for product cards; `{spacing.lg}` (24px) for larger cards (cart summary, checkout cards).
- **Button padding:** 8–14px vertical, 16–32px horizontal depending on size variant.
- **Grid gap:** `{spacing.lg}` (24px) between product cards.

### Grid & Container
- **Max content width:** 1280px, centered with auto margins, with `{spacing.lg}` (24px) horizontal padding.
- **Product grid:** 4-column on desktop (≥1024px), 3-column on tablet (768–1023px), 2-column on mobile (<768px).
- **Catalog layout:** 280px fixed sidebar + flexible product grid on desktop. Full-width grid on mobile with sheet-based filters.
- **Cart/Checkout:** 2-column layout (items left, summary right) on desktop → stacks on mobile.
- **Gutters:** 24px between cards in product grids, 16px on mobile.

### Whitespace Philosophy
Following Apple's "product on a pedestal" approach: every product image has generous padding around it. Section headings sit with at least 48px of air above them. Product cards are never crowded. The product image area inside each card has 16px of internal padding on a warm background — the product floats, it doesn't touch the edges. On product detail pages, the image gallery has 32px internal padding.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow, no border | Full-bleed sections, nav bars, footer |
| Whisper | `{shadows.card-rest}` — `0 1px 3px rgba(0,0,0,0.04)` | Product cards at rest, category pills at rest |
| Soft | `{shadows.card-hover}` — `0 4px 16px rgba(0,0,0,0.08)` | Product cards on hover, category pills on hover |
| Product | `{shadows.product-image}` — `0 4px 24px rgba(0,0,0,0.08)` | Product image on detail page |
| Sticky | `{shadows.sticky-bar}` — `0 -1px 12px rgba(0,0,0,0.06)` | Floating cart bar, mobile bottom nav |
| Overlay | `{shadows.modal}` — `0 16px 48px rgba(0,0,0,0.16)` | Modals, sheets, search dropdown |
| Dropdown | `{shadows.dropdown}` — `0 4px 24px rgba(0,0,0,0.12)` | Search autocomplete, sort dropdown |

**Shadow philosophy:** Shadows are whisper-soft. At rest, a product card's shadow is barely perceptible — it's there to separate the card from the canvas, not to create drama. On hover, the shadow deepens gently while the card lifts 2px. Buttons never have shadows. The nav bar never has a shadow (it uses a hairline border instead). Only modals and overlays carry meaningful elevation.

**Depth through surface color:** Like Apple, SnapCart creates section rhythm through surface color alternation, not through shadows or borders. A white product grid section followed by a warm parchment category section followed by a dark hero section — the color changes are the architecture.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Full-bleed sections only |
| `{rounded.xs}` | 4px | Badges, checkboxes |
| `{rounded.sm}` | 8px | Form inputs, utility buttons, thumbnail images |
| `{rounded.md}` | 12px | Product image containers inside cards |
| `{rounded.lg}` | 16px | Product cards, cart items, review cards, order cards |
| `{rounded.xl}` | 20px | Promo banners, checkout cards, cart summary, image gallery |
| `{rounded.2xl}` | 24px | Large promotional sections (rare) |
| `{rounded.pill}` | 9999px | Primary/secondary CTAs, filter chips, search input, category nav items |
| `{rounded.full}` | 9999px | Icon buttons, avatar circles |

### Radius Grammar
- **Pill** = action. If it's pill-shaped, it's clickable. CTAs, filter chips, search bar.
- **Rounded-lg** (16px) = container. Product cards, list items, order cards.
- **Rounded-sm** (8px) = input/utility. Form fields, thumbnails, ghost buttons.
- Don't mix grammars. A card is always 16px, never pill-shaped. A CTA is always pill-shaped, never 16px.

### Product Image Treatment
- **In cards:** Product images sit inside a `{colors.canvas-warm}` container with `{rounded.md}` (12px) corners, 16px padding, 1:1 aspect ratio, `object-fit: contain`. The image never bleeds to the card edge.
- **On detail page:** Large image on `{colors.canvas-warm}` with `{rounded.xl}` (20px) corners, 32px padding. Thumbnails are 64×64 at `{rounded.sm}` (8px).
- **In cart:** Thumbnail at 80×80 with `{rounded.md}` (12px), canvas-warm background.

## Micro-Interactions & Animation

### Global Rules
- **Active/press on all buttons:** `transform: scale(0.97)` with `{transitions.fast}` (150ms). This is the system-wide "I pressed it" feedback, borrowed directly from Apple.
- **Card hover:** `translateY(-2px)` + shadow deepens from `card-rest` to `card-hover`, using `{transitions.smooth}` (300ms).
- **Focus rings:** `outline: 2px solid {colors.primary-focus}`, `outline-offset: 2px`. Every focusable element.
- **Page transitions:** Framer Motion `fadeIn` + slight `translateY(8px → 0)` on page/section mount. Duration 400ms, ease-out.
- **Skeleton loading:** Pulsing shimmer animation on `{colors.canvas-warm}` blocks. Matches the exact shape of the content being loaded.

### Specific Animations
- **Add to Cart:** Brief scale-up on the cart icon badge (1 → 1.2 → 1, spring easing, 400ms).
- **Wishlist heart:** Fill animation — outline heart morphs to filled heart with a quick scale pulse.
- **Product image hover (detail page):** Slight scale(1.02) on the image itself, not the container.
- **Announcement bar dismiss:** Slides up and collapses height with `{transitions.smooth}`.
- **Mobile sheet:** Slides up from bottom with spring easing. Drag-to-dismiss enabled.
- **Toast notifications:** Slide in from bottom-right (desktop) or bottom-center (mobile), auto-dismiss with a shrinking progress bar.

## Do's and Don'ts

### Do
- Use `{colors.primary}` (Emerald #059669) for every interactive element — links, pill CTAs, focus rings, active states, progress bars — and nothing else as an action color.
- Set hero headlines in DM Serif Display (400 weight) and everything else in Inter. The two-font system is non-negotiable.
- Alternate surface colors (white → warm → dark) for section rhythm. The color change IS the divider — no need for horizontal rules.
- Reserve `{rounded.pill}` for actions (CTAs, filter chips, search) and `{rounded.lg}` for containers (cards, cart items). The radius grammar communicates function.
- Give every product image a warm pedestal — `{colors.canvas-warm}` background with internal padding inside cards.
- Apply `transform: scale(0.97)` as the press state on every button.
- Keep card shadows whisper-soft at rest (`{shadows.card-rest}`) and gently deepen on hover.
- Use weight 700 exclusively for prices — prices must be the most scannable text after the product image.
- Use weight 500 exclusively for button text — it signals interactivity.
- Display all prices in `Rs. X,XXX` format using `formatPrice()`.
- Make the global nav true black (`{colors.surface-black}`) and the footer dark (`{colors.surface-dark-1}`).

### Don't
- Don't introduce a second action color. Amber, purple, and red are informational only — they appear on badges and ratings, never on buttons or links.
- Don't add shadows to buttons, nav, or text. Shadows exist on cards (whisper-soft), product images (detail page), and overlays (modals/sheets). Nothing else.
- Don't use CSS gradients on any UI element. Atmosphere comes from photography and surface-color alternation.
- Don't use weight 500 outside of buttons. Don't use weight 700 outside of prices. The weight ladder has meaning.
- Don't use DM Serif Display below 28px or for any functional UI text.
- Don't round full-bleed sections — hero sections and category strips are edge-to-edge.
- Don't crowd product images — maintain at least 16px padding between the image and its container edge.
- Don't use `{colors.primary-on-dark}` (light emerald) on light surfaces — it's the dark-surface-only variant.
- Don't put product badges inside the text area of cards — they float over the image area only.
- Don't mix radius grammars — a card is never pill-shaped, a CTA is never square-cornered.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 640px | Single-column product grid (2-col), stacked layouts, bottom nav visible, hamburger menu, hero min-height 60vh, section padding 48px |
| Tablet portrait | 640–767px | 2-column product grid, sidebar hidden (sheet), hero typography drops to display-md |
| Tablet landscape | 768–1023px | 3-column product grid, sidebar visible on catalog, cart/checkout 2-column |
| Desktop | 1024–1279px | 4-column product grid, full nav, full sidebar |
| Wide desktop | ≥ 1280px | Content locks at 1280px, margins absorb extra width |

### Navigation Collapse
- **Desktop (≥1024px):** Full global-nav (logo + search + links + icons) + category-nav bar below.
- **Tablet (768–1023px):** Global-nav condenses — search collapses to icon, some links hide.
- **Mobile (<768px):** Global-nav → logo + hamburger + cart icon. Category-nav hides entirely — categories move into the hamburger drawer. Mobile bottom nav appears.

### Touch Targets
- Minimum 44×44px for all interactive elements on mobile.
- Product cards have generous tap areas — the entire card is tappable for navigation.
- Quantity stepper buttons are 36×36px minimum (the inner +/− buttons are 28×28 but have 4px padding).
- Bottom nav icons have 56px tall touch zones.

### Image Behavior
- Product images in cards maintain 1:1 aspect ratio across all breakpoints.
- Hero images use responsive `srcset` with art-direction changes at mobile (tighter crop, different composition).
- Product detail gallery switches from side-by-side (image left, info right) to stacked (image top, info below) at 768px.
- Lazy-loading on all images below the fold. Above-fold hero loads eagerly.

## Page-by-Page Surface Map

| Page | Surface Rhythm (top → bottom) |
|---|---|
| **Home** | Announcement bar (primary) → Global nav (black) → Hero (dark-1) → Category section (canvas-warm) → "Top Selling" grid (canvas) → Promo banner (dark-2, rounded) → "Exclusive" grid (canvas) → Newsletter strip (canvas-warm) → Footer (dark-1) |
| **Catalog** | Announcement → Nav → Breadcrumb strip (canvas) → Sidebar + Grid (canvas) → Footer (dark-1) |
| **Product Detail** | Announcement → Nav → Breadcrumb (canvas) → Image gallery + Info (canvas) → Tabs section (canvas) → Related products (canvas-warm) → Footer (dark-1) |
| **Cart** | Announcement → Nav → Cart items + Summary (canvas) → "You may also like" (canvas-warm) → Footer (dark-1) |
| **Checkout** | Announcement → Nav → Stepper + Form cards + Summary (canvas) → Footer (dark-1) |
| **Orders** | Announcement → Nav → Order cards (canvas) → Footer (dark-1) |
| **Auth** | Announcement → Nav → Centered auth card (canvas, canvas-warm background) → Footer (dark-1) |
| **FAQ** | Announcement → Nav → Accordion cards (canvas, canvas-parchment background) → Footer (dark-1) |
| **Contact** | Announcement → Nav → Contact form + Info cards (canvas) → Map section (canvas-warm) → Footer (dark-1) |

## Iteration Guide

1. **Focus on ONE component at a time.** Reference its YAML key directly (`{component.product-card}`, `{component.search-input}`, `{component.cart-summary}`).
2. **Variants** of an existing component (badges, status, hover states) live as sub-properties or separate entries.
3. **Use `{token.refs}` everywhere** — never inline hex values, pixel sizes, or font stacks.
4. **Active state = scale(0.97)** on every button. No other press feedback.
5. **Hero headlines = DM Serif Display 400.** Everything else = Inter. The boundary is unbreakable.
6. **Shadows are reserved** for cards (whisper), product images (soft), and overlays (meaningful). Never on buttons or nav.
7. **When in doubt about emphasis:** change the surface color (white → warm → dark) before adding chrome, borders, or shadows.
8. **Price formatting:** Always use `formatPrice()` → `Rs. X,XXX`. Prices are weight 700, the boldest element on any card.
9. **Test every component** against both light and dark surfaces before considering it done.

## Known Gaps & Future Considerations

- **Dark mode:** This system documents the light-dominant variant. A full dark mode inversion (swapping canvas↔dark surfaces) is a future enhancement.
- **RTL support:** Urdu language support may require RTL layout adjustments. The spacing and grid system is direction-agnostic, but icon positions and text alignment will need RTL variants.
- **Accessibility:** WCAG 2.1 AA contrast ratios have been considered for all text/background combinations. The primary emerald (#059669) on white passes AA for large text but may need verification for small text — consider using `{colors.primary-hover}` (#047857) for body-small text links.
- **Payment UI screenshots:** The JazzCash/Bank Transfer payment method cards include a receipt screenshot upload area — this is a Pakistan-specific pattern not covered by standard e-commerce design systems.
- **Admin dashboard:** The admin interface (`/admin`) uses a separate, more utilitarian design language. This design system covers the customer-facing storefront only.
- **Promotional hero photography:** The dark hero sections rely on high-quality product composition photography. Placeholder images should be replaced with professional lifestyle shots of home decor and kitchen products for full visual impact.
