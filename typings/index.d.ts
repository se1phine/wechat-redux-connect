import * as ReduxType from 'redux';
import {SagaMiddleware, SagaMiddlewareOptions} from "redux-saga";
import * as SagaEffectsType from "redux-saga/effects";

export const Redux: typeof ReduxType;
export function createSagaMiddleware<C extends object>(options?: SagaMiddlewareOptions<C>): SagaMiddleware<C>;
export const SagaEffects: typeof SagaEffectsType;
export function setStore(store: ReduxType.Store): void;
export function getConnector(mapStateToData): any;
export const dispatch: ReduxType.Dispatch;
