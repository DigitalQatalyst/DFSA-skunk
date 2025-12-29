# Tailwind CSS Guidelines

## Configuration

- Use a custom design system in `tailwind.config.js`
- Define project colors, spacing, and breakpoints
- Leverage the `theme` configuration

## Class Organization

### Order of Classes
1. Layout (display, position, etc.)
2. Box model (width, height, padding, margin)
3. Typography (font, text)
4. Visual (background, border, shadow)
5. Misc (cursor, transform, etc.)

```tsx
// Good
<div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md">

// Avoid
<div className="shadow-md bg-white flex gap-4 p-4 rounded-lg items-center">
```

## Responsive Design

```tsx
<div className="text-sm md:text-base lg:text-lg">
  Mobile first approach
</div>
```

## Custom Classes

- Use `@apply` sparingly
- Prefer component abstraction over `@apply`
- Keep utilities for one-off styling

## Component Patterns

```tsx
// Use cn() helper for conditional classes
import { cn } from '@/lib/utils';

<Button className={cn(
  'base-styles',
  variant === 'primary' && 'primary-styles',
  className
)} />
```

## Color System

- Use semantic color names
- Leverage opacity modifiers: `bg-blue-500/50`
- Define colors in config, not arbitrary values

## Performance

1. Purge unused styles in production
2. Use JIT mode for development
3. Avoid arbitrary values when possible: `w-[123px]` → prefer predefined values

## Best Practices

1. Keep component-specific styles in the component
2. Extract common patterns to components
3. Use Tailwind plugins for custom utilities
4. Document custom configuration
5. Maintain consistent spacing scale

## Anti-Patterns

- Overly long className strings (extract to component)
- Mixing Tailwind with traditional CSS unnecessarily
- Not using design tokens from config
