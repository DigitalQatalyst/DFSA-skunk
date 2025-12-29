# Codex Configuration

This project uses a universal AI configuration system located in `.ai/`.

## Configuration Source

**Primary Reference: `.ai/agents.md`**

All project guidelines, coding standards, and AI assistant behaviors are defined in the `.ai/` directory. This configuration is shared across all AI tools (Claude Code, Cursor, GitHub Copilot, etc.).

## Quick Links

### Core Configuration
- [Root Specification](../.ai/agents.md) - Start here for project overview
- [Usage Guide](../.ai/guide.md) - How to use the AI config system

### Coding Rules
- [Coding Style](../.ai/rules/coding-style.md) - Naming, formatting, best practices
- [Architecture](../.ai/rules/architecture.md) - System design principles
- [TypeScript](../.ai/rules/typescript.md) - Type safety and conventions
- [Next.js Patterns](../.ai/rules/nextjs-patterns.md) - Next.js best practices
- [Tailwind CSS](../.ai/rules/tailwind.md) - Utility-first CSS guidelines
- [Testing](../.ai/rules/testing.md) - Test structure and coverage
- [Security](../.ai/rules/security.md) - Security requirements and OWASP

### Project Standards
- [Component Library](../.ai/project/component-library.md) - Component patterns
- [API Patterns](../.ai/project/api-patterns.md) - API design and responses
- [State Management](../.ai/project/state-management.md) - State strategy
- [Folder Structure](../.ai/project/folder-structure.md) - Project organization

### Reusable Prompts
- [Refactor Code](../.ai/prompts/refactor.prompt.md) - Refactoring templates
- [Code Review](../.ai/prompts/review.prompt.md) - Review checklists
- [Test Generator](../.ai/prompts/test-generator.prompt.md) - Testing templates
- [Documentation](../.ai/prompts/doc-writer.prompt.md) - Doc templates

## Working with This Codebase

When generating or suggesting code:

1. **Read** `.ai/agents.md` for project principles and overview
2. **Follow** framework-specific rules in `.ai/rules/`
3. **Apply** project conventions from `.ai/project/`
4. **Use** prompt templates from `.ai/prompts/` for common tasks

## Key Principles

- Maintain consistency with existing code patterns
- Follow strict TypeScript typing
- Implement comprehensive error handling
- Prioritize security (see `.ai/rules/security.md`)
- Write testable, maintainable code
- Keep components simple and focused

## Benefits of This System

✅ Single source of truth for all AI tools
✅ Consistent coding standards across assistants
✅ Easy to maintain and update centrally
✅ Portable between projects
✅ Tool-agnostic configuration

## Note

This configuration file (`.codex/config.md`) is a pointer to the main configuration. All actual rules and guidelines live in `.ai/` to ensure consistency across different AI coding assistants.
