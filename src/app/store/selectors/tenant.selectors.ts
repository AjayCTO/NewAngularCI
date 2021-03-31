import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IEventsSlice, eventsStateKey } from '../reducers/tenant.reducer';
import { EventsStoreState } from '..';
import { state } from '@angular/animations';

export const getEventsStoreState = createFeatureSelector<EventsStoreState>('eventsStore');
export const getEventsState = createSelector(getEventsStoreState, state => state[eventsStateKey]);

export const selectSelectedTenantId = createSelector(getEventsState, state =>
    state.selectedTenantId || (state.selectedTenant && state.selectedTenant.tenantId));

export const selectSelectedTenant = createSelector(getEventsState, state => state.selectedTenant);

export const selectMyInventoryColumn = createSelector(getEventsState, state => state.myInventoryColumn);

export const getSeletectEvent = createSelector(getEventsState, state => state.selectedEvent);

export const getSelectedCart = createSelector(getEventsState, state => state.cartDetails);