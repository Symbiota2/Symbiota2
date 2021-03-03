import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-expansion-panel',
  templateUrl: './expansion-panel.component.html'
})
export class ExpansionPanelComponent {
    @Input() title = "";
    @Input() expanded = false;
}
