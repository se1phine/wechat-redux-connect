import * as Redux from 'redux';
import createSagaMiddleware from 'redux-saga';
import * as SagaEffects from 'redux-saga/effects';
import { isFn, noop, shallowEqual, callInContext } from './utils';

let store = null;

const setStore = _store => {
  store = _store;
};

const getConnector = mapStateToData => {
  if (store === null) throw new Error('Please set store first!');

  let subscription = null;
  const listeners = [];

  const createListener = (context) => {
    let prevState;
    const listener = function (state, action) {
      const nextState = mapStateToData(state);
      if (shallowEqual(nextState, prevState)) {
        return;
      }
      if (listener.isActive) {
        listener.stashed = null;
        context.onStateChange(nextState, prevState, action);
      } else {
        listener.stashed = [nextState, prevState, action];
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

  const injectPageLifeCycle = (config) => {
    const { onLoad, onUnload, onShow, onHide, onStateChange } = config;

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
      onStateChange: function (nextState) {
        if (!onStateChange) {
          this.setData({ ...nextState });
        } else {
          callInContext(onStateChange, this, arguments);
        }
      },
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
    if (!isFn(mapStateToData)) {
      return config;
    }
    setupSubscription();
    return { ...config, ...injectPageLifeCycle(config) };
  };
};

export default {
  Redux,
  createSagaMiddleware,
  SagaEffects,
  setStore,
  getConnector,
  dispatch: (action) => store ? store.dispatch(action) : noop(),
};
