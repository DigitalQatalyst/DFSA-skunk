# GitHub Copilot Instructions

This project uses a centralized, tool-agnostic AI configuration system.

## Primary Configuration

**All coding guidelines and project rules are defined in `.ai/agents.md`**

Please read and strictly follow the specifications in:

1. **[.ai/agents.md](../.ai/agents.md)** - Main configuration file
2. **[.ai/guide.md](../.ai/guide.md)** - Guide to the AI config system

## Framework & Language Rules

Adhere to these framework-specific guidelines:

- **[TypeScript](../.ai/rules/typescript.md)** - Type safety, interfaces, best practices
- **[Next.js](../.ai/rules/nextjs-patterns.md)** - App Router, Server Components, routing
- **[Tailwind CSS](../.ai/rules/tailwind.md)** - Utility classes, responsive design
- **[Testing](../.ai/rules/testing.md)** - Test structure, coverage, best practices
- **[Security](../.ai/rules/security.md)** - OWASP guidelines, secure coding
- **[Coding Style](../.ai/rules/coding-style.md)** - Naming, formatting, comments
- **[Architecture](../.ai/rules/architecture.md)** - System design, patterns

## Project Conventions

Follow these project-specific patterns:

- **[Component Library](../.ai/project/component-library.md)** - Component structure and patterns
- **[API Patterns](../.ai/project/api-patterns.md)** - API design and error handling
- **[State Management](../.ai/project/state-management.md)** - State strategy and tools
- **[Folder Structure](../.ai/project/folder-structure.md)** - Project organization

## Suggestion Guidelines

When suggesting code:

1. ✅ Follow all rules defined in `.ai/rules/`
2. ✅ Match existing code patterns from `.ai/project/`
3. ✅ Use TypeScript with strict types
4. ✅ Implement proper error handling
5. ✅ Consider security implications
6. ✅ Write testable, maintainable code
7. ❌ Don't suggest code that violates security guidelines
8. ❌ Don't bypass established patterns without good reason
9. ❌ Don't use `any` types unless absolutely necessary
10. ❌ Don't ignore error handling

## Code Quality Standards

- **Type Safety**: Strict TypeScript with no implicit `any`
- **Testing**: Write tests for business logic and components
- **Security**: Follow OWASP Top 10 prevention measures
- **Performance**: Consider bundle size and rendering performance
- **Accessibility**: Ensure components are accessible

## Helpful Resources

Use these templates for common tasks:

- **[Refactoring](../.ai/prompts/refactor.prompt.md)** - Code refactoring patterns
- **[Code Review](../.ai/prompts/review.prompt.md)** - Review checklist
- **[Test Generation](../.ai/prompts/test-generator.prompt.md)** - Test writing guide
- **[Documentation](../.ai/prompts/doc-writer.prompt.md)** - Documentation templates

## Important Notes

- This configuration is shared across all AI coding assistants
- Maintaining consistency with these guidelines is critical
- When in doubt, refer to `.ai/agents.md`
- Suggest improvements to the guidelines when appropriate
