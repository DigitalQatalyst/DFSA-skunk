# AI Development Guidelines

This repository uses a unified AI configuration system. All AI coding tools should reference these guidelines.

## Project Context
- **Domain**: Financial Regulatory Services (DFSA)
- **Stack**: React 18, Vite, TypeScript, Tailwind CSS
- **Package Manager**: pnpm
- **Node Version**: 20.x

## Domain Knowledge (CRITICAL)
When working on DFSA-related features, you MUST load and follow:
- [DFSA Agent Operating Rules](./domain/dfsa/06_dfsa_agent_operating_rules.md)
- [DFSA Sample Prompts](./domain/dfsa/07_dfsa_sample_prompts_for_agents.md)
- [DFSA Persona and Tone](./domain/dfsa/02_dfsa_persona_and_tone.md)

**Key Principle**: All AI-generated content for DFSA must be:
- Formal and neutral (never promotional)
- Rule-referenced (cite DFSA regulations)
- Non-advisory (don't predict outcomes)
- Audit-compliant (log all interactions)

## Core Rules
Load the following rules in this order:
1. [Coding Style](./rules/coding-style.md)
2. [TypeScript Standards](./rules/typescript.md)
3. [React Patterns](./rules/react-patterns.md)
4. [Vite Configuration](./rules/vite.md)
5. [Tailwind CSS Guidelines](./rules/tailwind.md)
6. [Architecture Principles](./rules/architecture.md)
7. [Testing Strategy](./rules/testing.md)

## Project-Specific Patterns
- [Component Library](./project/component-library.md)
- [API Patterns](./project/api-patterns.md)
- [State Management](./project/state-management.md)

## Common Commands
```bash
# Development
pnpm dev

# Build
pnpm build

# Preview production build
pnpm preview

# Testing
pnpm test
pnpm test:coverage

# Linting
pnpm lint
pnpm lint:fix

# Type checking
pnpm type-check
```

## File Naming Conventions
- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Hooks: `use*.ts` (e.g., `useAuth.ts`)
- Pages/Views: `PascalCase.tsx`
- Tests: `*.test.ts` or `*.spec.ts`
- Styles: `*.module.css` (if using CSS modules)

## Import Aliases
Use TypeScript path aliases for cleaner imports:
- `@/components` - React components
- `@/hooks` - Custom React hooks
- `@/lib` - Library code and utilities
- `@/utils` - Utility functions
- `@/types` - TypeScript type definitions
- `@/assets` - Static assets (images, fonts, etc.)
- `@/api` - API client and endpoints
- `@/store` - State management
- `@/config` - Configuration files

## Directory Structure
```
src/
├── components/     # Reusable React components
├── pages/          # Page-level components
├── hooks/          # Custom React hooks
├── lib/            # Library code
├── utils/          # Helper functions
├── types/          # TypeScript types
├── assets/         # Static assets
├── api/            # API client
├── store/          # State management
└── config/         # App configuration
```

## Key Principles
1. **Component Design**: Favor composition over inheritance
2. **State Management**: Use React Context or dedicated state library (Zustand/Redux)
3. **Performance**: Lazy load routes and heavy components
4. **Accessibility**: Follow WCAG 2.1 AA standards
5. **DFSA Compliance**: All regulatory features must follow domain rules