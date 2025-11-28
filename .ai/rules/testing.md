# Testing Guidelines

## Testing Philosophy

1. **Write tests that give confidence**, not just coverage
2. **Test behavior, not implementation**
3. **Keep tests simple and readable**
4. **Fast tests > Slow tests**

## Test Structure

### AAA Pattern
```typescript
test('should handle user login', () => {
  // Arrange
  const user = { email: 'test@example.com', password: 'pass' };

  // Act
  const result = login(user);

  // Assert
  expect(result.success).toBe(true);
});
```

## Types of Tests

### Unit Tests
- Test individual functions/components
- Mock external dependencies
- Fast and isolated
- High coverage for business logic

### Integration Tests
- Test component interactions
- Minimal mocking
- Focus on user workflows
- Test API integrations

### E2E Tests
- Test critical user paths
- Real browser environment
- Slower but high confidence
- Use sparingly for key features

## What to Test

### ✅ Do Test
- Business logic and edge cases
- User interactions and flows
- Error handling
- API integrations
- Accessibility

### ❌ Don't Test
- Third-party library internals
- Framework functionality
- Trivial getters/setters
- Implementation details

## Best Practices

1. **Descriptive test names**: "should X when Y"
2. **One assertion per concept**
3. **Use test data builders** for complex objects
4. **Avoid test interdependence**
5. **Clean up after tests**

## Mocking

```typescript
// Mock only what you need
jest.mock('@/lib/api', () => ({
  fetchUser: jest.fn().mockResolvedValue({ id: 1 })
}));

// Prefer dependency injection for easier testing
```

## React Testing

```typescript
import { render, screen, userEvent } from '@testing-library/react';

test('button handles click', async () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);

  await userEvent.click(screen.getByRole('button'));

  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

## Coverage

- Aim for meaningful coverage, not 100%
- Focus on critical paths
- Use coverage to find gaps, not as a goal
