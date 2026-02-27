import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        tailwindcss(),
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        dedupe: ['react', 'react-dom'],
        alias: {
          // FIX: `__dirname` is not available in an ES module context.
          // `path.resolve('.')` resolves to the current working directory, which is the project root when running Vite.
          '@': path.resolve('.'),
        }
      },
      optimizeDeps: {
        include: ['react', 'react-dom', 'react-router-dom'],
      }
    };
});