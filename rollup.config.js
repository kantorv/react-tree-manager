import commonjs   from "@rollup/plugin-commonjs";
import resolve    from "@rollup/plugin-node-resolve";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import typescript from "@rollup/plugin-typescript";
import postcss    from "rollup-plugin-postcss";
import url        from '@rollup/plugin-url'
import svgr       from '@svgr/rollup'
import dts        from 'rollup-plugin-dts'

import packageJson from "./package.json";

// eslint-disable-next-line import/no-anonymous-default-export
export default [{
  input: "./src/index.ts",
  output: [
    {
      file: packageJson.main,
      format: "cjs",
      sourcemap: true
    },
    {
      file: packageJson.module,
      format: "esm",
      sourcemap: true
    }
  ],
  plugins: [
    peerDepsExternal(),
    resolve(), 
    commonjs(), 
    typescript(),
    postcss(),
    url(),
    svgr(),
  ],
  onwarn: (warning, warn) => {
    // Ignore 'use client' warnings
    if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
    warn(warning);
  },
},
{
  input: './build/dts/index.d.ts',
  output: [{ file: 'build/index.d.ts', format: 'es' }],
  plugins: [dts()],
}
];
