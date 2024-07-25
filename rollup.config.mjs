import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';

const inputs = ['src/tiny-invariant.ts', 'src/tiny-invariant-keep-messages.ts'];

const createConfig = (input, fileSuffix = '') => ({
  input,
  output: {
    file: `dist/${input.split('/').pop().replace('.ts', fileSuffix + '.js')}`,
    format: 'umd',
    name: input.includes('keep-messages') ? 'invariantKeepMessages' : 'invariant',
  },
  plugins: [typescript({ module: 'ESNext' })],
});

export default [
  // UMD build
  ...inputs.map(input => createConfig(input)),
  
  // UMD build (production)
  ...inputs.map(input => ({
    ...createConfig(input, '.min'),
    plugins: [
      replace({ 'process.env.NODE_ENV': JSON.stringify('production'), preventAssignment: true }),
      typescript({ module: 'ESNext' }),
      terser(),
    ],
  })),
  
  // ESM build
  ...inputs.map(input => ({
    input,
    output: {
      file: `dist/${input.split('/').pop().replace('.ts', '.esm.js')}`,
      format: 'esm',
    },
    plugins: [typescript({ module: 'ESNext' })],
  })),
  
  // ESM build for "module": "node16" TypeScript projects
  ...inputs.map(input => ({
    input,
    output: {
      file: `dist/esm/${input.split('/').pop().replace('.ts', '.js')}`,
      format: 'esm',
    },
    plugins: [
      typescript({ module: 'ESNext' }),
      {
        generateBundle() {
          this.emitFile({
            fileName: 'package.json',
            source: `{ "type": "module" }\n`,
            type: 'asset',
          });
        },
        name: 'emit-module-package-file',
      },
    ],
  })),
  
  // CommonJS build
  ...inputs.map(input => ({
    input,
    output: {
      file: `dist/${input.split('/').pop().replace('.ts', '.cjs.js')}`,
      format: 'cjs',
      exports: 'default',
    },
    plugins: [typescript({ module: 'ESNext' })],
  })),
];
