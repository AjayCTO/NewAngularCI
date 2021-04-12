import { TenantActionTypes, TenantAction } from '../actions/tenant.action';
import { Tenant } from '../models/tenant.model';
import * as fromEvents from '../actions/tenant.action';
import * as storage from '../state/storage';

export interface ITenantState {
    selectedTenantId: number;
    selectedTenant: Tenant;
    myInventoryColumn: any;
    selectedEvent: any;
    cartDetails: any[];
    tenantConfiguration: any;
}
export const eventsStateKey = 'eventState';

export interface IEventsSlice {
    [eventsStateKey]: ITenantState;
}

export const initialState: ITenantState = {
    selectedTenantId: storage.getItem('eventState').selectedTenantId,
    selectedTenant: storage.getItem('eventState').selectedTenant,
    myInventoryColumn: storage.getItem('eventState').myInventoryColumn,
    selectedEvent: storage.getItem('eventState').selectedEvent,
    cartDetails: storage.getItem('eventState').cartDetails,
    tenantConfiguration: storage.getItem('eventState').tenantConfiguration
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

        case fromEvents.SET_MYINVENTORY_COLUMN: {
            return {
                ...state,
                myInventoryColumn: action.payload ?? null,
            }
        }

        case fromEvents.SET_SELECTED_EVENT: {
            return {
                ...state,
                selectedEvent: action.payload ?? null,

            }
        }

        case fromEvents.SET_SELECTED_CART: {
            return {
                ...state,
                cartDetails: action.payload ?? null,
            }
        }

        case fromEvents.SET_TENENT_CONFIGE: {
            return {
                ...state,
                tenantConfiguration: action.payload ?? null,
            }
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
        myInventoryColumn: state.myInventoryColumn,
        selectedEvent: state.selectedEvent,
        cartDetails: state.cartDetails,
    };
};


