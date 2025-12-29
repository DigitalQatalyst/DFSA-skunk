# Documentation Writer Prompt Template

Use this template when asking AI to write documentation.

## Prompt

```
Please write documentation for the following code:

[PASTE CODE OR FILE PATH]

Documentation requirements:
- Clear and concise explanations
- Include usage examples
- Document all parameters and return values
- Note any important gotchas or limitations
- Follow project documentation standards

Please provide:
1. High-level overview
2. Detailed API documentation
3. Usage examples
4. Common patterns/best practices
```

## Example Usage - Component Documentation

```
Please document this component:

File: components/ui/Button.tsx

Include:
- Component description
- Props documentation with types
- Usage examples (basic, with variants, disabled state)
- Accessibility notes
- Styling customization options
```

## Example Usage - API Documentation

```
Please document this API endpoint:

File: app/api/users/route.ts

Include:
- Endpoint description
- HTTP methods supported
- Request/response formats
- Authentication requirements
- Error responses
- Example requests with curl/fetch
```

## Example Usage - Hook Documentation

```
Please document this custom hook:

File: hooks/useAuth.ts

Include:
- Hook description
- Parameters and return values
- Usage example in a component
- Important notes (re-render behavior, etc.)
- Common patterns
```

## Documentation Template - Component

```markdown
# ComponentName

Brief description of what the component does.

## Usage

\`\`\`tsx
import { ComponentName } from '@/components/ComponentName';

function Example() {
  return (
    <ComponentName
      prop1="value"
      prop2={handler}
    />
  );
}
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| prop1 | string | - | Description of prop1 |
| prop2 | () => void | - | Description of prop2 |
| prop3 | boolean | false | Description of prop3 |

## Examples

### Basic Usage
\`\`\`tsx
<ComponentName prop1="value" />
\`\`\`

### With Custom Styling
\`\`\`tsx
<ComponentName
  prop1="value"
  className="custom-class"
/>
\`\`\`

## Accessibility

- Uses semantic HTML
- Keyboard navigable
- Screen reader friendly

## Notes

- Important gotchas or limitations
- Performance considerations
```

## Documentation Template - API

```markdown
# API Endpoint

## POST /api/endpoint

Description of what this endpoint does.

### Request

\`\`\`typescript
{
  field1: string;
  field2: number;
}
\`\`\`

### Response

Success (200):
\`\`\`typescript
{
  success: true;
  data: {
    id: string;
    field: string;
  }
}
\`\`\`

Error (400):
\`\`\`typescript
{
  success: false;
  error: string;
  details?: unknown;
}
\`\`\`

### Example

\`\`\`bash
curl -X POST https://api.example.com/api/endpoint \\
  -H "Content-Type: application/json" \\
  -d '{"field1":"value","field2":123}'
\`\`\`

### Authentication

Requires valid session or API key.

### Rate Limiting

100 requests per minute per user.
```

## Documentation Best Practices

1. Start with a clear overview
2. Provide practical examples
3. Document all parameters and return values
4. Note edge cases and limitations
5. Keep it up-to-date with code changes
6. Use consistent formatting
7. Include TypeScript types
8. Add links to related documentation
