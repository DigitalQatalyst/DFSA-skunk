# State Management

## State Strategy

Choose the right tool for the job:

1. **Local State** (`useState`): Component-specific state
2. **URL State**: Shareable, bookmarkable state (search params, routes)
3. **Context**: Avoid prop drilling for app-wide state
4. **External Store**: Complex state, persistence, or advanced features

## Local State

```typescript
'use client';

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

## URL State (Search Params)

```typescript
'use client';

import { useSearchParams, useRouter } from 'next/navigation';

export function SearchFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';

  const updateQuery = (newQuery: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('q', newQuery);
    router.push(`?${params.toString()}`);
  };

  return (
    <input
      value={query}
      onChange={(e) => updateQuery(e.target.value)}
    />
  );
}
```

## Context API

```typescript
'use client';

import { createContext, useContext, useState } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

## Zustand (Lightweight State)

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) => set((state) => ({
        items: [...state.items, item]
      })),
      removeItem: (id) => set((state) => ({
        items: state.items.filter(i => i.id !== id)
      })),
      clearCart: () => set({ items: [] })
    }),
    {
      name: 'cart-storage'
    }
  )
);
```

## Server State (React Query / SWR)

```typescript
'use client';

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function UserProfile({ userId }: { userId: string }) {
  const { data, error, isLoading } = useSWR(
    `/api/users/${userId}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000
    }
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading user</div>;

  return <div>{data.name}</div>;
}
```

## Form State

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}

      <input type="password" {...register('password')} />
      {errors.password && <span>{errors.password.message}</span>}

      <button type="submit" disabled={isSubmitting}>
        Login
      </button>
    </form>
  );
}
```

## State Management Guidelines

### When to Use Each Approach

- **useState**: Component-only state, simple toggles
- **URL State**: Filters, pagination, tabs (shareable state)
- **Context**: Theme, auth, i18n (app-wide, changes infrequently)
- **Zustand/Jotai**: Client state, cart, UI preferences
- **React Query/SWR**: Server state, API data, caching

### Best Practices

1. Keep state as local as possible
2. Lift state only when necessary
3. Use URL for shareable state
4. Separate server state from client state
5. Avoid prop drilling with context
6. Consider performance implications
7. Use TypeScript for type safety
8. Implement proper error handling
