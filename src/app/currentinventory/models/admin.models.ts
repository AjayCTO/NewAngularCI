
export class Item {
    public id: number
    public itemname: string;
    public price: string;
    public unitofmeasure: string
    public insert_DateTime: string;
    public update_DateTime: string;
}





export class CommanFields {
    public columnId: number;
    public columnName: string;
    public columnLabel: string;
    public customFieldType: string;
    public dataType: string;
    public columnValue: string;
    public comboBoxValue: string;
    public customFieldIsRequired: boolean;
    public customFieldPrefix: string;
    public customFieldSuffix: string;
    public customFieldInformation: string;
    public customFieldIsIncremental: boolean;
    public customFieldBaseValue: number;
    public customFieldIncrementBy: number;
    public customFieldTextMaxLength: number;
    public customFieldDefaultValue: string;
    public customFieldNumberMin: number;
    public customFieldNumberMax: number;
    public customFieldNumberDecimalPlaces: number;
    public customFieldTrueLabel: string;
    public customFieldFalseLabel: string;
    public customFieldSpecialType: string;
    public dateDefaultPlusMinus: string;
    public dateDefaultNumber: number;
    public dateDefaulInterval: string;
    public timeDefaultPlusMinus: string;
    public timeNumberOfHours: number;
    public timeNumberOFMinutes: number;
    public offsetDateFields: string;
    public offsetTimeFields: string;
}

export class CustomFields extends CommanFields {

}

export class AttributeFields extends CommanFields {

}

export class MyInventoryColumn {
    public ColumnId: string;
    public ColumnName: string;
    public ColumnShow: Boolean;
    public ColumnSort: number;
    public ColumnWidth: string;
    public CustomeFieldType: string;
    public IsOnlyMobile: Boolean;
    public Required: Boolean;
}


export class StateFields extends CommanFields {

    public isUnique: boolean;
}

export class CircumstanceFields extends CommanFields {
    public customFieldIncludeOnAdd: boolean;
    public customFieldIncludeOnStatus: boolean;
    public customFieldIncludeOnSubtract: boolean;
    public customFieldIncludeOnMove: boolean;
    public customFieldIncludeOnConvert: boolean;
    public customFieldIncludeOnApply: boolean;
    public customFieldIncludeOnMoveTagUpdate: boolean;
    public isLineItem: boolean;


}




export class DataColumnFilter {
    public columnName: string;
    public displayName: string;
    public filterOperator: string = "cn";
    public searchValue: string;
    public type: string;
}
export class DataColumnFilter1 {
    public columnName: string;
    public displayName: string;
    public filterOperator: string = "cn";
    public searchValue: string;
    public ColumnDataType: string;
    public type: string;
}




export class Field {
    public id: number;
    public FieldName: string;
    public displayName: string;
    public dataType: string;
    public cfdFieldType: string;
    public prefix: string;
    public suffix: string;
    public cfdBaseValue: number;
    public cfdIsIncremental: boolean;
    public cfdIncrementBy: number;
    public cfdIsRequired: boolean;
    public cfdIncludeOnAdd: boolean;
    public cfdIncludeOnStatus: boolean;
    public cfdIncludeOnSubtract: boolean;
    public cfdIncludeOnMove: boolean;
    public cfdIncludeOnConvert: boolean;
    public cfdIncludeOnApply: boolean;
    public cfdIncludeOnMoveTagUpdate: boolean;
}

export class Location {
    public locationId: number;
    public locationName: string;
    public description: string;
    public locationZone: string;
    public isHidden: boolean;
}


export class AddInventory {
    public itemID: number;
    public itemName: string;
    public itemDescription: string;
    public itemQty: number;
    public uomID: number;
    public locationID: number;
    public customfieldJSON: string;
}

export class CurrentInventory {
    public partId: number;
    public partName: string;
    public partDescription: string;
    public quantity: number;
    public costPerUnit: number;
    public inventoryId: number;
    public uomId: number;
    public uomName: string;
    public transactionDate: Date;
    public locationId: number;
    public locationName: string;
    public statusValue: string;
    public attributeFields: AttributeFields[];
    public circumstanceFields: CircumstanceFields[];
    public stateFields: StateFields[];
    public customFields: [];
    public eventConfiguartion: any;
}

export class Tenant {
    public tenantId: number;
    public name: string;
    public tenantColor: string;
    public accountId: number;
    public createdBy: string;

}


export class Uom {
    public uomId: number;
    public uomName: string;
}

export class Status {
    public statusId: number;
    public statusValue: string;
}

export class Part {
    public partName: string;
    public partDescription: string;
    public uomId: number;
    public locationId: number;
    public statusId: number;
    public primaryImageId: number;
    public lowQtyThreshold: number;
    public highQtyThreshold: number;
    public attributeFields: AttributeFields[];
}


export class partarray {

    public partarray: Part[];
}

export class TransactionTarget {
    public ToLocationId: number;
    public ToConvertedQuantity: number;
    public ToLocation: string;
    public ToStatus: string;
    public ToStatusId: number;
    public ToUom: string;
    public ToUomId: number;
}
export class TransactionTargets {
    public ToLocationId: number;
    public ToConvertedQuantity: number;
    public ToLocation: string;
    public ToStatus: string;
    public Cost: number;
    public ToStatusId: number;
    public ToUom: string;
    public ToUomId: number;
}
export class InventoryTransactionViewModel {
    public partId: number;
    public tenantId: number;
    public uomId: number;
    public locationId: number;
    public transactionQty: number;
    public transactionCostPerUnit: number;
    public transactionQtyChange: number;
    public avgCostPerUnit: number;
    public transactionActionId: number;
    public inventoryId: number;
    public statusValue: string;
    public attributeFields: any[];
    public circumstanceFields: any[];
    public stateFields: any[];
    public customFields: any[];
    public partName: string;
    public partDescription: string;
    public quantity: number;
    public costPerUnit: number;
    public uomName: string;
    public locationName: string;

}

export class ChangeStateFields {

    public columnName: string;
    public columnValue: string;
}
export class ReportTable {
    public ColumnName: any;
    public FilterBy: any;
    public SortOrder: any;
    public SortType: any;
    filterOperator: any = 'cn';
}


