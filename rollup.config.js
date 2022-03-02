import ts from 'rollup-plugin-ts';

export default [
  {
    input: 'src/index.ts',
    output: {
      format: 'umd',
      name: 'Start3d',
      file: 'build/start3d.umd.js',
      sourcemap: true
    },
    plugins: [
      ts(),
      // copy({
      //   targets: [
      //     { src: 'public/*', dest: 'build' },
      //   ]
      // })
    ]
  },
  {
    input: 'src/index.ts',
    output: {
      format: 'esm',
      name: 'Start3d',
      file: 'build/start3d.module.js',
      sourcemap: true
    },
    plugins: [
      ts(),
    ]
  }
]