import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const cesiumBuild = "node_modules/cesium/Build/Cesium";

export default defineConfig({
    base: '/',
    plugins: [
        react(),
        viteStaticCopy({
        targets: [
            {
            src: path.join(cesiumBuild, 'Workers'),
            dest: '',
            },
            {
            src: path.join(cesiumBuild, 'Assets'),
            dest: '',
            },
            {
            src: path.join(cesiumBuild, 'Widgets'),
            dest: '',
            },
            {
            src: path.join(cesiumBuild, 'ThirdParty'),
            dest: '',
            },
        ],
        }),
    ],
    resolve: {
        alias: {
        cesium: path.resolve(cesiumBuild),
        },
    },
    define: {
        CESIUM_BASE_URL: JSON.stringify('/'),
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            input: path.resolve('index.html'),
        },
    },
    server: {
        port: 3000,
        proxy: {
            '/api': "http://localhost:5000",
        },
    }
    });
