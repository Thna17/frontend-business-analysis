# LUXE Development Guide

## Quick Start

### Running the Project
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

Access the site at: **http://localhost:3000**

## Adding New Features

### 1. Adding a New Page

Create a new route in `/src/app`:

```bash
# Example: Create a about page
mkdir src/app/about
```

Create `src/app/about/page.tsx`:
```tsx
export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <h1 className="text-4xl font-serif mb-6">About Us</h1>
      {/* Your content */}
    </div>
  );
}
```

### 2. Adding shadcn/ui Components

```bash
# Add a component
npx shadcn@latest add [component-name]

# Examples:
npx shadcn@latest add toast
npx shadcn@latest add form
npx shadcn@latest add table
```

### 3. Creating a New Component

Create in appropriate folder (e.g., `/src/components/product/product-filter.tsx`):

```tsx
"use client"; // If using hooks, state, or events

import { useState } from "react";

interface ProductFilterProps {
  onFilter: (filters: any) => void;
}

export default function ProductFilter({ onFilter }: ProductFilterProps) {
  const [selected, setSelected] = useState([]);
  
  return (
    <div>
      {/* Component content */}
    </div>
  );
}
```

### 4. Adding a New Product Category

Update `/src/data/products.ts`:
```typescript
export const categories: Category[] = [
  // ... existing categories
  {
    id: "5",
    name: "Accessories",
    slug: "accessories",
    description: "Complete your look",
    image: "/images/categories/accessories.jpg",
  },
];
```

### 5. Adding Animations

Using Framer Motion:
```tsx
import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

## Common Tasks

### Updating Navigation

Edit `/src/constants/index.ts`:
```typescript
export const NAVIGATION_ITEMS = [
  // Add or modify items
];
```

### Modifying Theme Colors

Edit `/src/app/globals.css`:
```css
:root {
  --primary: /* your color */;
  /* ... */
}
```

### Adding Custom Hooks

Create in `/src/hooks/use-example.ts`:
```typescript
import { useState, useEffect } from "react";

export function useExample() {
  // Hook logic
  return { /* exports */ };
}
```

### Working with Cart

```tsx
"use client";

import { useCart } from "@/contexts/cart-context";

export default function Component() {
  const { cart, addToCart, removeFromCart } = useCart();
  
  const handleAdd = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
  };
  
  return (
    <button onClick={handleAdd}>
      Add to Cart ({cart.items.length})
    </button>
  );
}
```

## Styling Guidelines

### Using Tailwind Classes
```tsx
// Good - semantic grouping
<div className="
  flex items-center gap-4
  p-4 rounded-lg
  bg-white shadow-md
  hover:shadow-lg transition-shadow
">
```

### Conditional Classes
```tsx
import { cn } from "@/lib/utils";

<div className={cn(
  "base-classes",
  isActive && "active-classes",
  isDisabled && "disabled-classes"
)} />
```

### Custom Variants
```tsx
import { cva } from "class-variance-authority";

const buttonVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        default: "bg-black text-white",
        outline: "border-2 border-black",
      },
      size: {
        sm: "px-4 py-2 text-sm",
        lg: "px-8 py-4 text-lg",
      },
    },
  }
);
```

## Image Optimization

Always use Next.js Image component:
```tsx
import Image from "next/image";

<Image
  src="/path/to/image.jpg"
  alt="Description"
  width={800}
  height={600}
  className="rounded-lg"
  priority // For above-the-fold images
/>
```

## Performance Tips

1. **Use Server Components by Default**
   - Only add `"use client"` when needed
   - Needed for: useState, useEffect, event handlers

2. **Lazy Load Heavy Components**
```tsx
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(
  () => import("@/components/heavy-component"),
  { loading: () => <p>Loading...</p> }
);
```

3. **Optimize Images**
   - Use WebP format
   - Proper sizing
   - Lazy loading for below-fold images

## Deployment Checklist

- [ ] Update environment variables
- [ ] Test build: `npm run build`
- [ ] Update metadata in `layout.tsx`
- [ ] Add real product images
- [ ] Configure analytics
- [ ] Set up error tracking
- [ ] Test on multiple devices
- [ ] Run accessibility audit
- [ ] Set up CDN for images
- [ ] Configure caching headers

## Useful Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### Clear Next.js Cache
```bash
rm -rf .next
npm run dev
```

### TypeScript Errors
```bash
# Check for errors
npx tsc --noEmit
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Support

For questions or issues, refer to:
- README.md - Project overview
- ARCHITECTURE.md - Code organization
- Component documentation in respective files

---

Happy coding! 🚀
