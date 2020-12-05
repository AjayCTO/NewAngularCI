import { Tenant } from './tenant.model';

export interface AppState {
    readonly tenant: Tenant
}