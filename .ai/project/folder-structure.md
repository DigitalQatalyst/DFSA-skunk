# Folder Structure

## Project Organization

```
project-root/
├── .ai/                    # AI assistant configuration
├── .claude/                # Claude Code specific
├── app/                    # Next.js app directory
│   ├── (auth)/            # Route group for auth pages
│   ├── (marketing)/       # Route group for marketing pages
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
│
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── features/         # Feature-specific components
│   ├── layouts/          # Layout components
│   └── shared/           # Shared components
│
├── lib/                  # Utility libraries
│   ├── utils.ts          # General utilities
│   ├── api.ts            # API client
│   ├── auth.ts           # Auth configuration
│   └── db.ts             # Database client
│
├── hooks/                # Custom React hooks
│   ├── useAuth.ts
│   ├── useDebounce.ts
│   └── useMediaQuery.ts
│
├── types/                # TypeScript types
│   ├── index.ts          # Exported types
│   ├── api.ts            # API types
│   └── models.ts         # Data models
│
├── config/               # Configuration files
│   ├── site.ts           # Site metadata
│   └── constants.ts      # App constants
│
├── styles/               # Global styles
│   └── globals.css       # Global CSS
│
├── public/               # Static assets
│   ├── images/
│   ├── fonts/
│   └── icons/
│
├── tests/                # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
└── scripts/              # Build/utility scripts
```

## File Naming Conventions

### Components
- PascalCase: `UserProfile.tsx`
- Index exports: `index.ts` (re-exports from folder)

### Utilities and Hooks
- camelCase: `useAuth.ts`, `formatDate.ts`
- Descriptive names indicating purpose

### Configuration
- kebab-case: `next.config.js`, `tailwind.config.ts`
- Follow framework conventions

### Tests
- Co-located with source: `Component.test.tsx`
- Or in `/tests` directory: `tests/unit/utils.test.ts`

## Import Paths

Use absolute imports with path aliases:

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["components/*"],
      "@/lib/*": ["lib/*"],
      "@/hooks/*": ["hooks/*"],
      "@/types/*": ["types/*"]
    }
  }
}
```

Usage:
```typescript
// ✅ Good
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

// ❌ Avoid
import { Button } from '../../../components/ui/button';
```

## Feature-Based Organization

For large features, consider feature-based organization:

```
app/
└── dashboard/
    ├── components/
    ├── hooks/
    ├── lib/
    ├── types/
    ├── layout.tsx
    └── page.tsx
```

## Best Practices

1. **Colocation**: Keep related files close
2. **Flat Structure**: Avoid deep nesting
3. **Clear Separation**: Distinguish UI, logic, and data
4. **Consistent Naming**: Follow conventions throughout
5. **Index Files**: Use for clean exports
6. **Type Safety**: Export types from dedicated files

## Module Boundaries

- Components should not import from features
- Features can import from shared components
- Utils and hooks should be pure (no side effects)
- Keep API logic in dedicated files
