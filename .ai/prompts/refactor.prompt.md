# Refactor Code Prompt Template

Use this template when asking AI to refactor code.

## Prompt

```
Please refactor the following code to [specific goal]:

[PASTE CODE HERE]

Requirements:
- Improve readability and maintainability
- Follow the coding standards in .ai/rules/
- Maintain existing functionality (no breaking changes)
- Add TypeScript types where missing
- [Add any specific requirements]

Please:
1. Explain the issues with the current code
2. Show the refactored version
3. Highlight the key improvements
4. Ensure all tests still pass
```

## Example Usage

```
Please refactor the following code to extract reusable logic:

function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/user')
      .then(r => r.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  return <div>{user?.name}</div>;
}

Requirements:
- Extract data fetching logic to a custom hook
- Add proper error handling
- Add TypeScript types
- Follow React best practices from .ai/rules/
```

## Common Refactoring Patterns

### Extract Function
Split complex functions into smaller, focused ones

### Extract Component
Break down large components into smaller, reusable ones

### Extract Hook
Move reusable logic into custom hooks

### Extract Utility
Move pure functions to utility files

### Remove Duplication
Consolidate repeated code

### Improve Types
Add or strengthen TypeScript types

### Simplify Logic
Reduce complexity and nesting
