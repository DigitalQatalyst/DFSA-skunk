# React Patterns and Best Practices

## Component Structure

### Functional Components (Preferred)
Use functional components with hooks for all new code:

```tsx
import { useState, useEffect } from 'react';

interface UserProfileProps {
  userId: string;
  onUpdate?: (user: User) => void;
}

export const UserProfile = ({ userId, onUpdate }: UserProfileProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser(userId).then(setUser).finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <LoadingSpinner />;
  if (!user) return <ErrorState />;

  return (
    <div className="user-profile">
      {/* Component content */}
    </div>
  );
};
```

## Hook Patterns

### Custom Hooks
Extract reusable logic into custom hooks:

```tsx
// hooks/useAuth.ts
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Auth logic
  }, []);

  const login = async (credentials: Credentials) => {
    // Login logic
  };

  const logout = async () => {
    // Logout logic
  };

  return { user, loading, login, logout };
};
```

### Hook Rules
- Always prefix custom hooks with `use`
- Follow Rules of Hooks (only call at top level)
- Document dependencies clearly
- Keep hooks focused and single-purpose

## State Management

### Local State (useState)
Use for component-specific state:
```tsx
const [isOpen, setIsOpen] = useState(false);
const [formData, setFormData] = useState<FormData>(initialData);
```

### Context (useContext)
Use for app-wide state that doesn't change frequently:
```tsx
// context/ThemeContext.tsx
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [theme, setTheme] = useState<Theme>('light');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
```

### External State Libraries
For complex state management, prefer Zustand or Redux Toolkit:
```tsx
// store/authStore.ts (Zustand example)
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: async (credentials) => {
    const user = await api.login(credentials);
    set({ user });
  },
  logout: () => set({ user: null }),
}));
```

## Component Composition

### Compound Components
Use for complex, related components:
```tsx
export const Accordion = ({ children }: PropsWithChildren) => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  
  return (
    <AccordionContext.Provider value={{ openItems, setOpenItems }}>
      <div className="accordion">{children}</div>
    </AccordionContext.Provider>
  );
};

Accordion.Item = AccordionItem;
Accordion.Trigger = AccordionTrigger;
Accordion.Content = AccordionContent;
```

### Render Props
Use sparingly, prefer hooks:
```tsx
// Only use when hooks aren't sufficient
<DataProvider>
  {({ data, loading }) => (
    loading ? <Spinner /> : <DataView data={data} />
  )}
</DataProvider>
```

## Performance Optimization

### Memoization
Use React.memo for expensive components:
```tsx
export const ExpensiveComponent = React.memo(({ data }: Props) => {
  // Expensive rendering logic
  return <div>{/* ... */}</div>;
});
```

### Callbacks
Memoize callbacks passed to child components:
```tsx
const handleSubmit = useCallback((data: FormData) => {
  // Handle submission
}, [/* dependencies */]);
```

### Values
Memoize computed values:
```tsx
const sortedData = useMemo(() => {
  return data.sort((a, b) => a.name.localeCompare(b.name));
}, [data]);
```

### Code Splitting
Lazy load routes and heavy components:
```tsx
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Dashboard />
    </Suspense>
  );
}
```

## Error Handling

### Error Boundaries
Wrap components that might error:
```tsx
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <ErrorFallback />;
    }

    return this.props.children;
  }
}
```

## Forms

### Controlled Components
Prefer controlled components for forms:
```tsx
const [email, setEmail] = useState('');

<input
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

### Form Libraries
Consider using React Hook Form for complex forms:
```tsx
import { useForm } from 'react-hook-form';

const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

const onSubmit = handleSubmit((data) => {
  // Handle form submission
});
```

## Accessibility

### Semantic HTML
Always use semantic HTML elements:
```tsx
// ✅ Good
<button onClick={handleClick}>Submit</button>

// ❌ Bad
<div onClick={handleClick}>Submit</div>
```

### ARIA Attributes
Add ARIA attributes when needed:
```tsx
<button
  aria-label="Close dialog"
  aria-expanded={isOpen}
  onClick={handleClose}
>
  <CloseIcon />
</button>
```

## Testing

### Component Tests
Test behavior, not implementation:
```tsx
import { render, screen, fireEvent } from '@testing-library/react';

test('increments counter on button click', () => {
  render(<Counter />);
  
  const button = screen.getByRole('button', { name: /increment/i });
  fireEvent.click(button);
  
  expect(screen.getByText('1')).toBeInTheDocument();
});
```

### Custom Hook Tests
Use @testing-library/react-hooks:
```tsx
import { renderHook, act } from '@testing-library/react';

test('useCounter increments count', () => {
  const { result } = renderHook(() => useCounter());
  
  act(() => {
    result.current.increment();
  });
  
  expect(result.current.count).toBe(1);
});
```

## Common Patterns to Avoid

### ❌ Don't mutate state directly
```tsx
// Bad
state.push(item);
setState(state);

// Good
setState([...state, item]);
```

### ❌ Don't use index as key in lists
```tsx
// Bad
{items.map((item, index) => <Item key={index} {...item} />)}

// Good
{items.map((item) => <Item key={item.id} {...item} />)}
```

### ❌ Don't forget cleanup in useEffect
```tsx
// Bad
useEffect(() => {
  const subscription = subscribe();
}, []);

// Good
useEffect(() => {
  const subscription = subscribe();
  return () => subscription.unsubscribe();
}, []);
```

### ❌ Don't over-optimize prematurely
Start with simple code, optimize only when needed based on profiling.