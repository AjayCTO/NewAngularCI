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
export class AttributeFields extends CommanFields {

}
export class CustomFields extends CommanFields {

}
export class StateFields extends CommanFields {

    public isUnique: boolean;
}
export class Status {
    public statusId: number;
    public statusValue: string;
}