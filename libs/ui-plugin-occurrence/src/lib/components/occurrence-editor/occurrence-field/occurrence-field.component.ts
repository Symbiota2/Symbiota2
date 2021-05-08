import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'symbiota2-occurrence-field',
    templateUrl: './occurrence-field.component.html',
    styleUrls: ['./occurrence-field.component.scss']
})
export class OccurrenceFieldComponent {
    @Input() label: string;
    @Input() type: 'text' | 'number' | 'date' = 'text';
    @Input() control: FormControl;
    @Input() helpLink = '';

    constructor() { }
}
