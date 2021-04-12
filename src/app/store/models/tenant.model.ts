export interface Tenant {
    tenantId: number;
    name: string;
    tenantColor: string;
    accountId: number;
    createdBy: string;

}

export interface TenantConfig {
    id: number;
    theme: string;
    timeZone: string;
    costTracking: boolean;
    automatedItems: boolean;
    componentList: boolean;
    defaultQuantity: boolean;
    lowQuantityThreshold: boolean;
    negativeQuantity: boolean;
    quantityReachesZero: boolean;
    restocking: boolean;
    isLockItemLibrary: boolean;
    isLockLocationLibrary: boolean;
    isLockUOMLibrary: boolean;
    locationTermCustomized: string;
    uOMTermCustomized: string;
    itemTermCustomized: string;
    quantityTermCustomized: string;
}