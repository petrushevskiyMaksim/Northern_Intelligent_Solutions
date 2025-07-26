import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { cssModules } from './config/plugins/cssModules';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        cssModules(),
        svgr({
            include: '**/*.svg',
        }),
    ],
    css: {
        modules: {
            localsConvention: 'camelCase', // чтобы писать `styles.myClass` вместо `styles['my-class']`
        },
    },
    optimizeDeps: {
        include: ['@mui/material'], // MUI стили загружаются первыми
    },
    server: {
        port: 5173, // стандартный порт Vite
        strictPort: true,
    },
});
