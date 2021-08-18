import { Component, forwardRef, Input } from '@angular/core';
import {
    ControlValueAccessor,
    FormControl,
    NG_VALUE_ACCESSOR
} from '@angular/forms';
import {
    _MatAutocompleteBase,
    MatAutocomplete
} from '@angular/material/autocomplete';
import { Observable, of } from 'rxjs';

type FormChangedListener = (value: any) => void;
type FormTouchedListener = () => void;

@Component({
    selector: 'symbiota2-occurrence-field',
    templateUrl: './occurrence-field.component.html',
    styleUrls: ['./occurrence-field.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        multi: true,
        useExisting: forwardRef(() => OccurrenceFieldComponent)
    }]
})
export class OccurrenceFieldComponent implements ControlValueAccessor {
    @Input() label: string;
    @Input() type: 'text' | 'number' | 'date' = 'text';
    @Input() helpLink = '';
    @Input() autoCompleteItems: Observable<any[]> = of([]);

    value: any = null;
    private onChangeListener: FormChangedListener = null;
    private onTouchedListener: FormTouchedListener = null;

    constructor() { }

    registerOnChange(fn: FormChangedListener): void {
        this.onChangeListener = fn;
    }

    registerOnTouched(fn: FormTouchedListener): void {
        this.onTouchedListener = fn;
    }

    writeValue(obj: any) {
        this.value = obj;
    }

    onChange(value: any) {
        if (this.onChangeListener) {
            this.onChangeListener(value);
        }
    }

    onTouched() {
        if (this.onTouchedListener) {
            this.onTouchedListener();
        }
    }
}
