import ts from 'rollup-plugin-ts';
import copy from 'rollup-plugin-copy'

export default [
  {
    input: 'src/index.ts',
    output: {
      format: 'umd',
      name: 'Start3d',
      file: 'dist/start3d.js',
      sourcemap: true
    },
    plugins: [
      ts(),
      copy({
        targets: [
          { src: 'public/*', dest: 'dist' },
        ]
      })
    ]
  },
  // {
  //   input: 'src/index.ts',
  //   output: {
  //     format: 'esm',
  //     file: 'build/start3d.module.js'
  //   },
  //   plugins: [
  //     ts(),
  //   ]
  // }
]