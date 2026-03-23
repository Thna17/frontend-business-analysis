# Quick Reference Card

## 🚀 Common Commands

### Development
```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

### Adding Components
```bash
npx shadcn@latest add [component]    # Add shadcn component
npx shadcn@latest add form           # Example: Add form
```

### Common shadcn Components
```bash
toast        # Toast notifications
form         # Form with validation
table        # Data tables
popover      # Popover menu
command      # Command palette
calendar     # Date picker
checkbox     # Checkboxes
radio-group  # Radio buttons
switch       # Toggle switches
slider       # Range slider
```

## 📁 File Structure Quick Reference

### Where to Put New Files
```
New Page           → src/app/[route]/page.tsx
Layout Component   → src/components/layout/
Feature Component  → src/components/[feature]/
Shared Component   → src/components/shared/
Context/State      → src/contexts/
Custom Hook        → src/hooks/use-[name].ts
Type Definition    → src/types/
Constant/Config    → src/constants/
Utility Function   → src/utils/
Sample Data        → src/data/
```

## 🎨 Common Code Patterns

### Client Component with State
```tsx
"use client";
import { useState } from "react";

export default function Component() {
  const [state, setState] = useState(initial);
  return <div>...</div>;
}
```

### Server Component (Default)
```tsx
export default function Component() {
  // No hooks, no events
  return <div>...</div>;
}
```

### Using Cart Context
```tsx
"use client";
import { useCart } from "@/contexts/cart-context";

export default function Component() {
  const { cart, addToCart, itemCount } = useCart();
  // Use cart methods
}
```

### Conditional Styling
```tsx
import { cn } from "@/lib/utils";

<div className={cn(
  "base-classes",
  isActive && "active-classes",
  className
)} />
```

### Link to Page
```tsx
import Link from "next/link";

<Link href="/path">Text</Link>
```

### Optimized Image
```tsx
import Image from "next/image";

<Image
  src="/path.jpg"
  alt="Description"
  width={800}
  height={600}
  priority  // For above-fold images
/>
```

### Dynamic Route
```tsx
// File: app/products/[slug]/page.tsx
export default function Page({ 
  params 
}: { 
  params: { slug: string } 
}) {
  return <div>{params.slug}</div>;
}
```

### Animation with Framer Motion
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

## 🎯 Import Aliases

```tsx
@/              → src/
@/components    → src/components
@/lib           → src/lib
@/types         → src/types
@/constants     → src/constants
@/contexts      → src/contexts
@/hooks         → src/hooks
@/utils         → src/utils
@/data          → src/data
```

## 🔧 Troubleshooting

### Server Won't Start
```bash
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

### Port Already in Use
```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

### TypeScript Errors
```bash
npx tsc --noEmit  # Check for errors
```

### Clear Cache
```bash
rm -rf .next
```

## 📊 Project Stats

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Components**: 16 shadcn/ui + 6 custom
- **Files Created**: 29 TS/TSX files
- **Documentation**: 6 markdown files
- **Lines of Code**: 2,500+ TypeScript
- **Features**: Cart, Products, Navigation

## 🔗 Quick Links

- Dev Server: http://localhost:3000
- [README.md](README.md) - Overview
- [ARCHITECTURE.md](ARCHITECTURE.md) - Code structure
- [DEVELOPMENT.md](DEVELOPMENT.md) - Dev guide
- [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) - Design specs

## 📝 Next Tasks Checklist

- [ ] Replace "LUXE" with your brand name
- [ ] Add real product images
- [ ] Create product detail page
- [ ] Create cart page
- [ ] Add search functionality
- [ ] Integrate payment (Stripe)
- [ ] Set up database
- [ ] Add authentication
- [ ] Deploy to Vercel

## 💡 Pro Tips

1. Use `cmd/ctrl + click` on imports to jump to file
2. Run `npm run build` before deploying
3. Test on real mobile devices
4. Optimize images before uploading
5. Use TypeScript for type safety
6. Keep components small and focused
7. Document complex logic
8. Commit frequently with clear messages

---

**Bookmark this file for quick reference! 📌**
