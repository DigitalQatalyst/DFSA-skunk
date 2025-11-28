# Code Review Prompt Template

Use this template when asking AI to review code.

## Prompt

```
Please review the following code changes:

[PASTE CODE OR FILE PATH]

Review checklist:
- Code quality and readability
- Adherence to .ai/rules/ standards
- Potential bugs or edge cases
- Performance implications
- Security concerns (see .ai/rules/security.md)
- Test coverage
- Documentation needs

Please provide:
1. Summary of changes
2. Issues found (if any)
3. Suggestions for improvement
4. Security concerns
5. Overall assessment
```

## Example Usage

```
Please review the following authentication implementation:

File: app/api/auth/login/route.ts

Review for:
- Security vulnerabilities (XSS, injection, etc.)
- Error handling
- Input validation
- Session management
- Adherence to .ai/rules/security.md

Focus on security and best practices.
```

## Review Categories

### 🔴 Critical
- Security vulnerabilities
- Data loss risks
- Breaking changes
- Memory leaks

### 🟡 Important
- Performance issues
- Missing error handling
- Unclear code
- Missing tests

### 🟢 Nice to Have
- Code style improvements
- Better naming
- Additional documentation
- Refactoring opportunities

## Security Review Checklist

- [ ] Input validation
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] Authentication/authorization
- [ ] Secrets management
- [ ] Error handling (no info leakage)
- [ ] Rate limiting
- [ ] HTTPS/secure cookies

## Performance Review Checklist

- [ ] Database query optimization
- [ ] N+1 query problems
- [ ] Unnecessary re-renders
- [ ] Memory leaks
- [ ] Bundle size impact
- [ ] Lazy loading opportunities

## Code Quality Checklist

- [ ] Follows coding standards
- [ ] Proper TypeScript types
- [ ] Clear naming
- [ ] Appropriate comments
- [ ] DRY principle
- [ ] Single responsibility
- [ ] Error handling
