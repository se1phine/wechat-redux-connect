import connector from "./connector";
import { isFn } from "./utils";
import { combineReducers, createStore } from 'redux/dist/redux.min';

let store;

const INITITAL_REDUCER = (state, action) => {
  if (action.type === 'UPDATE_STATE') {
    return { ...state, ...action.payload };
  }
  return state;
};

const getStore = (reducer = INITITAL_REDUCER, preloadedState = {}) => {
  if (store) return store;
  store = isFn(reducer) ? createStore(reducer, preloadedState) : createStore(combineReducers(reducer));
  return store;
}

const connectPage = (reducer, preloadedState) => (mapState, mapDispatch) => {
  return connector.Page(getStore(reducer, preloadedState), mapState, mapDispatch);
}

const connectApp = (reducer = INITITAL_REDUCER, preloadedState = {}) => (mapState, mapDispatch) => {
  return connector.App(getStore(reducer, preloadedState), mapState, mapDispatch);
}

export default { connectPage, connectApp };
