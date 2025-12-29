# Font Files Setup

This project uses custom commercial fonts that need to be added manually.

## Required Fonts

### 1. Trajan Pro (Primary Font)
Place font files in: `public/fonts/trajan-pro/`

Required files:
- `TrajanPro-Regular.woff2`
- `TrajanPro-Regular.woff`
- `TrajanPro-Bold.woff2`
- `TrajanPro-Bold.woff`

### 2. Helvetica Neue Lt (Secondary Font)
Place font files in: `public/fonts/helvetica-neue-lt/`

Required files:
- `HelveticaNeueLt-Regular.woff2`
- `HelveticaNeueLt-Regular.woff`
- `HelveticaNeueLt-Medium.woff2`
- `HelveticaNeueLt-Medium.woff`
- `HelveticaNeueLt-Bold.woff2`
- `HelveticaNeueLt-Bold.woff`
- `HelveticaNeueLt-Italic.woff2`
- `HelveticaNeueLt-Italic.woff`

## How to Add Font Files

1. Obtain the font files from your licensed font provider
2. Convert fonts to web formats (.woff2 and .woff) if needed using tools like:
   - [Transfonter](https://transfonter.org/)
   - [Font Squirrel Webfont Generator](https://www.fontsquirrel.com/tools/webfont-generator)
3. Place the files in the directories mentioned above
4. Ensure file names match exactly as listed

## Usage in Code

### Tailwind Classes
- **Primary font (Trajan Pro)**: `font-primary`, `font-heading`, `font-display`
- **Secondary font (Helvetica Neue Lt)**: `font-secondary`, `font-body`, `font-sans`

### Examples
```jsx
// Heading with Trajan Pro
<h1 className="font-heading text-3xl">Title</h1>

// Body text with Helvetica Neue Lt
<p className="font-body">Body text</p>

// Or use the semantic names
<h2 className="font-primary">Primary Font</h2>
<div className="font-secondary">Secondary Font</div>
```

## Fallback Fonts

If the font files are not loaded, the system will fall back to:
- **Trajan Pro → Generic serif fonts**
- **Helvetica Neue Lt → Helvetica Neue → Helvetica → Arial → Generic sans-serif**

## License Compliance

Ensure you have proper licenses for both fonts before using them in production:
- Trajan Pro is a commercial font by Adobe
- Helvetica Neue is a commercial font by Linotype

Make sure your license covers web usage.
