# AI Configuration Guide

## Overview

This directory (`.ai/`) contains tool-agnostic AI configuration that works across multiple AI coding assistants.

## Structure

```
.ai/
├── agents.md                 # Root specification (start here)
├── guide.md                  # This file
├── rules/                    # Framework & language rules
├── project/                  # Project-specific conventions
└── prompts/                  # Reusable prompt templates
```

## How It Works

1. **`.ai/`** - Universal configuration that all tools reference
2. **Tool-specific folders** - Each AI tool has its own folder (`.claude/`, `.cursor/`, etc.) that points to `.ai/agents.md`

## For AI Assistants

When working in this codebase:

1. Read [agents.md](./agents.md) for the root specification
2. Check relevant files in [rules/](./rules/) for framework-specific guidelines
3. Review [project/](./project/) for project conventions
4. Use templates in [prompts/](./prompts/) for common tasks

## For Developers

### Adding New Rules

1. Create a new `.md` file in the appropriate directory:
   - `rules/` - For framework/language conventions
   - `project/` - For project-specific patterns
   - `prompts/` - For reusable prompt templates

2. Reference it in `agents.md` if it's a core rule

### Tool-Specific Configuration

Each tool folder contains a pointer to `.ai/agents.md`:

- **Claude Code**: `.claude/claude.md`
- **Cursor**: `.cursor/rules`
- **GitHub Copilot**: `.github/copilot-instructions.md`
- **Codex**: `.codex/config.md`

## Benefits

- ✅ Single source of truth for all AI tools
- ✅ Consistent coding standards across assistants
- ✅ Easy to maintain and update
- ✅ Portable between projects
