# Project Architecture and Best Practices

## Folder Structure Philosophy

This project follows a **feature-based** and **domain-driven** structure that scales well with project growth.

### `/src/app` - Next.js App Router
- Contains all route definitions
- Each folder represents a route
- `layout.tsx` for shared layouts
- `page.tsx` for route content
- `loading.tsx` for loading states
- `error.tsx` for error boundaries

### `/src/components` - React Components
Organized by feature/domain:

#### `/layout` - Global Layout Components
- Header with navigation
- Footer with links
- Sidebars, navigation bars

#### `/home` - Homepage Specific
- Hero sections
- Feature sections
- Testimonials

#### `/product` - Product Related
- Product cards
- Product grids
- Product details
- Product galleries

#### `/cart` - Shopping Cart
- Cart items
- Cart summary
- Cart drawer/modal

#### `/checkout` - Checkout Process
- Checkout forms
- Payment components
- Order summary

#### `/shared` - Reusable Components
- Loading states
- Empty states
- Error messages
- Breadcrumbs

#### `/ui` - shadcn/ui Components
- Auto-generated from shadcn CLI
- Base UI components
- Do not modify directly

### `/src/contexts` - React Contexts
- Global state management
- Use for cross-cutting concerns (cart, auth, theme)
- Keep lightweight, split by domain

### `/src/hooks` - Custom Hooks
- Reusable logic
- Name with `use` prefix
- Examples: `useLocalStorage`, `useDebounce`, `useProduct`

### `/src/types` - TypeScript Types
- Centralized type definitions
- Shared interfaces and types
- Domain models

### `/src/constants` - Application Constants
- Configuration values
- Static data
- Environment-agnostic constants

### `/src/data` - Mock/Sample Data
- Development data
- Seed data
- Replace with API calls in production

### `/src/utils` - Utility Functions
- Pure functions
- Helpers and formatters
- No side effects

### `/src/lib` - Third-party Integrations
- SDK configurations
- API clients
- External service wrappers

## Component Guidelines

### File Naming
- Components: PascalCase (e.g., `ProductCard.tsx`)
- Utilities: camelCase (e.g., `formatPrice.ts`)
- Constants: UPPER_SNAKE_CASE in files, camelCase filenames

### Component Structure
```tsx
// 1. Imports
import { type } from "library";

// 2. Types/Interfaces
interface ComponentProps {
  // props
}

// 3. Component
export default function Component({ prop }: ComponentProps) {
  // 4. Hooks
  const [state, setState] = useState();
  
  // 5. Handlers
  const handleClick = () => {};
  
  // 6. Effects
  useEffect(() => {}, []);
  
  // 7. Render
  return <div>...</div>;
}
```

### State Management Strategy

1. **Local State**: `useState` for component-specific state
2. **Shared State**: Context API for cart, auth, theme
3. **Server State**: Next.js server components and server actions
4. **URL State**: searchParams for filters, pagination

### Styling Guidelines

1. **Use Tailwind Utilities**: Prefer utilities over custom CSS
2. **Component Variants**: Use `class-variance-authority` for variants
3. **Use cn() Utility**: For conditional classes
4. **Avoid Inline Styles**: Unless dynamic values required

Example:
```tsx
import { cn } from "@/lib/utils";

<div className={cn(
  "base-classes",
  isActive && "active-classes",
  className
)} />
```

## TypeScript Best Practices

1. **Prefer Interfaces over Types** for object shapes
2. **Use Type for Unions** and complex types
3. **Export Types** from `/types` directory
4. **Avoid `any`**: Use `unknown` if type is truly unknown
5. **Use Generics** for reusable components

## Performance Considerations

1. **Image Optimization**: Always use Next.js `<Image>`
2. **Code Splitting**: Use dynamic imports for heavy components
3. **Memoization**: Use `useMemo` and `useCallback` judiciously
4. **Server Components**: Default to server components, use client only when needed

## Accessibility

1. **Semantic HTML**: Use appropriate HTML elements
2. **ARIA Labels**: Add for interactive elements
3. **Keyboard Navigation**: Support tab navigation
4. **Color Contrast**: Follow WCAG guidelines
5. **Focus States**: Visible focus indicators

## SEO Best Practices

1. **Metadata**: Use Next.js metadata API
2. **Semantic Structure**: Proper heading hierarchy
3. **Alt Text**: Descriptive image alt attributes
4. **Schema Markup**: Add structured data where applicable
5. **Links**: Descriptive link text

## Future Scaling

As the project grows:

1. **Create Feature Modules**: Group related components, hooks, utils
2. **Add Testing**: Jest + React Testing Library
3. **Add Storybook**: Component documentation
4. **API Layer**: Centralize API calls in `/lib/api`
5. **Error Handling**: Standardized error boundaries
6. **Logging**: Add analytics and error tracking

## Naming Conventions

### Routes
- Lowercase with hyphens: `/products/mens-shoes`
- Grouping: `(group)` for organization without route
- Dynamic: `[id]` for dynamic segments

### Components
- PascalCase: `ProductCard`, `HeroSection`
- Descriptive: Name by what it is, not what it does

### Functions
- camelCase: `formatPrice`, `handleSubmit`
- Action prefixes: `handle`, `fetch`, `update`, `delete`

### Constants
- UPPER_SNAKE_CASE: `FREE_SHIPPING_THRESHOLD`
- Descriptive and specific

---

This architecture supports scalability, maintainability, and team collaboration while maintaining clean code principles.
