import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "src/index.ts", // Entry point of your library
  output: {
    file: "dist/typedfastbitset-bq.js", // Output file
    format: "iife", // Format suitable for BigQuery
    name: "TypedFastBitSet", // Global variable name
    sourcemap: true // Add this line if you want source maps
  },
  plugins: [
    nodeResolve(), // Resolves node_modules
    commonjs(),    // Converts CommonJS modules to ES6
    typescript()   // Compiles TypeScript
  ]
}; 