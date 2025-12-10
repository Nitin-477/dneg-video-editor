import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import federation from '@originjs/vite-plugin-federation';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      /*  babel: {
         plugins: ['babel-plugin-react-compiler'],
       }, */
    }),
    federation({
      name: 'video_editor_remote',
      filename: 'remoteEntry.js',
      exposes: {
        './VideoEditor': './src/App.tsx',
      },
      shared: {
        react: { singleton: true, eager: true },
        'react-dom': { singleton: true },

      },
      'react-dom': {
        singleton: true,
        eager: true,
      },
    }
    ),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@store': path.resolve(__dirname, './src/store'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types'),
    },
  },
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 3001,
    cors: true,
  },
  preview: {
    port: 3001,
  },
});
