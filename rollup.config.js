import { uglify } from 'rollup-plugin-uglify';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import cjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/wechat-redux-connect.min.js',
    name: 'connect',
    format: 'umd'
  },
  plugins: [
    resolve(),
    babel({
      babelHelpers: 'bundled'
    }),
    cjs({ include: /node_modules/ }),
    uglify(),
  ],
};
