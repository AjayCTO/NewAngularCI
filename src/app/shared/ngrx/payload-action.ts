import { Action } from '@ngrx/store';

export abstract class PayloadAction<T> implements Action {

    type: string;

    constructor(public payload: T) {
    }
}
