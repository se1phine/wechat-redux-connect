### 使用
1. 下载编译后的文件 [wechat-redux-connect.min.js](https://github.com/se1phine/wechat-redux-connect/releases/download/0.1.0/wechat-redux-connect.min.js)
2. 简单示例，[代码片段](https://developers.weixin.qq.com/s/7hTkREmn7DiC)
``` javascript
// connector.js
import connector from '../lib/wechat-redux-connect.min';

const reducer = (state, action) => {
  if (action.type === 'UPDATE_STATE') {
    return { ...state, ...action.payload };
  }
  return state;
};
const preloadedState = {};

export const connectPage = connector.connectPage(reducer, preloadedState);
export const connectApp = connector.connectApp(reducer, preloadedState);
```

``` javascript
// app.js
import { connectApp } from './connector';

const mapState = state => state;
const mapDispatch = dispatch => ({
  setCount: data => dispatch({ type: 'UPDATE_STATE', payload: { count: data } }),
});

App(connectApp(mapState, mapDispatch)({
  onLaunch(options) {},
  globalData: {},
}));
```

``` javascript
// /pages/page1/index.js
import { connectPage } from './connector';

const mapState = state => state;
const mapDispatch = dispatch => ({
  setCount: data => dispatch({ type: 'UPDATE_STATE', payload: { count: data } }),
});
Page({
	data: {},
});

```
### 更新 redux 版本后自行编译编译
1. `npm i`
2. `npm run build`，编译后文件仅 `11.4k`

### 参考
1. [微信小程序npm第三方包全局变量 process.env.NODE 未定义](https://developers.weixin.qq.com/community/develop/doc/00020e18868198cdf2e7395945d800)
2. [xixilive/redux-weapp](https://github.com/xixilive/redux-weapp)
