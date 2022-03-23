import { NgModule } from '@angular/core';
import { TranslateModule } from "@ngx-translate/core";
import { CommonModule } from '@angular/common';
import { SymbiotaUiPlugin } from '@symbiota2/ui-common';

@NgModule({
  imports: [CommonModule, TranslateModule],
})
export class ChecklistPlugin extends SymbiotaUiPlugin {
  static readonly PLUGIN_NAME = 'plugins.checklist.name';

  constructor() {
    super();
  }
}
