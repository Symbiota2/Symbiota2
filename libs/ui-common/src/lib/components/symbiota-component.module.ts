import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetectLinksPipe } from './detect-links.pipe';
import { Symbiota2ExpansionPanelComponent } from './expansion-panel/expansion-panel.component';
import { MatExpansionModule } from '@angular/material/expansion';


@NgModule({
    declarations: [
        DetectLinksPipe,
        Symbiota2ExpansionPanelComponent
    ],
    imports: [
        CommonModule,
        MatExpansionModule
    ],
    exports: [
        DetectLinksPipe,
        Symbiota2ExpansionPanelComponent
    ]
})
export class SymbiotaComponentModule { }
