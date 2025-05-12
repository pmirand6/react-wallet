import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {configDefaults} from 'vitest/config';
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/test/setup.ts',
        exclude: [...configDefaults.exclude, 'e2e'],
    },
});
