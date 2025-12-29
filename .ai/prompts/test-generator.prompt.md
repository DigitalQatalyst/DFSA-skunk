# Test Generator Prompt Template

Use this template when asking AI to generate tests.

## Prompt

```
Please generate tests for the following code:

[PASTE CODE OR FILE PATH]

Test requirements:
- Follow .ai/rules/testing.md guidelines
- Cover edge cases and error scenarios
- Use [testing framework] (Jest/Vitest/etc.)
- Include both happy path and error cases
- Mock external dependencies appropriately

Please provide:
1. Unit tests for core functionality
2. Integration tests if applicable
3. Edge case coverage
4. Clear test descriptions
```

## Example Usage - React Component

```
Please generate tests for this component:

File: components/UserProfile.tsx

Requirements:
- Test rendering with different props
- Test user interactions (clicks, inputs)
- Test loading and error states
- Test accessibility
- Use React Testing Library
- Follow AAA pattern (Arrange, Act, Assert)
```

## Example Usage - API Route

```
Please generate tests for this API route:

File: app/api/users/route.ts

Requirements:
- Test successful requests
- Test validation errors
- Test authentication/authorization
- Test rate limiting
- Mock database calls
- Test error handling
```

## Example Usage - Utility Function

```
Please generate tests for this utility:

File: lib/formatDate.ts

Requirements:
- Test various date formats
- Test edge cases (null, invalid dates)
- Test timezone handling
- Test locale support
- Cover 100% of code paths
```

## Test Template Structure

```typescript
import { render, screen, userEvent } from '@testing-library/react';
import { Component } from './Component';

describe('Component', () => {
  describe('rendering', () => {
    it('should render with required props', () => {
      // Arrange
      const props = { /* ... */ };

      // Act
      render(<Component {...props} />);

      // Assert
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('user interactions', () => {
    it('should handle click events', async () => {
      // Arrange
      const handleClick = jest.fn();
      render(<Component onClick={handleClick} />);

      // Act
      await userEvent.click(screen.getByRole('button'));

      // Assert
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('error handling', () => {
    it('should display error message on failure', () => {
      // Test error scenarios
    });
  });
});
```

## Coverage Goals

- **Critical paths**: 100%
- **Business logic**: 90%+
- **UI components**: 80%+
- **Utilities**: 100%

## What to Test

### ✅ Do Test
- Public API/interface
- User interactions
- Edge cases and errors
- Integration points
- Business logic

### ❌ Don't Test
- Implementation details
- Third-party libraries
- Trivial getters/setters
- Framework internals
