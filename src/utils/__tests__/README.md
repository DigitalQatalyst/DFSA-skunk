# Validation Standards Test Suite

This test suite validates all Platform Data Validation Standards according to the requirements:
- Min/max behavior
- Invalid characters
- HTML injection attempts
- Incorrect data types
- API payload tampering

## Setup

### 1. Install Dependencies

```bash
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom jsdom
```

### 2. Add Test Scripts to package.json

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run"
  }
}
```

### 3. Run Tests

```bash
# Run tests in watch mode
npm test

# Run tests with UI
npm run test:ui

# Run tests once (CI mode)
npm run test:run
```

## Test Coverage

The test suite covers:

- ✅ HTML Injection Prevention
- ✅ First Name Validation (min/max, invalid chars, data types)
- ✅ Last Name Validation
- ✅ Full Name Validation
- ✅ Email Validation (format, length, normalization)
- ✅ Phone Number Validation (digit count, formatting)
- ✅ Date Validation with Constraints (notFuture, notPast, minAge, maxAge)
- ✅ Date Range Validation
- ✅ Text Field Validation (single-line, multi-line small/large)
- ✅ Address Validation
- ✅ City/District Validation
- ✅ State/Province Validation
- ✅ ZIP/Postal Code Validation
- ✅ Passport Number Validation
- ✅ Website URL Validation
- ✅ API Payload Tampering Prevention
- ✅ Edge Cases

## Running Specific Tests

```bash
# Run tests matching a pattern
npm test -- firstName

# Run tests in a specific file
npm test -- formValidationStandards.test.ts
```

## Continuous Integration

Add to your CI pipeline:

```yaml
# Example GitHub Actions
- name: Run tests
  run: npm run test:run
```

