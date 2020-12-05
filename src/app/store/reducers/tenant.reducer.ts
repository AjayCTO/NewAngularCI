import { TenantActionTypes, TenantAction } from '../actions/tenant.action';
import { Tenant } from '../models/tenant.model';
import * as fromEvents from '../actions/tenant.action';
import * as storage from '../state/storage';

export interface ITenantState {
    selectedTenantId: number;
    selectedTenant: Tenant;

}
export const eventsStateKey = 'eventState';

export interface IEventsSlice {
    [eventsStateKey]: ITenantState;
}

export const initialState: ITenantState = {
    selectedTenantId: storage.getItem('eventState').selectedTenantId,
    selectedTenant: storage.getItem('eventState'),
};

export function TenantReducer(state: ITenantState = initialState, action: fromEvents.TenantAction): ITenantState {

    switch (action.type) {

        case fromEvents.SET_SELECTED_TENENT: {
            return {
                ...state,
                selectedTenant: action.payload,
                selectedTenantId: action.payload ? action.payload.tenantId : null,
            };
        }

        case fromEvents.SET_SELECTED_TENENT_ID: {
            return {
                ...state,
                selectedTenantId: action.payload ?? null,
            };
        }
        case fromEvents.RESET_STATE: ({ ...initialState });
        default:
            return state;

    }
}
export const getTasks = (state: ITenantState) => {
    return {
        selectedTenant: state.selectedTenant,
        selectedTenantId: state.selectedTenantId,
    };
};


