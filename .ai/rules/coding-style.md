# Coding Style Guidelines

## General Principles

1. **Readability**: Code should be self-documenting
2. **Consistency**: Follow established patterns
3. **Simplicity**: Prefer simple solutions over clever ones
4. **DRY**: Don't Repeat Yourself (within reason)

## Naming Conventions

### Variables
- Use descriptive, meaningful names
- camelCase for variables and functions
- PascalCase for classes and components
- UPPER_SNAKE_CASE for constants

### Files
- kebab-case for file names
- Match component name for React components

## Code Organization

1. Group related functionality
2. Keep functions small and focused
3. Extract complex logic into named functions
4. Use early returns to reduce nesting

## Comments

- Use comments to explain "why", not "what"
- Document complex algorithms
- Keep comments up-to-date with code changes
- Prefer self-documenting code over comments

## Formatting

- Use consistent indentation (2 or 4 spaces)
- Maximum line length: 100-120 characters
- Use trailing commas in multi-line structures
- One statement per line

## Best Practices

1. Avoid magic numbers - use named constants
2. Handle errors explicitly
3. Validate input at boundaries
4. Prefer immutability where possible
5. Use modern language features appropriately
