# 🎨 LUXE - Visual Design Showcase

## Color Palette

### Primary Colors
```
Black:      #000000  (Primary CTA, Text)
White:      #FFFFFF  (Background, Cards)
Neutral-50: #FAFAFA  (Section Backgrounds)
Neutral-100:#F5F5F5  (Alternate Backgrounds)
```

### Accent Colors
```
Purple-200: rgba(221, 214, 254, 0.3)  (Gradient Accents)
Pink-200:   rgba(251, 207, 232, 0.3)  (Gradient Accents)
Blue-200:   rgba(191, 219, 254, 0.3)  (Gradient Accents)
```

### Semantic Colors
```
Gray-600:   #4B5563  (Secondary Text)
Gray-800:   #1F2937  (Hover States)
Red-600:    #DC2626  (Sale Badges)
```

## Typography

### Font Families
```
Headings:  Playfair Display (Serif)
Body:      Inter (Sans-serif)
```

### Font Sizes
```
9xl:  128px  (404 Page)
5xl:  48px   (H1 Headings)
4xl:  36px   (H2 Headings)
2xl:  24px   (Logo)
lg:   18px   (Body Large)
base: 16px   (Body)
sm:   14px   (Small Text)
xs:   12px   (Captions)
```

### Font Weights
```
light:    300  (Serif Subheadings)
normal:   400  (Body Text)
medium:   500  (Buttons, Labels)
semibold: 600  (Emphasized Text)
```

## Spacing System

### Based on 4px grid
```
0.5: 2px    5:  20px
1:   4px    6:  24px
2:   8px    8:  32px
3:  12px   12:  48px
4:  16px   16:  64px
```

## Border Radius
```
md:   6px   (Buttons, Inputs)
lg:   8px   (Cards)
xl:  12px   (Modals)
full: 50%   (Badges, Avatars)
```

## Shadows
```
sm:  0 1px 2px rgba(0,0,0,0.05)
md:  0 4px 6px rgba(0,0,0,0.1)
lg:  0 10px 15px rgba(0,0,0,0.1)
xl:  0 20px 25px rgba(0,0,0,0.1)
```

## Components Design

### Buttons
```tsx
Primary:
- Background: Black
- Text: White
- Hover: Gray-800
- Transition: 200ms

Secondary:
- Border: 2px Black
- Text: Black
- Hover: Black background, White text
- Transition: 200ms
```

### Cards
```tsx
Product Card:
- Aspect Ratio: 3:4
- Border Radius: 8px
- Shadow on Hover: lg
- Image Scale on Hover: 105%
- Transition: 500ms
```

### Navigation
```tsx
Header:
- Height: 80px
- Padding: 16px 32px
- Background: Transparent → White/95 on scroll
- Backdrop Blur: md
- Shadow on Scroll: sm
```

## Animations

### Hero Section
```
Text Animations:
- Fade In + Slide Up
- Stagger: 200ms between elements
- Duration: 800ms
- Easing: ease-out

Background:
- Floating Gradients
- Movement: 100px radius
- Duration: 15-20s
- Loop: Infinite
```

### Product Cards
```
Hover Effects:
- Image Scale: 100% → 105%
- Shadow: none → lg
- Quick Add Button: opacity 0 → 1
- Wishlist Button: opacity 0 → 1
- Transition: 300-500ms
```

### Page Transitions
```
Load Animation:
- Initial: opacity 0, y: 20px
- Final: opacity 1, y: 0
- Duration: 500ms
```

## Layout Structure

### Container
```
Max Width: 1280px
Padding: 16px mobile, 32px desktop
Margin: auto
```

### Grid System
```
Mobile:   1 column
Tablet:   2 columns
Desktop:  4 columns
Gap:      32px
```

### Section Spacing
```
Padding Y: 96px desktop, 64px mobile
```

## Responsive Breakpoints

```
sm:  640px   (Mobile landscape)
md:  768px   (Tablet)
lg:  1024px  (Desktop)
xl:  1280px  (Large desktop)
2xl: 1536px  (Extra large)
```

## Interactive States

### Hover
```
- Scale transform
- Color change
- Shadow increase
- Opacity change
- Smooth transitions
```

### Focus
```
- Visible outline
- Ring color: gray-700
- Ring width: 2px
- Ring offset: 2px
```

### Active
```
- Scale: 98%
- Brightness: 90%
- Quick transition: 100ms
```

## Micro-interactions

### Buttons
```
Hover: Scale 102%, shadow increase
Active: Scale 98%
Icon: Translate on hover
```

### Links
```
Hover: Color change, underline
Transition: 200ms
```

### Images
```
Hover: Scale 105%
Transition: 500ms ease-out
```

## Design Principles

### 1. Generous White Space
- Let content breathe
- 96px section padding
- 32px between elements

### 2. Premium Typography
- Serif for elegance
- Sans-serif for readability
- Proper hierarchy

### 3. Smooth Animations
- No jarring movements
- 300-500ms transitions
- Ease-out timing

### 4. Consistent Spacing
- 4px grid system
- Predictable layouts
- Visual rhythm

### 5. Subtle Interactions
- Micro-animations
- Hover states
- Loading states

## Accessibility

### Color Contrast
```
Text/Background: Minimum 4.5:1
Large Text: Minimum 3:1
Interactive Elements: Clear focus states
```

### Typography
```
Minimum: 14px (0.875rem)
Body: 16px (1rem)
Line Height: 1.5-1.75
```

### Interactive Elements
```
Minimum Touch Target: 44x44px
Keyboard Navigation: Full support
Focus Indicators: Visible
ARIA Labels: Present
```

## Brand Voice (Visual)

### Adjectives
- Elegant
- Luxurious
- Timeless
- Sophisticated
- Premium
- Refined

### Visual Style
- Minimalist
- High-end
- Classic
- Contemporary
- Polished

---

This design system creates a cohesive, luxury brand experience that rivals high-end fashion brands like Dior, Chanel, and Hermès.
