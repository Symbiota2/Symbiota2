import { NgModule } from "@angular/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from "@angular/material/card";
import { MatTabsModule } from "@angular/material/tabs";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';

/**
 * Imports the @angular/material modules used by the core of the UI
 */
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
        MatDialogModule,
        MatSelectModule,
        MatDividerModule,
        MatBadgeModule
    ],
    exports: [
        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        MatInputModule,
        MatTabsModule,
        MatMenuModule,
        MatIconModule,
        MatDialogModule,
        MatSelectModule,
        MatDividerModule,
        MatBadgeModule
    ]
})
export class MaterialModule { }
