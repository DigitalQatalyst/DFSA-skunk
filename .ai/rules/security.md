# Security Guidelines

## OWASP Top 10 Prevention

### 1. Injection Prevention
- Use parameterized queries
- Validate and sanitize all input
- Use ORMs with proper escaping
- Never concatenate user input into queries

### 2. Authentication & Authorization
- Implement proper session management
- Use secure password hashing (bcrypt, argon2)
- Enforce strong password policies
- Implement multi-factor authentication
- Check authorization at every endpoint

### 3. Sensitive Data Exposure
- Encrypt data in transit (HTTPS)
- Encrypt sensitive data at rest
- Never log sensitive information
- Use environment variables for secrets
- Implement proper key management

### 4. XSS Prevention
- Sanitize user input before rendering
- Use Content Security Policy headers
- Escape output based on context
- Use framework protections (React auto-escaping)

### 5. Security Misconfiguration
- Keep dependencies up-to-date
- Remove unnecessary features/pages
- Use security headers
- Disable directory listing
- Implement proper error handling (no stack traces in production)

## API Security

```typescript
// Rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true
}));

// Input validation
const schema = z.object({
  email: z.string().email(),
  age: z.number().min(0).max(120)
});
```

## Environment Variables

```bash
# Never commit these
.env
.env.local
.env.*.local

# Use validation
const env = z.object({
  DATABASE_URL: z.string().url(),
  API_KEY: z.string().min(1)
}).parse(process.env);
```

## Secure Coding Practices

1. **Input Validation**: Validate all input at boundaries
2. **Output Encoding**: Encode output based on context
3. **Error Handling**: Don't expose system details
4. **Logging**: Log security events, not sensitive data
5. **Dependencies**: Regularly audit and update

## Authentication Patterns

```typescript
// Secure session configuration
{
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,      // HTTPS only
    httpOnly: true,    // No JavaScript access
    sameSite: 'strict',
    maxAge: 3600000    // 1 hour
  }
}
```

## File Upload Security

1. Validate file types (check magic numbers, not extensions)
2. Limit file sizes
3. Scan for malware
4. Store outside web root
5. Generate unique filenames

## Security Headers

```typescript
// helmet.js configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true
  }
}));
```

## Checklist

- [ ] All user input is validated and sanitized
- [ ] Authentication and authorization are properly implemented
- [ ] Secrets are in environment variables, not code
- [ ] HTTPS is enforced in production
- [ ] Security headers are configured
- [ ] Dependencies are up-to-date
- [ ] Error messages don't leak system information
- [ ] Logging doesn't include sensitive data
