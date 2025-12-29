# Component Library Conventions

## Component Structure

```
components/
├── ui/              # Base UI components (buttons, inputs, etc.)
├── features/        # Feature-specific components
├── layouts/         # Layout components
└── shared/          # Shared utility components
```

## Component Guidelines

### File Naming
- PascalCase for component files: `UserProfile.tsx`
- Co-locate styles if using CSS modules: `UserProfile.module.css`
- Co-locate tests: `UserProfile.test.tsx`

### Component Template

```typescript
import { ComponentProps } from '@/types';

interface UserProfileProps {
  name: string;
  email: string;
  onUpdate?: () => void;
}

export function UserProfile({
  name,
  email,
  onUpdate
}: UserProfileProps) {
  return (
    <div className="user-profile">
      {/* Component content */}
    </div>
  );
}
```

## Component Patterns

### Composition over Props
```typescript
// ✅ Good - Composition
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// ❌ Avoid - Too many props
<Card title="Title" content="Content" hasHeader />
```

### Props Interface
- Export props interfaces for reusability
- Use descriptive prop names
- Provide sensible defaults
- Document complex props

### Variants
```typescript
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  'base-button-styles',
  {
    variants: {
      variant: {
        primary: 'bg-blue-500',
        secondary: 'bg-gray-500'
      },
      size: {
        sm: 'text-sm',
        md: 'text-base'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
);
```

## State Management

- Use local state for component-specific data
- Lift state when needed by multiple components
- Use context for deeply nested props
- Consider state management libraries for complex state

## Performance

1. Memoize expensive computations with `useMemo`
2. Memoize callbacks with `useCallback`
3. Use `React.memo` for expensive components
4. Lazy load heavy components

## Accessibility

- Use semantic HTML
- Include ARIA labels when needed
- Ensure keyboard navigation
- Test with screen readers
- Maintain focus management

## Documentation

```typescript
/**
 * Displays user profile information
 *
 * @param name - User's full name
 * @param email - User's email address
 * @param onUpdate - Optional callback when profile is updated
 */
export function UserProfile({ name, email, onUpdate }: UserProfileProps) {
  // ...
}
```
