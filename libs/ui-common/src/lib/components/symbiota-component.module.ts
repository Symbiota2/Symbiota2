import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetectLinksPipe } from './detect-links.pipe';


@NgModule({
    declarations: [
        DetectLinksPipe
    ],
    imports: [
        CommonModule
    ],
    exports: [
        DetectLinksPipe
    ]
})
export class SymbiotaComponentModule { }
