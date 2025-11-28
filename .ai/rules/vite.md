# Vite Configuration and Best Practices

## Project Setup

### Basic vite.config.ts
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/assets': path.resolve(__dirname, './src/assets'),
      '@/api': path.resolve(__dirname, './src/api'),
      '@/store': path.resolve(__dirname, './src/store'),
      '@/config': path.resolve(__dirname, './src/config'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
```

### TypeScript Configuration
Update `tsconfig.json` to match Vite aliases:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/types/*": ["./src/types/*"],
      "@/assets/*": ["./src/assets/*"],
      "@/api/*": ["./src/api/*"],
      "@/store/*": ["./src/store/*"],
      "@/config/*": ["./src/config/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## Environment Variables

### Configuration
Create environment files:
```
.env                 # Default values
.env.local           # Local overrides (git-ignored)
.env.development     # Development-specific
.env.production      # Production-specific
```

### Usage
Prefix all environment variables with `VITE_`:
```bash
# .env
VITE_API_URL=https://api.example.com
VITE_APP_TITLE=My App
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;
const mode = import.meta.env.MODE;
```

### Type Safety
Create type definitions for env variables:
```typescript
// src/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_TITLE: string;
  // Add more env variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

## Asset Handling

### Static Assets
Place static assets in `public/` for direct access:
```
public/
├── favicon.ico
├── robots.txt
└── images/
    └── logo.png
```

Access directly: `/images/logo.png`

### Imported Assets
Import assets in code for bundling:
```typescript
// Processed by Vite
import logo from '@/assets/logo.png';
import styles from './Component.module.css';

// SVGs as React components
import { ReactComponent as Icon } from '@/assets/icon.svg';
```

### Image Optimization
Install and use vite-plugin-image-optimizer:
```typescript
import { defineConfig } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig({
  plugins: [
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80 },
      webp: { quality: 80 },
    }),
  ],
});
```

## Code Splitting

### Route-Based Splitting
Use React.lazy for route-based code splitting:
```typescript
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('@/pages/Home'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Settings = lazy(() => import('@/pages/Settings'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

### Manual Chunks
Configure manual chunks for better caching:
```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        },
      },
    },
  },
});
```

## Performance Optimization

### Build Optimization
```typescript
export default defineConfig({
  build: {
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Hash filenames for better caching
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
    },
  },
});
```

### Development Optimization
```typescript
export default defineConfig({
  server: {
    hmr: true, // Hot Module Replacement
    fs: {
      // Restrict access to project root
      strict: true,
    },
  },
  optimizeDeps: {
    // Pre-bundle dependencies
    include: ['react', 'react-dom', 'react-router-dom'],
  },
});
```

## Plugin Configuration

### Essential Plugins
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    
    // Import SVGs as React components
    svgr(),
    
    // Bundle size analysis (development only)
    process.env.ANALYZE && visualizer({
      open: true,
      filename: 'dist/stats.html',
    }),
  ],
});
```

### TypeScript React Plugin Options
```typescript
export default defineConfig({
  plugins: [
    react({
      // Enable Fast Refresh
      fastRefresh: true,
      
      // Babel options
      babel: {
        plugins: [
          // Add custom babel plugins here
        ],
      },
      
      // JSX runtime (automatic by default)
      jsxRuntime: 'automatic',
    }),
  ],
});
```

## Proxy Configuration

### API Proxy (Development)
```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://backend.example.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/auth': {
        target: 'https://auth.example.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
```

## Testing Integration

### Vitest Configuration
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
      ],
    },
  },
});
```

## Preview and Build

### Commands
```bash
# Development
pnpm dev

# Build for production
pnpm build

# Preview production build locally
pnpm preview

# Build with bundle analysis
ANALYZE=true pnpm build
```

### Preview Configuration
```typescript
export default defineConfig({
  preview: {
    port: 4173,
    open: true,
    cors: true,
  },
});
```

## PWA Configuration

### Using vite-plugin-pwa
```typescript
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'My App',
        short_name: 'App',
        description: 'My awesome app',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});
```

## Common Issues and Solutions

### Module Resolution
If imports aren't resolving:
1. Check `tsconfig.json` paths match `vite.config.ts` aliases
2. Restart TypeScript server in IDE
3. Verify `baseUrl` is set correctly

### HMR Not Working
1. Check for circular dependencies
2. Ensure state isn't being lost incorrectly
3. Verify file paths are correct

### Build Errors
1. Check for dynamic imports that might fail
2. Verify all dependencies are installed
3. Clear node_modules and reinstall if needed

### Performance Issues
1. Use `vite-plugin-inspect` to debug
2. Check bundle size with visualizer plugin
3. Optimize dependencies in `optimizeDeps`

## Best Practices

1. **Keep Dependencies Updated**: Vite and plugins evolve rapidly
2. **Use Path Aliases**: Makes imports cleaner and more maintainable
3. **Leverage HMR**: Fast refresh improves development experience
4. **Optimize Build**: Use code splitting and tree shaking
5. **Environment Variables**: Keep secrets out of code
6. **Type Safety**: Define types for env variables and configs
7. **Bundle Analysis**: Regularly check bundle size
8. **Lazy Load**: Split code at route level minimum