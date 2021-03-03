import { NgModule } from "@angular/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from "@angular/material/card";
import { MatTabsModule } from "@angular/material/tabs";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";

@NgModule({
    declarations: [],
    imports: [
        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        MatInputModule,
        MatTabsModule,
        MatMenuModule,
        MatIconModule,
        MatDialogModule
    ],
    exports: [
        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        MatInputModule,
        MatTabsModule,
        MatMenuModule,
        MatIconModule,
        MatDialogModule
    ]
})
export class MaterialModule { }
