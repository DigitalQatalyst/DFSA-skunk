# API Patterns

## API Structure

```
app/api/
├── auth/
│   ├── login/route.ts
│   └── logout/route.ts
├── users/
│   ├── route.ts
│   └── [id]/route.ts
└── middleware.ts
```

## Route Handlers

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate
    const body = await request.json();
    const data = schema.parse(body);

    // Business logic
    const result = await processData(data);

    // Success response
    return NextResponse.json(
      { success: true, data: result },
      { status: 200 }
    );
  } catch (error) {
    // Error handling
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## Response Format

### Success Response
```typescript
{
  success: true,
  data: T,
  metadata?: {
    total: number,
    page: number,
    perPage: number
  }
}
```

### Error Response
```typescript
{
  success: false,
  error: string,
  details?: unknown
}
```

## Error Handling

```typescript
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
  }
}

export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { success: false, error: error.message, details: error.details },
      { status: error.statusCode }
    );
  }

  // Log unexpected errors
  console.error('Unexpected error:', error);

  return NextResponse.json(
    { success: false, error: 'Internal server error' },
    { status: 500 }
  );
}
```

## Authentication

```typescript
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Authorized logic
}
```

## Rate Limiting

```typescript
import { rateLimit } from '@/lib/rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

export async function POST(request: NextRequest) {
  try {
    await limiter.check(request, 10); // 10 requests per minute
    // Handle request
  } catch {
    return NextResponse.json(
      { success: false, error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }
}
```

## Pagination

```typescript
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const perPage = parseInt(searchParams.get('perPage') || '10');

  const { items, total } = await fetchPaginatedData({
    skip: (page - 1) * perPage,
    take: perPage
  });

  return NextResponse.json({
    success: true,
    data: items,
    metadata: {
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage)
    }
  });
}
```

## Best Practices

1. Always validate input with schema validation
2. Use consistent response formats
3. Implement proper error handling
4. Add authentication/authorization checks
5. Include rate limiting for public endpoints
6. Log errors appropriately
7. Use TypeScript for type safety
8. Document API endpoints
