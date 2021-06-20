import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import fs from 'fs'


export default defineConfig ( ({ mode }) => ({
    plugins: [ reactRefresh () ],
    publicDir: 'assets/public',
    resolve: {
        alias: fs.readdirSync ( __dirname ).reduce (
            ( acc, val ) => ({ ...acc, [ val ]: `/${ val }` })
        , {} )
    },
    esbuild: {
        jsxInject: `
            import React from 'react';
        `
    }
}) )
