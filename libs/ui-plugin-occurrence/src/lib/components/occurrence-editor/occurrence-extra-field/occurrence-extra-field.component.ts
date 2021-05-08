import { Component, Input, Output, EventEmitter } from '@angular/core';
import { OccurrenceExtraField } from '../occurrence-extra-field';

@Component({
    selector: 'symbiota2-occurrence-extra-field',
    templateUrl: './occurrence-extra-field.component.html',
    styleUrls: ['./occurrence-extra-field.component.scss']
})
export class OccurrenceExtraFieldComponent {
    @Input() options: Map<string, OccurrenceExtraField> = new Map();
    @Input() disabledFields: string[] = [];

    @Output() fieldChanged = new EventEmitter<{ key: string, value: unknown }>();

    field = '';
    value: unknown = '';

    constructor() { }

    getFieldType(key: string) {
        if (this.options.has(key)) {
            return this.options.get(key).type;
        }
        return 'text';
    }

    onFieldChanged(field: string): void {
        this.field = field;
        this.emitKeyValue();
    }

    onValueChanged(event: KeyboardEvent): void {
        let value: string | number = (event.target as HTMLInputElement).value;
        if (this.getFieldType(this.field) === 'number') {
            value = parseFloat(value);
        }
        this.value = value;
        this.emitKeyValue();
    }

    emitKeyValue(): void {
        if (this.field !== '' && this.value) {
            this.fieldChanged.emit({ key: this.field, value: this.value });
        }
    }
}
