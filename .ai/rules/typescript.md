# TypeScript Guidelines

## Type Safety

1. **Enable strict mode**: Always use `strict: true` in tsconfig.json
2. **Avoid `any`**: Use `unknown` or proper types instead
3. **Explicit return types**: Define return types for public functions
4. **No implicit any**: Enable `noImplicitAny`

## Type Definitions

### Interfaces vs Types
- Use `interface` for object shapes that may be extended
- Use `type` for unions, intersections, and utilities
- Be consistent within the same file/module

### Naming
- PascalCase for interfaces and types
- Prefix interfaces with `I` only if it adds clarity
- Use descriptive names that indicate purpose

## Best Practices

1. **Use generics** for reusable components and functions
2. **Leverage type inference** where types are obvious
3. **Create utility types** for common patterns
4. **Use const assertions** for literal types
5. **Prefer union types** over enums when appropriate

## Common Patterns

```typescript
// Discriminated unions
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// Utility types
type Optional<T> = T | undefined;
type Nullable<T> = T | null;

// Generic constraints
function process<T extends { id: string }>(item: T): void {
  // ...
}
```

## Type Guards

- Use type predicates for custom type guards
- Leverage `is` keyword for type narrowing
- Keep guards simple and focused

## Configuration

```json
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true,
  "strictFunctionTypes": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true
}
```
