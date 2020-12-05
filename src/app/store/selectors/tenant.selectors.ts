import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IEventsSlice, eventsStateKey } from '../reducers/tenant.reducer';
import { EventsStoreState } from '..';

export const getEventsStoreState = createFeatureSelector<EventsStoreState>('eventsStore');
export const getEventsState = createSelector(getEventsStoreState, state => state[eventsStateKey]);

export const selectSelectedTenantId = createSelector(getEventsState, state =>
    state.selectedTenantId || (state.selectedTenant && state.selectedTenant.tenantId));

export const selectSelectedTenant = createSelector(getEventsState, state => state.selectedTenant);