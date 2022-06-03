import { NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";

import {
    ApiClientModule, AppConfigService,
    NavBarLink, SymbiotaComponentModule,
    SymbiotaUiPlugin
} from '@symbiota2/ui-common';

import { Route, RouterModule } from "@angular/router";
import { MatDialogModule } from "@angular/material/dialog";
import { MatCardModule } from "@angular/material/card";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatNativeDateModule, MatOptionModule } from "@angular/material/core";
import { MatButtonModule } from "@angular/material/button";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { FlexModule } from "@angular/flex-layout";
import { MatTreeModule } from '@angular/material/tree';
import { EditableParagraphComponent, EditableParagraphDialogComponent, EditableTextComponent, EditableTextDialogComponent } from './components';

import {
    I18nService,
} from './services';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips'
import { QuillModule } from 'ngx-quill';

@NgModule({
    imports: [
        ApiClientModule,
        BrowserModule,
        BrowserAnimationsModule,
        CommonModule,
        FormsModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatCardModule,
        MatDatepickerModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatNativeDateModule,
        MatOptionModule,
        MatSelectModule,
        ReactiveFormsModule,
        RouterModule,
        TranslateModule,
        FlexModule,
        MatTreeModule,
        MatCheckboxModule,
        MatListModule,
        MatRadioModule,
        SymbiotaComponentModule,
        MatPaginatorModule,
        MatGridListModule,
        MatTabsModule,
        MatChipsModule,
        QuillModule.forRoot()
    ],
    declarations: [
        EditableParagraphComponent,
        EditableParagraphDialogComponent,
        EditableTextComponent,
        EditableTextDialogComponent
//        FilterPipe
    ],
    providers: [
        I18nService
    ],
    exports: [
        EditableParagraphComponent,
        EditableTextComponent
    ],
    entryComponents: [
        EditableParagraphComponent,
        EditableParagraphDialogComponent,
        EditableTextComponent,
        EditableTextDialogComponent
    ]
})
export class I18nPlugin extends SymbiotaUiPlugin {
    static readonly PLUGIN_NAME = 'plugins.i18n.name';

    constructor(private readonly appConfig: AppConfigService) {
        super();
    }

    static routes(): Route[] {
        return [
        ];
    }

    static navBarLinks(): NavBarLink[] {
        return [
        ]
        }

    }
