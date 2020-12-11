import fs from 'fs';
import path from 'path';

import sizes from 'rollup-plugin-sizes';

import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';

import { terser } from "rollup-plugin-terser";
import replace from "@rollup/plugin-replace";


const input = `src/index.js`

const config = {
  input,
  // output: {
  //   name: 'parseQuery',
  //   file: 'dist/bundle.umd.js',
  //   format: 'umd'
  // },
  output: [
    { name: 'parseQuery', file: "dist/parseQuery.umd.js", format: "umd" },
    { name: 'parseQuery', file: "dist/parseQuery.umd.min.js", format: "umd", plugins: [terser()] },
    { name: 'parseQuery', file: "dist/parseQuery.esm.js", format: "esm" },
    { name: 'parseQuery', file: "dist/parseQuery.esm.min.js", format: "esm", plugins: [terser()] }
  ],
  // inlineDynamicImports: true,
  plugins: {
    // replace: {
    //   'process.env.NODE_ENV': JSON.stringify('production'),
    //   'process.env.ES_BUILD': JSON.stringify('false'),
    // },
    // babel: {
    //   exclude: 'node_modules/**',
    //   extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
    // },
  },
  
  plugins: [
    resolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
      babelHelpers: 'bundled',
      presets: [
        [
          '@babel/preset-env',
          {
            targets: [ 'defaults', 'not IE 11', 'maintained node versions' ],
          },
        ],
      ],
    }),
    sizes(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
      // 'process.env.ES_BUILD': JSON.stringify('false'),
      // 'process.env.ES_BUILD': JSON.stringify('true'),
    }),
  ]
};

export default config
