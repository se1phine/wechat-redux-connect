import { uglify } from 'rollup-plugin-uglify';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import cjs from '@rollup/plugin-commonjs';
import replace from "@rollup/plugin-replace";
import banner from 'rollup-plugin-banner'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/wechat-redux-connect.min.js',
    name: 'connect',
    format: 'umd'
  },
  plugins: [
    resolve(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    babel({
      babelHelpers: 'bundled'
    }),
    cjs({ include: /node_modules/ }),
    uglify(),
    banner('wechat-redux-connect\nversion: <%= pkg.version %>\nrepository: <%= pkg.repository %>')
  ],
};
