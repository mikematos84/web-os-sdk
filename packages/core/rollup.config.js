import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
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

export default [
  // Universal builds (ESM and CJS) - works in both React and vanilla environments
  {
    input: "src/index.ts",
    output: [
      {
        file: pkg.module,
        format: "esm",
        sourcemap: true,
      },
      {
        file: pkg.main,
        format: "cjs",
        sourcemap: true,
      },
    ],
    external: ["react", "react-dom"], // don't bundle React
    plugins: [typescript({ tsconfig: "./tsconfig.json" }), terser()],
  },

  // UMD build for browser usage (works in both React and vanilla environments)
  {
    input: "src/index.ts",
    output: {
      file: "dist/core.umd.js",
      format: "umd",
      name: "WebOsCore",
      sourcemap: true,
      globals: {
        react: "React",
        "react-dom": "ReactDOM",
      },
    },
    external: ["react", "react-dom"],
    plugins: [typescript({ tsconfig: "./tsconfig.json" }), terser()],
  },

  // Type declarations
  {
    input: "src/index.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()],
  },
];
