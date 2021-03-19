import { Action } from '@ngrx/store';
import { Tenant } from '../models/tenant.model';
import { PayloadAction } from '../../shared/ngrx/payload-action';
export enum TenantActionTypes {
    ADD_Tenant = '[Tenant] Add Tenant',
}
export const SET_SELECTED_TENENT = '[Tenants] SET_SELECTED_TENENT';
export const SET_SELECTED_TENENT_ID = '[Tenants] SET_SELECTED_TENENT_ID';
export const SET_MYINVENTORY_COLUMN = '[Tenants] SET_INVENTORY_COLUMN';
export const SET_SELECTED_EVENT = '[Tenants] SET_SELECTED_EVENT';
export class AddTenantAction implements Action {

    readonly type = TenantActionTypes.ADD_Tenant

    constructor(public payload: Tenant) { }
}


export const RESET_STATE = '[Tenants] Reset state';
export class ResetTenantsState implements Action {
    readonly type = RESET_STATE;
}


export class SetSelectedTenant extends PayloadAction<Tenant> {
    readonly type = SET_SELECTED_TENENT;
}

export class SetSelectedTenantId extends PayloadAction<number> {
    readonly type = SET_SELECTED_TENENT_ID;
}

export class SetDefaultInventoryColumn extends PayloadAction<any>{
    readonly type = SET_MYINVENTORY_COLUMN;
}
export class SetSelectedEvent extends PayloadAction<any>{
    readonly type = SET_SELECTED_EVENT
}




export type TenantAction = AddTenantAction | SetSelectedTenant | SetSelectedTenantId | ResetTenantsState | SetDefaultInventoryColumn | SetSelectedEvent