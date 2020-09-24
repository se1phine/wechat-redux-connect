import * as Redux from 'redux';
import createSagaMiddleware from 'redux-saga';
import * as SagaEffects from 'redux-saga/effects';
import { isFn, noop, shallowEqual, callInContext } from './utils';

let store = null;

const setStore = _store => {
  store = _store;
};

const getConnector = (mapStateToData, mapDispathToData) => {
  if (store === null) throw new Error('Please set store first!');

  let subscription = null;
  const listeners = [];

  const createListener = (context) => {
    let prevState;
    const listener = function (state, ...args) {
      const nextState = mapStateToData(state);
      if (shallowEqual(nextState, prevState)) {
        return;
      }
      if (listener.isActive) {
        listener.stashed = null;
        context.onStateChange.call(context, nextState, prevState, ...args);
      } else {
        listener.stashed = [nextState, prevState];
      }
      prevState = nextState;
    };

    listener.index = listeners.push(listener) - 1;
    listener.key = `${listener.index}`;
    listener.stashed = null;
    listener.isActive = true;
    listener(store.getState(), 'INIT_SYNC'); // to sync init state
    return listener;
  };

  const injectChangeListenerStatus = (handler, listener, isActive) => {
    return function () {
      listener.isActive = isActive;
      if (listener.stashed) {
        this.onStateChange(...listener.stashed);
      }
      return callInContext(handler, this, arguments);
    };
  };

  const injectRemoveListener = (handler, listener) => {
    return function () {
      listeners.splice(listener.index, 1);
      return callInContext(handler, this, arguments);
    };
  };

  const injectOnStateChange = (handler) => {
    return function () {
      if (!handler) return this.setData({ ...this.data, ...Array.prototype.shift.call(arguments) });
      return callInContext(handler, this, arguments);
    };
  };

  const injectPageLifeCycle = (config) => {
    const {onLoad, onUnload, onShow, onHide, onStateChange} = config;

    return {
      onLoad: function () {
        const listener = createListener(this);
        this.onShow = injectChangeListenerStatus(onShow, listener, true);
        this.onHide = injectChangeListenerStatus(onHide, listener, false);
        this.onUnload = injectRemoveListener(onUnload, listener);
        return callInContext(onLoad, this, arguments);
      },

      onUnload: isFn(onUnload) ? onUnload : noop,
      onShow: isFn(onShow) ? onShow : noop,
      onHide: isFn(onHide) ? onHide : noop,
      onStateChange: injectOnStateChange(onStateChange, 'page')
    };
  };

  const setupSubscription = () => {
    if (isFn(subscription)) {
      return subscription;
    }
    return (subscription = store.subscribe(() => {
      const state = store.getState();
      listeners.forEach(fn => fn(state));
    }));
  };

  return config => {
    const overrides = isFn(mapStateToData) ? mapDispathToData(store.dispatch) : {};
    const mergedConfig = {...config, ...overrides};
    if (!isFn(mapStateToData)) {
      return mergedConfig;
    }
    setupSubscription();
    return {...mergedConfig, ...injectPageLifeCycle(mergedConfig)};
  }
};

export default {
  Redux,
  createSagaMiddleware,
  SagaEffects,
  setStore,
  getConnector,
}
