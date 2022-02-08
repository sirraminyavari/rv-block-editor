import { defineConfig } from 'vite'
import fs from 'fs'


export default defineConfig ( ({ mode }) => ({
    root: 'BlockEditor/index.tsx',
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
