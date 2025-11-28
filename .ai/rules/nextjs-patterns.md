# Next.js Patterns

## Project Structure

```
app/
├── (routes)/
│   ├── page.tsx
│   └── layout.tsx
├── api/
├── components/
└── lib/
```

## App Router Conventions

### Server vs Client Components

- **Default to Server Components** for better performance
- Use `'use client'` only when needed:
  - Event handlers (onClick, onChange, etc.)
  - Browser APIs (localStorage, window, etc.)
  - State hooks (useState, useReducer, etc.)
  - Effect hooks (useEffect, useLayoutEffect)

### Data Fetching

```typescript
// Server Component
async function Page() {
  const data = await fetch('...', { cache: 'no-store' });
  return <div>{/* render */}</div>;
}

// Use loading.tsx for loading states
// Use error.tsx for error handling
```

## Routing

- Use folder-based routing
- Leverage route groups `(group-name)`
- Use parallel routes for complex layouts
- Implement intercepting routes when needed

## Performance

1. **Image Optimization**: Always use `next/image`
2. **Font Optimization**: Use `next/font`
3. **Code Splitting**: Dynamic imports for heavy components
4. **Streaming**: Use Suspense boundaries strategically

## Metadata

```typescript
export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Description',
};

// Or generate dynamically
export async function generateMetadata({ params }): Promise<Metadata> {
  return { title: '...' };
}
```

## Best Practices

1. Keep Server Components async when fetching data
2. Use Server Actions for mutations
3. Implement proper error boundaries
4. Optimize for Core Web Vitals
5. Use environment variables correctly

## Anti-Patterns

- Don't use `useEffect` for data fetching in Server Components
- Avoid unnecessary client components
- Don't fetch data in layouts (use parallel data fetching instead)
