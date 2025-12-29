# Claude Code Configuration

This project uses a unified AI configuration system.

**Primary Documentation**: `../.ai/agents.md`

Please load and follow all guidelines from the `.ai/` directory, especially:
- `.ai/agents.md` - Master configuration
- `.ai/rules/*` - All coding standards
- `.ai/project/*` - Project-specific patterns
- `.ai/domain/dfsa/*` - DFSA regulatory compliance rules

## Claude-Specific Settings

### Model Selection
- Use **Claude Opus 4** for:
  - Complex refactoring across multiple files
  - Architecture decisions
  - DFSA compliance reviews
  - Large-scale code migrations

- Use **Claude Sonnet 4.5** for:
  - Routine feature development
  - Bug fixes
  - Component creation
  - Documentation updates

### Context Management
- Enable extended context mode for operations involving:
  - Multiple file analysis
  - Large component refactoring
  - Cross-cutting concerns

### DFSA-Specific Instructions
When working on any DFSA-related features:

1. **ALWAYS load these files first**:
   ```
   @.ai/domain/dfsa/06_dfsa_agent_operating_rules.md
   @.ai/domain/dfsa/07_dfsa_sample_prompts_for_agents.md
   ```

2. **Language Requirements**:
   - Use formal, precise, neutral language
   - Never use: "easy", "simple", "recommended", "optimal"
   - No marketing or promotional tone
   - No predictive statements about approvals

3. **Code Requirements**:
   - Include audit logging for all regulatory interactions
   - Add DFSA rule references in comments
   - Structure responses: Rule → Clarification → Action

4. **Review Checklist**:
   - [ ] Language is formal and neutral
   - [ ] Forbidden words removed
   - [ ] Rule citations present
   - [ ] Audit logging implemented
   - [ ] No outcome predictions

### Permissions
When running commands, use:
```bash
# For safe operations (recommended)
claude <prompt>

# For operations requiring system access (use cautiously)
claude --dangerously-skip-permissions <prompt>
```

### Useful Claude Commands
```bash
# Reference specific files
claude @src/components/LicenseForm.tsx "Review for DFSA compliance"

# Install dependencies
/install-package <package-name>

# Set up terminal shortcuts
/terminal-setup

# Install GitHub app for PR reviews
/install-github-app
```

### Custom Commands
Store reusable commands in `.claude/commands/`:

**`.claude/commands/dfsa-feature.md`**
```markdown
When building DFSA features:
1. Load @.ai/domain/dfsa/06_dfsa_agent_operating_rules.md
2. Ensure formal, neutral language
3. Add audit logging
4. Include rule references
5. Test against compliance checklist
```

### File Organization
Use these patterns for Claude to understand your codebase:

```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   ├── forms/           # Form components
│   └── layouts/         # Layout components
├── pages/               # Route/page components
├── hooks/               # Custom React hooks
├── lib/                 # Library code
├── utils/               # Helper functions
├── types/               # TypeScript definitions
├── api/                 # API client
├── store/               # State management
└── config/              # Configuration
```

### React + Vite Specifics
- This is a **React 18 + Vite** project (not Next.js)
- Use `import.meta.env.VITE_*` for environment variables
- Lazy load routes with `React.lazy()`
- Use path aliases: `@/components`, `@/hooks`, etc.

### Testing Commands
```bash
# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run specific test
pnpm test -- UserProfile.test.tsx
```

### Build and Preview
```bash
# Development server
pnpm dev

# Production build
pnpm build

# Preview production build
pnpm preview
```

## Common Workflows

### Creating a New Component
```bash
claude "Create a new Button component in src/components/ui/Button.tsx with TypeScript, Tailwind CSS styling, and proper accessibility attributes"
```

### DFSA Feature Development
```bash
claude @.ai/domain/dfsa/ "Create a license application form that follows DFSA operating rules, includes audit logging, and uses formal language"
```

### Refactoring
```bash
claude @src/pages/Dashboard.tsx "Refactor this component to use custom hooks for data fetching and improve performance with React.memo"
```

### Code Review
```bash
claude @src/components/LicenseForm.tsx "Review this component for DFSA compliance, check for forbidden words, verify audit logging is present"
```

## Integration with Other Tools

### With VS Code
Install the Claude Code extension to:
- Start Claude Code quickly from VS Code
- Open multiple Claude windows for different parts of the project
- Maintain context across sessions

### With Git
Claude Code can:
- Review PRs automatically (use `/install-github-app`)
- Commit changes with descriptive messages
- Create branches and handle merge conflicts

### With CI/CD
Use GitHub Actions with Claude Code for:
- Automated code reviews
- DFSA compliance checks
- Test generation
- Documentation updates

## Troubleshooting

### If Claude doesn't follow DFSA rules
Make sure to explicitly reference the DFSA files:
```bash
claude @.ai/domain/dfsa/06_dfsa_agent_operating_rules.md "Review this code"
```

### If imports aren't resolving
Verify the path aliases in both:
- `vite.config.ts` (resolve.alias)
- `tsconfig.json` (compilerOptions.paths)

### If HMR isn't working
Check for:
- Circular dependencies
- State being mutated directly
- Missing return cleanup in useEffect

## Pro Tips

1. **Use shift-drag** to reference files (not open them)
2. **Press Escape** to stop Claude (not Ctrl+C)
3. **Press Escape twice** to see message history
4. **Use Ctrl+V** for pasting images (not Cmd+V)
5. **Set up /terminal-setup** for Shift+Enter support
6. **Create nested CLAUDE.md files** in subdirectories for specific context