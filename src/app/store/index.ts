import {
    ActionReducer,
    ActionReducerMap,
    createFeatureSelector,
    createSelector,
    MetaReducer,

} from '@ngrx/store';

import * as fromEvents from './reducers/tenant.reducer';
import { eventsStateKey } from './reducers/tenant.reducer';
import { localStorageSync } from 'ngrx-store-localstorage';
import { environment } from '../../environments/environment';

export interface EventsStoreState {
    [eventsStateKey]: fromEvents.ITenantState;
}
export const eventsStoreReducers: ActionReducerMap<EventsStoreState> = {
    [eventsStateKey]: fromEvents.TenantReducer,
}

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
    return localStorageSync({ keys: [eventsStateKey] })(reducer);
}
export function debug(reducer: ActionReducer<any>): ActionReducer<any> {

    return function (state, action) {
        return reducer(state, action);
    };
}

export const metaReducers: MetaReducer<EventsStoreState>[] = !environment.production ? [debug, localStorageSyncReducer] : [localStorageSyncReducer];

export const getEventsStoreState = createFeatureSelector<EventsStoreState>(
    'eventsStore');

