import { Component, forwardRef, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'symbiota2-taxonomy-field-map-select',
    templateUrl: './taxonomy-field-map-select.component.html',
    styleUrls: ['./taxonomy-field-map-select.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        multi: true,
        useExisting: forwardRef(() => TaxonomyFieldMapSelectComponent)
    }]
})
export class TaxonomyFieldMapSelectComponent implements ControlValueAccessor, OnInit {
    @Input() options: { text: string, disabled: boolean }[] = [];
    @Input() value = '';
    @Output() valueChanged = new EventEmitter<string>();

    private onTouchedListener: () => void = null;
    private onChangedListener: (value: string) => void = null;

    constructor() { }

    ngOnInit() {
        this.valueChanged.subscribe((val) => {
            if (this.onChangedListener) {
                this.onChangedListener(val);
            }
        });
    }

    registerOnChange(fn: (v: string) => void): void {
        this.onChangedListener = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouchedListener = fn;
    }

    writeValue(obj: string): void {
        this.value = obj;
    }
}
