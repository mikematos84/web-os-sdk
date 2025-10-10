import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import replace from "@rollup/plugin-replace";
import dts from "rollup-plugin-dts";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

// Get current file path and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json
const pkg = JSON.parse(
  readFileSync(resolve(__dirname, "./package.json"), "utf8"),
);

// Shared plugin configuration for bundled builds
const bundledPlugins = [
  typescript({ tsconfig: "./tsconfig.json" }),
  nodeResolve({
    browser: true,
    preferBuiltins: false,
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    dedupe: ['react', 'react-dom']
  }),
  commonjs({
    include: /node_modules/,
    requireReturnsDefault: 'auto'
  }),
  replace({
    'process.env.NODE_ENV': JSON.stringify('production'),
    preventAssignment: true
  }),
  babel({
    babelHelpers: 'bundled',
    exclude: 'node_modules/**',
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    presets: [
      ['@babel/preset-react', { runtime: 'automatic' }],
      '@babel/preset-typescript'
    ]
  }),
  terser(),
];

// Suppress "use client" warnings due to @mui/material 6+
const onwarn = (warning, warn) => {
  if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && warning.message.includes('"use client"')) {
    return;
  }
  warn(warning);
};

export default [
  // React build (external dependencies) - for React projects
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.react.esm.js",  // Changed from index.esm.js
        format: "esm",
        sourcemap: true,
      },
      {
        file: "dist/index.react.cjs.js",  // Changed from index.cjs.js
        format: "cjs",
        sourcemap: true,
      },
    ],
    external: [
      "react", 
      "react-dom", 
      "react-dom/client", 
      "react/jsx-runtime", 
      "@mui/material", 
      "@mui/icons-material",
      "@emotion/react",
      "@emotion/styled"
    ],
    plugins: [typescript({ tsconfig: "./tsconfig.json" }), terser()],
    onwarn: onwarn,
  },

    // Standalone build (bundled) - for vanilla JS projects
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.standalone.esm.js",
        format: "esm", 
        sourcemap: true,
      },
      {
        file: "dist/index.standalone.cjs.js",
        format: "cjs",
        sourcemap: true,
      },
    ],
    external: [], // Bundle everything including React, ReactDOM, and MUI
    plugins: bundledPlugins,
    onwarn: onwarn,
  },

  // UMD build (bundled) - for script tags
  {
    input: "src/index.ts",
    output: {
      file: "dist/core.umd.js",
      format: "umd",
      name: "WebOsCore",
      sourcemap: true,
    },
    external: [],
    plugins: bundledPlugins,
    onwarn: onwarn,
  },

  // Type declarations
  {
    input: "src/index.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()],
    onwarn: onwarn,
  },
];
