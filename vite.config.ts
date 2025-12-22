import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
// import {visualizer} from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()], // visualizer() temporarily disabled due to dependency issues
    optimizeDeps: {
      include: ['@casl/react', '@casl/ability'],
      force: true
    },
    server: {
      port: 3000,
      strictPort: true,
      host: "localhost",
      proxy: {
        "/api": {
          target: "http://localhost:5000",
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '/api/v1'),
        },
      }
    },
    preview: {
      port: 3000,
      host: true, // 👈 ensures it binds to 0.0.0.0
      allowedHosts: ['qatalyst.tech', 'staging-stage012.qatalyst.tech']
    },
    // Load environment variables from .env file
    envDir: ".",
    envPrefix: ["VITE_", "STORAGE_", "CONTAINER_", "AZURE_", "SAS_"],
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            'tiptap': [
              '@tiptap/react',
              '@tiptap/starter-kit',
              '@tiptap/extension-heading',
              '@tiptap/extension-link',
              '@tiptap/extension-placeholder',
              '@tiptap/extension-underline'
            ],
            'data': [
              '@apollo/client',
              'graphql',
              'rxjs'
            ],
            'ui': [
              'react-leaflet',
              'recharts',
              'framer-motion',
              'lucide-react',
              'styled-components'
            ],
            'azure': [
              '@azure/msal-browser',
              '@azure/msal-react',
              '@azure/storage-blob'
            ]
          }
        }
      }
    }
  };
});
