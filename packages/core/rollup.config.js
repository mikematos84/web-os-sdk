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
  // JS builds
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
      {
        file: "dist/core.umd.js",
        format: "umd",
        name: "webOs",
        sourcemap: true,
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    ],
    external: ["react", "react-dom"], // don’t bundle React
    plugins: [typescript({ tsconfig: "./tsconfig.json" }), terser()],
  },

  // Type declarations
  {
    input: "src/index.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()],
  },
];
