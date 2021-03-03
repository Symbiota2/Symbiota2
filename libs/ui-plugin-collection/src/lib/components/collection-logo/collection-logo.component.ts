import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'lib-collection-logo',
    templateUrl: './collection-logo.component.html',
    styleUrls: ['./collection-logo.component.scss']
})
export class CollectionLogoComponent {
    @Input() src = "";
    @Input() size = "2.5rem";

    constructor() { }
}
