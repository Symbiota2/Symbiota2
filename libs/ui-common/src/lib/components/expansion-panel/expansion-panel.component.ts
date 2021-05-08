import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'symbiota2-expansion-panel',
  templateUrl: './expansion-panel.component.html',
  styleUrls: ['./expansion-panel.component.scss']
})
export class Symbiota2ExpansionPanelComponent {
    @Input() label = '';
    @Input() required = false;
    @Input() expanded = true;
    @Output() expandedChange = new EventEmitter<boolean>();
}
