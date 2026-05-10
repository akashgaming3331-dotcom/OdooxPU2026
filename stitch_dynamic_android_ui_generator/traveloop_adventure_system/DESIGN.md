---
name: Traveloop Adventure System
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#44474d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#75777e'
  outline-variant: '#c5c6ce'
  surface-tint: '#4e5f7c'
  primary: '#00030a'
  on-primary: '#ffffff'
  primary-container: '#0a1d37'
  on-primary-container: '#7586a5'
  inverse-primary: '#b6c7e9'
  secondary: '#00696b'
  on-secondary: '#ffffff'
  secondary-container: '#56f5f8'
  on-secondary-container: '#006e70'
  tertiary: '#090100'
  on-tertiary: '#ffffff'
  tertiary-container: '#3b0d00'
  on-tertiary-container: '#d76135'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#b6c7e9'
  on-primary-fixed: '#081c36'
  on-primary-fixed-variant: '#364763'
  secondary-fixed: '#5af8fb'
  secondary-fixed-dim: '#2ddbde'
  on-secondary-fixed: '#002020'
  on-secondary-fixed-variant: '#004f51'
  tertiary-fixed: '#ffdbcf'
  tertiary-fixed-dim: '#ffb59c'
  on-tertiary-fixed: '#380c00'
  on-tertiary-fixed-variant: '#822800'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-padding: 20px
  card-gap: 16px
  section-margin: 32px
  touch-target: 48px
---

## Brand & Style

This design system is built to balance the logistical precision of itinerary planning with the aspirational spirit of global exploration. The brand personality is **reliable, organized, and inspiring**. It targets modern travelers who value efficiency but seek "moments of delight" during the planning process.

The visual style is **Corporate Modern with Tactile nuances**. It leverages a "Material-Adjacent" philosophy specifically tailored for Android, emphasizing a clear information hierarchy to manage dense itinerary data without overwhelming the user. High-quality whitespace and a refined color palette ensure a premium feel, while vibrant accents inject the "adventure" element into functional views.

## Colors

The palette is anchored by **Deep Navy (#0A1D37)**, used for primary branding, navigation components, and high-level headings to establish authority and trust. **Crisp White (#FFFFFF)** and **Slate Tinted Neutrals (#F8FAFC)** serve as the primary canvas, ensuring the UI remains airy and legible.

Actionable elements and exploration cues utilize two vibrant accents:
- **Sunset Orange (#FF7F50)**: Used for primary Call-to-Actions (CTAs), "Plan a Trip" triggers, and highlighting upcoming departures.
- **Teal (#00CED1)**: Used for secondary actions, itinerary "markers," and categories related to water, nature, or relaxation.

Data-heavy screens use a subtle grayscale range for borders and secondary text to maintain a low cognitive load.

## Typography

This design system utilizes **Plus Jakarta Sans** for its contemporary, friendly, and highly legible characteristics. The typeface’s open counters and geometric structure make it ideal for the complex tables and lists found in travel itineraries.

- **Headlines:** Use Bold and Semi-Bold weights in Navy to anchor sections.
- **Body:** Regular weight in a dark slate grey for maximum readability during long reading sessions (e.g., trip notes or activity descriptions).
- **Labels:** Small, all-caps Semi-Bold tracking is applied to metadata (e.g., flight numbers, dates, currency) to create visual distinction from narrative content.

## Layout & Spacing

The layout follows a **Fluid Grid** model optimized for Android handheld devices, scaling gracefully to tablets. A baseline 8px grid system ensures vertical rhythm and consistent alignment.

- **Margins:** 20px side margins provide a breathable frame for content.
- **Gutters:** 16px gutters between cards and list items.
- **Information Density:** While the app handles complex data, whitespace is prioritized. Itinerary steps should have generous padding (16px - 20px) to prevent "visual clutter" during stressful travel moments.
- **Mobile-First:** All primary navigation must be reachable within the bottom "thumb zone."

## Elevation & Depth

Hierarchy is established through **Ambient Shadows** and **Tonal Layering**. Unlike flat design, this system uses depth to signify interactivity and "stacking" of travel documents.

- **Base Level (0dp):** The main background (Neutral Slate).
- **Surface Level (1dp):** White cards and containers with a very subtle, diffused shadow (Blur: 8px, Y: 2px, Opacity: 4% Black).
- **Active Level (2dp):** Floating Action Buttons (FABs) and active trip cards use a more pronounced shadow with a slight Navy tint to appear "lifted" and ready for interaction.
- **Overlays:** Modals and bottom sheets use a 40% backdrop blur to maintain context of the underlying itinerary.

## Shapes

The shape language is **Rounded**, conveying friendliness and approachability. 

- **Primary Cards:** 1rem (16px) corner radius for a soft, premium feel.
- **Buttons & Inputs:** 0.5rem (8px) corner radius to provide a structural, professional look.
- **Chips & Tags:** Fully pill-shaped for quick visual scanning of categories like "Flight," "Hotel," or "Activity."
- **Image Containers:** Always follow the corner radius of their parent card to maintain a cohesive "nested" appearance.

## Components

### Buttons
- **Primary:** Solid Sunset Orange with white text. High-emphasis for "Book Now" or "Create Trip."
- **Secondary:** Outlined Navy or Teal. Used for "Edit" or "Add Detail."
- **Ghost:** Text-only for low-priority actions like "Cancel" or "View More."

### Itinerary Cards
The signature component. Must include a vertical "timeline thread" on the left, connecting different activities. Use Navy for the thread and Teal for the "Current Location" marker. 

### Input Fields
Filled style with a 2px bottom border in Navy when active. Placeholder text should be a light slate. Soft 8px rounded corners on the container.

### Chips & Filters
Small pill-shaped elements with a light Teal background and Dark Teal text for active states. These should be horizontally scrollable at the top of search views.

### Progress Indicators
Used for packing checklists and budget tracking. Use a slim 4px track in light grey with a vibrant Teal fill to show completion.

### Bottom Sheets
The primary container for "Add New Item" tasks. Should have a prominent "grab handle" at the top and 24px top corner radius.