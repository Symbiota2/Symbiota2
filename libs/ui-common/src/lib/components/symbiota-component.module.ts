import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetectLinksPipe } from './detect-links.pipe';
import { Symbiota2ExpansionPanelComponent } from './expansion-panel/expansion-panel.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { FileUploadFieldComponent } from './file-upload-field/file-upload-field.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FlexModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';


@NgModule({
    declarations: [
        DetectLinksPipe,
        Symbiota2ExpansionPanelComponent,
        FileUploadFieldComponent
    ],
    imports: [
        CommonModule,
        MatExpansionModule,
        MatButtonModule,
        MatInputModule,
        FlexModule,
        FormsModule
    ],
    exports: [
        DetectLinksPipe,
        Symbiota2ExpansionPanelComponent,
        FileUploadFieldComponent
    ]
})
export class SymbiotaComponentModule {
}
