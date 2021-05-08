import {
    Component,
    Input
} from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';

@Component({
    selector: 'symbiota2-collection-field',
    template: `
        <p *ngIf="value">
            <span *ngIf="label" class="bold">{{ label }}: </span>
            <a *ngIf="href else valueContainer" [href]="href" target="_blank">
                {{ value }}
            </a>
            <ng-template #valueContainer>{{ value }}</ng-template>
        </p>
    `,
    styleUrls: ['./collection-field.component.scss']
})
export class CollectionFieldComponent {
    @Input() label: string = null;
    @Input() value: string = null;
    @Input() href: SafeUrl = null;
}
